import settingsIO from "IO/SettingsIO";
import * as Settings from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import exclusionMatcherUtil from "Utils/ExclusionMatcherUtil";
import loggerUtil from "Utils/LoggerUtil";
import movingUtil, { type MoveOutcome } from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";
import timerUtil from "Utils/TimerUtil";
import * as obsidian from "obsidian";
import projectMatcherUtil from "Utils/ProjectMatcherUtil";

declare module "obsidian" {
  interface Workspace {
    on(
      name: "AutoMover:automatic-moving-update",
      callback: () => void,
      ctx?: unknown,
    ): EventRef;
  }
}

export default class AutoMoverPlugin extends obsidian.Plugin {
  settings: Settings.AutoMoverSettings;

  /**
   * Obsidian lifecycle hook called when the plugin is enabled.
   * Initializes utilities, loads settings, registers the settings tab,
   * file-open and automatic-moving events, the command, and the ribbon icon.
   *
   * @returns void
   */
  async onload() {
    // console.log("loading plugin");
    movingUtil.init(this.app);
    settingsIO.init(this.app);
    /**
     * Loading settings and creating the settings tab
     */
    this.settings = Object.assign({}, Settings.DEFAULT_SETTINGS, await this.loadData());
    loggerUtil.init(this);
    this.addSettingTab(new SettingsTab(this.app, this));

    this.automaticMoving();

    // negative ifs for easier reading and debugging
    if (!this.areMovingTriggersEnabled()) return;
    if (!this.areThereRulesToApply()) return;

    this.registerEvent(
      this.app.workspace.on("file-open", async (file: obsidian.TFile) => {
        if (!this.settings.moveOnOpen) return;
        if (file == null || file.path == null) return;
        if (this.isFileExcluded(file)) return;
        const result = await this.matchAndMoveFile(file);
        if (result === "moved") loggerUtil.infoNotice("1 file moved.");
        else if (result === "duplicate")
          loggerUtil.infoNotice("1 file not moved - duplicate name.");
        else if (result === "invalid_path" || result === "error")
          loggerUtil.infoNotice("1 file failed to move.");
      }),
    );

    this.registerEvent(
      this.app.workspace.on("AutoMover:automatic-moving-update", () => {
        loggerUtil.debug("Automatic moving update");
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
    this.goThroughAllFiles({ silentIfUnchanged: true });
    timerUtil.startTimer(this.automaticMoving.bind(this), this.settings.timer);
  }

  /**
   * Opens all files in the repository so that the even "file-open" is triggered
   *
   * @returns void
   */
  async goThroughAllFiles(options: { silentIfUnchanged?: boolean } = {}) {
    // console.log("Going through all files");
    const candidates: obsidian.TFile[] = [];
    for (const file of this.app.vault.getFiles()) {
      if (file == null || file.path == null) continue;
      if (this.isFileExcluded(file)) continue;
      candidates.push(file);
    }

    const results = await Promise.all(candidates.map((file) => this.matchAndMoveFile(file)));

    let moved = 0;
    let duplicate = 0;
    let failed = 0;
    for (const result of results) {
      if (result === "moved") moved++;
      else if (result === "duplicate") duplicate++;
      else if (result === "invalid_path" || result === "error") failed++;
    }

    if (options.silentIfUnchanged && moved === 0) return;

    const lines: string[] = [];
    if (moved > 0) lines.push(`${moved} ${moved === 1 ? "file" : "files"} moved.`);
    if (duplicate > 0)
      lines.push(`${duplicate} ${duplicate === 1 ? "file" : "files"} not moved - duplicate name.`);
    if (failed > 0)
      lines.push(`${failed} ${failed === 1 ? "file" : "files"} failed to move.`);

    loggerUtil.infoNotice(lines.length === 0 ? "No files needed to be moved." : lines.join("\n"));
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
   * Matches the file to the first applicable rule (project, then name, then tag)
   * and moves it.
   *
   * @param file - File to be matched and moved
   * @returns the MoveOutcome from the matched rule, or null if no rule matched
   */
  async matchAndMoveFile(file: obsidian.TFile): Promise<MoveOutcome | null> {
    // console.log("Moving file: ", file.path);
    const projectResult = await this.matchAndMoveByProject(file);
    if (projectResult !== null) return projectResult;

    const nameResult = await this.matchAndMoveByName(file);
    if (nameResult !== null) return nameResult;

    return this.matchAndMoveByTag(file);
  }

  /**
   * Matches the file by name and moves it to the destination folder.
   *
   * @param file - File to be matched and moved
   * @returns the MoveOutcome, or null if no rule matched
   */
  async matchAndMoveByName(file: obsidian.TFile): Promise<MoveOutcome | null> {
    const rule = ruleMatcherUtil.getMatchingRuleByName(file, this.settings.movingRules);
    if (rule == null || rule.folder == null) return null;

    if (ruleMatcherUtil.isRegexGrouped(rule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, rule);
      const finalDestinationPath = ruleMatcherUtil.constructFinalDesinationPath(rule, matches!);
      return movingUtil.moveFile(file, finalDestinationPath);
    }
    return movingUtil.moveFile(file, rule.folder);
  }

  /**
   * Matches the file by tags it contains and moves it to the destination folder.
   *
   * @param file - File to be matched and moved
   * @returns the MoveOutcome, or null if no rule matched
   */
  async matchAndMoveByTag(file: obsidian.TFile): Promise<MoveOutcome | null> {
    const cache = this.app.metadataCache.getFileCache(file);
    if (cache == null) return null;
    const tags = obsidian.getAllTags(cache);
    if (tags == null || tags.length === 0) return null;

    const tagRule = ruleMatcherUtil.getMatchingRuleByTag(tags, this.settings.tagRules);

    if (tagRule == null || tagRule.folder == null) return null;

    if (ruleMatcherUtil.isRegexGrouped(tagRule)) {
      const matches = ruleMatcherUtil.getGroupMatchesForTags(tags, tagRule);
      // console.log("File: ", file.path);
      // console.log("Tag rule: ", tagRule);
      // console.log("Tag matches: ", matches);
      const finalDestinationPath = ruleMatcherUtil.constructFinalDesinationPath(tagRule, matches!);
      return movingUtil.moveFile(file, finalDestinationPath);
    }
    return movingUtil.moveFile(file, tagRule.folder);
  }

  /**
   * Matches the file by its `Project` (or `project`) frontmatter value and
   * moves it according to the matched project rule. If the project rule has
   * inner rules, the first matching inner rule's destination is appended;
   * otherwise (or on a "./" destination) the file is moved to the project root.
   *
   * @param file - File to be matched and moved
   * @returns the MoveOutcome, or null if no project rule matched
   */
  async matchAndMoveByProject(file: obsidian.TFile): Promise<MoveOutcome | null> {
    const cache = this.app.metadataCache.getFileCache(file);
    if (cache == null) return null;
    if (cache.frontmatter == null) return null;
    if (cache.frontmatter.Project == null && cache.frontmatter.project == null) return null;

    const projectName: string = cache.frontmatter.Project || cache.frontmatter.project;

    const projectRule = projectMatcherUtil.getMatchingProjectRule(projectName, this.settings.projectRules);
    if (projectRule == null || projectRule.folder == null) return null;

    // If no rules defined, move to project root
    if (projectRule.rules == null || projectRule.rules.length === 0) {
      loggerUtil.debug("No rules defined, moving to project root");
      return movingUtil.moveFile(file, projectRule.folder);
    }

    const rule = ruleMatcherUtil.getMatchingRuleByName(file, projectRule.rules);

    // If no rule matches or folder is "./", move to project root
    if (rule == null || rule.folder === "./") {
      loggerUtil.debug("No matching rule or './' destination, moving to project root");
      return movingUtil.moveFile(file, projectRule.folder);
    }

    // console.log("Project rule's moving rule found: ", rule);

    if (ruleMatcherUtil.isRegexGrouped(rule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, rule);
      const ruleDesinationPath = ruleMatcherUtil.constructFinalDesinationPath(rule, matches!);
      const finalDestinationPath = projectMatcherUtil.constructProjectDestinationPath(projectRule, ruleDesinationPath);
      return movingUtil.moveFile(file, finalDestinationPath);
    }
    const finalDestinationPath = projectMatcherUtil.constructProjectDestinationPath(projectRule, rule.folder);
    return movingUtil.moveFile(file, finalDestinationPath);
  }

  /**
   * Reloads the plugin settings from disk, merged on top of DEFAULT_SETTINGS.
   *
   * @returns void
   */
  async asyncloadSettings() {
    this.settings = Object.assign({}, Settings.DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * Obsidian lifecycle hook called when the plugin is disabled or reloaded.
   *
   * @returns void
   */
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
