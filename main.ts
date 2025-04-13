import * as Settings from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import movingUtil from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";
import * as obsidian from "obsidian";
import exclusionMatcherUtil from "Utils/ExclusionMatcherUtil";

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

    if (this.settings.moveOnOpen) {
      this.registerEvent(
        this.app.workspace.on("file-open", (file: obsidian.TFile) => {
          if (file == null || file.path == null) return;
          if (this.isFileExcluded(file)) return;
          this.matchAndMoveFile(file);
        }),
      );
    }
  }

  /**
   * Opens all files in the repository so that the even "file-open" is triggered
   *
   * @returns void
   */
  goThroughAllFiles() {
    const files = this.app.vault.getFiles();
    for (const file of files) {
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
      this.settings.excludedFolders,
    );
  }

  /**
   * Matches the file to the rule and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns void
   */
  matchAndMoveFile(file: obsidian.TFile): void {
    console.log("Moving file: ", file.path);
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
    return (
      this.settings.moveOnClose ||
      this.settings.moveOnCreate ||
      this.settings.moveOnOpen ||
      this.settings.moveOnSave
    );
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
    return this.settings.excludedFolders.length > 0;
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
    return this.settings.excludedFolders.every((rule) => rule.regex !== "");
  }
}
