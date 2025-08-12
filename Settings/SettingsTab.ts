import settingsIO from "IO/SettingsIO";
import timerUtil from "Utils/TimerUtil";
import type AutoMoverPlugin from "main";
import { type App, PluginSettingTab, Setting } from "obsidian";
import { exclusionSection } from "./ExclusionSection";
import movingRuleSection from "./MovingRuleSection";
import { tagSection } from "./TagSection";

export class SettingsTab extends PluginSettingTab {
  plugin: AutoMoverPlugin;

  constructor(app: App, plugin: AutoMoverPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  // how to call rerendering from child section?
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName("Automatic moving").setHeading();
    new Setting(containerEl)
      .setName("Export/Import of settings")
      .setDesc(
        `Import will replace the current settings.
         If you aren't prompted to choose a location, then the file will be exported to/imported from the vault root as AutoMover_settings.json (json files aren't visible in the vault by default).`,
      )
      .addButton((button) => {
        button.setButtonText("Export settings");
        button.onClick(async () => {
          settingsIO.exportSettings(this.plugin.settings);
        });
      })
      .addButton((button) => {
        button.setButtonText("Import settings");
        button.onClick(async () => {
          const importedSettings = await settingsIO.importSettings();
          if (importedSettings) {
            this.plugin.settings = importedSettings;
            await this.plugin.saveData(this.plugin.settings);
            this.plugin.app.workspace.trigger(
              "AutoMover:automatic-moving-update",
              this.plugin.settings,
            );
            this.display();
          }
        });
      });

    new Setting(containerEl)
      .setName("Move on open")
      .setDesc("Should the file be moved when it is opened?")
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.moveOnOpen).onChange(async (value) => {
          this.plugin.settings.moveOnOpen = value;
          await this.plugin.saveData(this.plugin.settings);
        }),
      );

    new Setting(containerEl)
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

    new Setting(automaticMovingContainer)
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
    new Setting(tutorialContainer).setName("Tutorial").setHeading();
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

    movingRuleSection(containerEl, this.plugin);
    exclusionSection(containerEl, this.plugin);
    tagSection(containerEl, this.plugin);
  }
}
