import type AutoMoverPlugin from "main";
import { ExclusionRule } from "Models/ExclusionRule";
import { MovingRule } from "Models/MovingRule";
import * as obsidian from "obsidian";
import timerUtil from "Utils/TimerUtil";

export class SettingsTab extends obsidian.PluginSettingTab {
  plugin: AutoMoverPlugin;

  constructor(app: obsidian.App, plugin: AutoMoverPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new obsidian.Setting(containerEl).setName("Automatic moving").setHeading();
    new obsidian.Setting(containerEl)
      .setName("Move on open")
      .setDesc("Should the file be moved when it is opened?")
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.moveOnOpen).onChange(async (value) => {
          this.plugin.settings.moveOnOpen = value;
          await this.plugin.saveData(this.plugin.settings);
        }),
      );

    new obsidian.Setting(containerEl)
      .setName("Manually move")
      .setDesc(
        "Execute the command to go through your notes and move them according to the rules specified below.",
      )
      .addButton((button) => {
        button.setButtonText("Move files");
        button.onClick(async () => {
          this.plugin.goThroughAllFiles();
        });
      });

    const automaticMovingContainer = containerEl.createDiv({});

    new obsidian.Setting(automaticMovingContainer)
      .setName("Automatic moving")
      .setDesc(
        `Execute a timed event that goes through all the files and moves them according to the rules specified below.
		 The formatting is hh:mm:ss (if set 00:05:00 it will execute every 5 minutes).
	     If the timer is set to 0, the automatic moving will do nothing.`,
      )
      .setClass("timer-setting")
      .addToggle((cb) =>
        cb
          .setValue(this.plugin.settings.automaticMoving)
          .onChange(async (value) => {
            this.plugin.settings.automaticMoving = value;
            await this.plugin.saveData(this.plugin.settings);
            this.app.workspace.trigger(
              "AutoMover:automatic-moving-update",
              this.plugin.settings,
            );
            this.display();
          }),
      )
      .addText((cb) =>
        cb
          .setDisabled(!this.plugin.settings.automaticMoving)
          .setValue(timerUtil.formatTime(this.plugin.settings.timer))
          .setPlaceholder("hh:mm:ss")
          .onChange(async (value) => {
            this.plugin.settings.timer = timerUtil.parseTimeToMs(value);
            await this.plugin.saveData(this.plugin.settings);
            this.app.workspace.trigger(
              "AutoMover:automatic-moving-update",
              this.plugin.settings,
            );
          }),
      );

    // there is no default event to move on save, therefore, i'd need to define a new one
    // running move on change could be an option, but it would produce an overhead in performance because of constant checking for changes
    //
    // new obsidian.Setting(containerEl)
    //   .setName("Move on save")
    //   .setDesc("Should the file be moved when it is saved?")
    //   .addToggle((cb) =>
    //     cb.setValue(this.plugin.settings.moveOnSave).onChange(async (value) => {
    //       this.plugin.settings.moveOnSave = value;
    //       await this.plugin.saveData(this.plugin.settings);
    //     }),
    //   );

    // TUTORIAL START
    /**
     * Instead of using the default .setting-item class I created a custom class to add other styling,
     * with the inclusion of the relevant styles from the .setting-item class
     */
    const tutorialContainer = containerEl.createDiv({
      cls: "moving_rules_container",
    });
    new obsidian.Setting(tutorialContainer).setName("Tutorial").setHeading();
    /**
     * Rule description and tutorial
     */
    const description = tutorialContainer.createDiv();

    description.createSpan({
      text: "This plugin allows you to move files to a specified folder based on the file name.",
    });
    description.createEl("br", {});
    description.createSpan({
      text: "If you have multiple rules referencing the same file, the first rule will be applied.",
    });
    description.createEl("br", {});
    description.createSpan({
      text: "Usage of regex groups is supported. To use them in the folder name, use $1, $2, etc. to reference the group.",
    });

    /**
     * Examples
     */
    description.createEl("br", {});
    description.createEl("br", {});
    description.createSpan({ text: "Examples: ", cls: "rule_title" });

    description.createEl("br", {});
    description.createSpan({
      text: "To move files containing 'Scroll' to a folder named 'Scrolls': ",
    });
    const example1 = description.createDiv({ cls: "rule margig_right" });
    example1.createSpan({ text: "Scroll", cls: "rule_title" });
    example1.createSpan({ text: "Scrolls", cls: "rule_title" });

    description.createSpan({
      text: "To move files containing the word 'Scroll' and a number to space -> to a folder named 'Scrolls' under the subfolder of the scroll number: ",
    });
    const example2 = description.createDiv({ cls: "rule margig_right" });
    example2.createSpan({ text: "Scroll (\\d+)", cls: "rule_title" });
    example2.createSpan({ text: "Scrolls/$1", cls: "rule_title" });
    // TUTORIAL END

    // MOVING RULES START
    /**
     * Header of the rules
     */
    const movingRulesContainer = containerEl.createDiv({
      cls: "moving_rules_container",
    });

    new obsidian.Setting(movingRulesContainer)
      .setName("Moving rules")
      .setHeading();

    const ruleList = movingRulesContainer.createDiv({ cls: "rule_list" });
    const ruleHeader = ruleList.createDiv({ cls: "rule margig_right" });
    ruleHeader.createEl("p", {
      text: "Search criteria (string or regex)",
      cls: "rule_title",
    });
    ruleHeader.createEl("p", {
      text: "Folder (string that can contain regex groups)",
      cls: "rule_title",
    });

    const addRuleButton = ruleHeader.createEl("button", {
      text: "+",
      cls: "rule_button",
    });
    addRuleButton.addEventListener("click", () => {
      this.plugin.settings.movingRules.push(new MovingRule());
      // this is used to rerender the settings tab
      this.display();
    });

    /**
     * List of rules
     */
    for (const rule of this.plugin.settings.movingRules) {
      const child = ruleList.createDiv({ cls: "rule" });
      child.createEl("input", {
        value: rule.regex,
        cls: "rule_input",
      }).onchange = (e) => {
        rule.regex = (e.target as HTMLInputElement).value;
        this.plugin.settings.movingRules.map((r) => (r === rule ? rule : r));
        this.plugin.saveData(this.plugin.settings);
      };
      child.createEl("input", {
        value: rule.folder,
        cls: "rule_input",
      }).onchange = (e) => {
        rule.folder = (e.target as HTMLInputElement).value;
        this.plugin.settings.movingRules.map((r) => (r === rule ? rule : r));
        this.plugin.saveData(this.plugin.settings);
      };

      const duplicateRuleButton = child.createEl("button", {
        text: "⿻",
        cls: "rule_button rule_button_duplicate",
      });
      duplicateRuleButton.addEventListener("click", () => {
        this.plugin.settings.movingRules.push(
          new MovingRule(rule.regex, rule.folder),
        );
        this.display();
      });

      const deleteRuleButton = child.createEl("button", {
        text: "x",
        cls: "rule_button rule_button_remove",
      });
      deleteRuleButton.addEventListener("click", () => {
        this.plugin.settings.movingRules =
          this.plugin.settings.movingRules.filter((r) => r !== rule);
        this.display();
      });
    }
    // MOVING RULES END

    // EXCLUSION FOLDERS START
    /**
     * Header for excluded folders
     */
    const exclusionRuleContainer = containerEl.createDiv({
      cls: "moving_rules_container",
    });
    new obsidian.Setting(exclusionRuleContainer)
      .setName("Exclusion rules")
      .setHeading();

    const exclusionList = exclusionRuleContainer.createDiv({
      cls: "rule_list",
    });
    const exclusionHeader = exclusionList.createDiv({
      cls: "rule margig_right",
    });
    exclusionHeader.createEl("p", {
      text: "Excluded folders or files (string or regex)",
      cls: "rule_title",
    });

    const addExclusionButton = exclusionHeader.createEl("button", {
      text: "+",
      cls: "rule_button",
    });
    addExclusionButton.addEventListener("click", () => {
      this.plugin.settings.exclusionRules.push(new ExclusionRule());
      this.display();
    });

    /**
     * List of excluded folders
     */
    for (const exclusion of this.plugin.settings.exclusionRules) {
      const child = exclusionList.createDiv({ cls: "rule" });
      child.createEl("input", {
        value: exclusion.regex,
        cls: "rule_input",
      }).onchange = (e) => {
        exclusion.regex = (e.target as HTMLInputElement).value;
        this.plugin.settings.exclusionRules.map((ef) =>
          ef === exclusion ? exclusion : ef,
        );
        this.plugin.saveData(this.plugin.settings);
      };

      const duplicateExclusionButton = child.createEl("button", {
        text: "⿻",
        cls: "rule_button rule_button_duplicate",
      });
      duplicateExclusionButton.addEventListener("click", () => {
        this.plugin.settings.exclusionRules.push(
          new ExclusionRule(exclusion.regex),
        );
        this.display();
      });

      const deleteExclusionButton = child.createEl("button", {
        text: "x",
        cls: "rule_button rule_button_remove",
      });
      deleteExclusionButton.addEventListener("click", () => {
        this.plugin.settings.exclusionRules =
          this.plugin.settings.exclusionRules.filter((r) => r !== exclusion);
        this.display();
      });
    }
    // EXCLUSION FOLDERS END
  }
}
