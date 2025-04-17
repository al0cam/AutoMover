import * as Settings from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import movingUtil from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";
import * as obsidian from "obsidian";
import exclusionMatcherUtil from "Utils/ExclusionMatcherUtil";
import timerUtil from "Utils/TimerUtil";
import { addIcon } from "obsidian";

export default class AutoMoverPlugin extends obsidian.Plugin {
  settings: Settings.AutoMoverSettings;

  async onload() {
    // console.log("loading plugin");
    movingUtil.init(this.app);
    /**
     * Loading settings and creating the settings tab
     */
    this.settings = Object.assign(
      {},
      Settings.DEFAULT_SETTINGS,
      await this.loadData(),
    );
    this.addSettingTab(new SettingsTab(this.app, this));

    // negative ifs for easier reading and debugging
    if (!this.areMovingTriggersEnabled()) return;
    if (!this.areThereRulesToApply()) return;
    if (!this.areRulesValid()) return;

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

    return exclusionMatcherUtil.isFilePathExcluded(
      file,
      this.settings.exclusionRules,
    );
  }

  /**
   * Matches the file to the rule and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns void
   */
  matchAndMoveFile(file: obsidian.TFile): void {
    // console.log("Moving file: ", file.path);
    const rule = ruleMatcherUtil.getMatchingRule(
      file,
      this.settings.movingRules,
    );
    if (rule == null || rule.folder == null) return;
    if (ruleMatcherUtil.isRegexGrouped(rule)) {
      const matches = ruleMatcherUtil.getGroupMatches(file, rule);
      const finalDestinationPath = ruleMatcherUtil.constructFinalDesinationPath(
        rule,
        matches!,
      );
      movingUtil.moveFile(file, finalDestinationPath);
    } else {
      movingUtil.moveFile(file, rule.folder);
    }
  }

  async asyncloadSettings() {
    this.settings = Object.assign(
      {},
      Settings.DEFAULT_SETTINGS,
      await this.loadData(),
    );
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
      this.settings.movingRules.length > 0 &&
      this.settings.movingRules.every(
        (rule) => rule.regex !== "" && rule.folder !== "",
      )
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
    return this.settings.movingRules.every(
      (rule) => rule.regex !== "" && rule.folder !== "",
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
