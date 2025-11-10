import settingsIO from "IO/SettingsIO";
import * as Settings from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import exclusionMatcherUtil from "Utils/ExclusionMatcherUtil";
import movingUtil from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";
import timerUtil from "Utils/TimerUtil";
import * as obsidian from "obsidian";
import projectMatcherUtil from "Utils/ProjectMatcherUtil";

export default class AutoMoverPlugin extends obsidian.Plugin {
  settings: Settings.AutoMoverSettings;

  async onload() {
    // console.log("loading plugin");
    movingUtil.init(this.app);
    settingsIO.init(this.app);
    /**
     * Loading settings and creating the settings tab
     */
    this.settings = Object.assign({}, Settings.DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new SettingsTab(this.app, this));

    // negative ifs for easier reading and debugging
    if (!this.areMovingTriggersEnabled()) return;
    if (!this.areThereRulesToApply()) return;

    this.registerEvent(
      this.app.workspace.on("file-open", (file: obsidian.TFile) => {
        if (!this.settings.moveOnOpen) return;
        if (file == null || file.path == null) return;
        if (this.isFileExcluded(file)) return;
        this.matchAndMoveFile(file);
      }),
    );

    this.registerEvent(
      // since i am defining my own event, ts-lint is crying about it but it works in the end
      this.app.workspace.on("AutoMover:automatic-moving-update", () => {
        // console.log("Automatic moving update");
        this.automaticMoving();
      }),
    );

    this.addCommand({
      id: "AutoMover:move-files",
      name: "Move files",
      callback: () => {
        this.goThroughAllFiles();
      },
    });

    this.addRibbonIcon("file-input", "AutoMover: Move files", () => {
      this.goThroughAllFiles();
    });
  }

  /**
   * Reocurring function that will be called by the timer
   *
   * @returns void
   */
  automaticMoving() {
    // console.log("Automatic moving run");
    if (!this.settings.automaticMoving) return;
    if (this.settings.timer == null || this.settings.timer <= 0) return;
    this.goThroughAllFiles();
    timerUtil.startTimer(this.automaticMoving.bind(this), this.settings.timer);
  }

  /**
   * Opens all files in the repository so that the even "file-open" is triggered
   *
   * @returns void
   */
  goThroughAllFiles() {
    // console.log("Going through all files");
    const files = this.app.vault.getFiles();
    for (const file of files) {
      if (file == null || file.path == null) continue;
      if (this.isFileExcluded(file)) continue;
      this.matchAndMoveFile(file);
    }
    new obsidian.Notice("All files moved!", 5000);
  }

  /**
   * Checks if the file is excluded by the exclusion rule
   *
   * @param file - The file to be checked
   * @returns true if the file path is excluded, false otherwise
   */
  isFileExcluded(file: obsidian.TFile): boolean {
    if (!this.areThereExcludedFolders()) return false;
    if (!this.areThereRulesToApply()) return false;

    return exclusionMatcherUtil.isFilePathExcluded(file, this.settings.exclusionRules);
  }

  /**
   * Matches the file to the rule and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns void
   */
  matchAndMoveFile(file: obsidian.TFile): void {
    // console.log("Moving file: ", file.path);
    if (this.matchAndMoveByProject(file)) return;
    else if (this.matchAndMoveByName(file)) return;
    else this.matchAndMoveByTag(file);
  }

  /**
   * Matches the file by name and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns true if the file was moved, false otherwise
   */
  matchAndMoveByName(file: obsidian.TFile): boolean {
    const rule = ruleMatcherUtil.getMatchingRuleByName(file, this.settings.movingRules);
    if (rule == null || rule.folder == null) return false;

    if (ruleMatcherUtil.isRegexGrouped(rule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, rule);
      const finalDestinationPath = ruleMatcherUtil.constructFinalDesinationPath(rule, matches!);
      movingUtil.moveFile(file, finalDestinationPath);
    } else {
      movingUtil.moveFile(file, rule.folder);
    }
    return true;
  }

