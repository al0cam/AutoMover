import { Plugin, TFile } from "obsidian";
import { AutoMoverSettings, DEFAULT_SETTINGS } from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import movingUtil from "Utils/MovingUtil";
import ruleMatcherUtil from "Utils/RuleMatcherUtil";

export default class AutoMoverPlugin extends Plugin {
  settings: AutoMoverSettings;

  async onload() {
    console.log("loading plugin");
    movingUtil.init(this.app);
    /**
     * Loading settings and creating the settings tab
     */
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new SettingsTab(this.app, this));
    console.log(this.settings);

    // Statement: check if there are any settings on when to apply the rules,
    //       because if you arent doing on open, save, close or create, then there is no point in checking for rules
    if (
      this.checkIfMovingTriggersAreEnabled() &&
      this.checkIfThereAreRulesToApply() &&
      this.checkIfRulesAreValid()
    ) {
      if (this.settings.moveOnOpen) {
        this.registerEvent(
          this.app.workspace.on("file-open", (file: TFile) => {
            if (file == null || file.path == null) return;
            console.log("File opened: ", file.path);
            // Question: what if there are multiple rules that apply to the same file?
            //       so far only the first one is applied and the rest are ignored
            //       i can live with that

            // Question: what if the file is already in the correct folder?
            //       do nothing...

            // TODO: what if the folder which the file is supposed to be moved to does not exist?
            //       create the whole path to the folder and the folder itself
            //       having it do nothing would be conflicting with the idea to use regex groups in the first place

            const rule = ruleMatcherUtil.getMatchingRule(
              file,
              this.settings.movingRules,
            );

            if (rule != null) {
              // TODO: Construct the folder path using the regex groups
              const matches = ruleMatcherUtil.getGroupMatches(file, rule);
              console.log("Matches: ", matches);
              console.log("Moving file to: ", rule.folder);
              // movingUtil.moveFile(file, rule.folder);
            }
          }),
        );
      } else {
        // TODO: create event listener which happens on file save
        // scratched feature
        // maybe requires definition of new event and listener
      }
    }
  }

  async asyncloadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async onunload() {
    console.log("unloading plugin");
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
