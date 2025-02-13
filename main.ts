import * as Settings from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import movingUtil from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";
import * as obsidian from "obsidian";

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
    if (
      this.checkIfMovingTriggersAreEnabled() &&
      this.checkIfThereAreRulesToApply() &&
      this.checkIfRulesAreValid()
    ) {
      if (this.settings.moveOnOpen) {
        this.registerEvent(
          this.app.workspace.on("file-open", (file: obsidian.TFile) => {
            this.matchAndMoveFile(file);
          }),
        );
      }
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
   * Matches the file to the rule and moves it to the destination folder
   *
   * @param file - File to be matched and moved
   * @returns void
   */
  matchAndMoveFile(file: obsidian.TFile): void {
    if (file == null || file.path == null) return;
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
  checkIfMovingTriggersAreEnabled(): boolean {
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
  checkIfThereAreRulesToApply(): boolean {
    return this.settings.movingRules.length > 0;
  }

  /**
   * Superficail check if the rules are valid
   * @returns boolean
   */
  checkIfRulesAreValid(): boolean {
    return this.settings.movingRules.every(
      (rule) => rule.regex !== "" && rule.folder !== "",
    );
  }
}