  /**
   * Matches the file by tags it contains and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns true if the file was moved, false otherwise
   */
  matchAndMoveByTag(file: obsidian.TFile): boolean {
    const tags = this.app.metadataCache.getFileCache(file)?.tags;
    if (tags == null || tags.length === 0) return false;

    const tagRule = ruleMatcherUtil.getMatchingRuleByTag(tags, this.settings.tagRules);

    if (tagRule == null || tagRule.folder == null) return false;

    if (ruleMatcherUtil.isRegexGrouped(tagRule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, tagRule);
      console.log("File: ", file.path);
      console.log("Tag rule: ", tagRule);
      console.log("Tag matches: ", matches);
      const finalDestinationPath = ruleMatcherUtil.constructFinalDesinationPath(tagRule, matches!);
      movingUtil.moveFile(file, finalDestinationPath);
    } else {
      movingUtil.moveFile(file, tagRule.folder);
    }
    return true;
  }

  matchAndMoveByProject(file: obsidian.TFile): boolean {
    const cache = this.app.metadataCache.getFileCache(file);
    if (cache == null) return false;
    if (cache.frontmatter == null) return false;
    if (cache.frontmatter.Project == null && cache.frontmatter.project == null) return false;

    const projectName: string = cache.frontmatter.Project || cache.frontmatter.project;

    const projectRule = projectMatcherUtil.getMatchingProjectRule(projectName, this.settings.projectRules);
    if (projectRule == null || projectRule.folder == null) return false;

    // If no rules defined, move to project root
    if (projectRule.rules == null || projectRule.rules.length === 0) {
      console.log("No rules defined, moving to project root");
      movingUtil.moveFile(file, projectRule.folder);
      return true;
    }

    const rule = ruleMatcherUtil.getMatchingRuleByName(file, projectRule.rules);

    // If no rule matches or folder is "./", move to project root
    if (rule == null || rule.folder === "./") {
      console.log("No matching rule or './' destination, moving to project root");
      movingUtil.moveFile(file, projectRule.folder);
      return true;
    }

    // console.log("Project rule's moving rule found: ", rule);

    if (ruleMatcherUtil.isRegexGrouped(rule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, rule);
      const ruleDesinationPath = ruleMatcherUtil.constructFinalDesinationPath(rule, matches!);
      const finalDestinationPath = projectMatcherUtil.constructProjectDestinationPath(projectRule, ruleDesinationPath);

      movingUtil.moveFile(file, finalDestinationPath);
    } else {
      const finalDestinationPath = projectMatcherUtil.constructProjectDestinationPath(projectRule, rule.folder);

      movingUtil.moveFile(file, finalDestinationPath);
    }
    return true;
  }

  async asyncloadSettings() {
    this.settings = Object.assign({}, Settings.DEFAULT_SETTINGS, await this.loadData());
  }

  async onunload() {
    // console.log("unloading plugin");
  }

  /**
   * No point in doing anything if there is no trigger set which will cause you to move the files
   * @returns boolean
   */
  areMovingTriggersEnabled(): boolean {
    return this.settings.moveOnOpen;
    // || this.settings.moveOnSave
  }

  /**
   * If there are no rules to apply, then there is no point in checking for them
   * @returns boolean
   */
  areThereRulesToApply(): boolean {
    return (
      (this.settings.movingRules.length > 0 &&
        this.settings.movingRules.some((rule) => rule.regex !== "" && rule.folder !== "")) ||
      (this.settings.tagRules.length > 0 &&
        this.settings.tagRules.some((rule) => rule.regex !== "" && rule.folder !== "")) ||
      this.areThereProjectRulesToApply()
    );
  }

  /**
   * If there are no project rules to apply, then there is no point in checking for them
   * @returns boolean
   */
  areThereProjectRulesToApply(): boolean {
    return (
      this.settings.projectRules.length > 0 &&
      this.settings.projectRules.some((projectRule) => projectRule.projectName !== "" && projectRule.folder !== "")
    );
  }

  /**
   * If there are no excluded folders, then we can move thing freely
   * @returns boolean
   */
  areThereExcludedFolders(): boolean {
    return this.settings.exclusionRules.length > 0;
  }

  /**
   * Superficail check if the rules are valid
   * @returns boolean
   */
  areRulesValid(): boolean {
    return (
      this.settings.movingRules.every((rule) => rule.regex !== "" && rule.folder !== "") &&
      this.settings.tagRules.every((rule) => rule.regex !== "" && rule.folder !== "")
    );
  }

  /**
   * Superficail check if the excluded folders are valid
   * @returns boolean
   */
  areExcludedFoldersValid(): boolean {
    return this.settings.exclusionRules.every((rule) => rule.regex !== "");
  }
}
