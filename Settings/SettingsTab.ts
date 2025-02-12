import type AutoMoverPlugin from "main";
import { MovingRule } from "Models/MovingRule";
import * as obsidian from "obsidian";

export class SettingsTab extends obsidian.PluginSettingTab {
  plugin: AutoMoverPlugin;

  constructor(app: obsidian.App, plugin: AutoMoverPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    // maybe not required
    containerEl.empty();

    new obsidian.Setting(containerEl)
      .setName("Move on open")
      .setDesc("Should the file be moved when it is opened?")
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.moveOnOpen).onChange(async (value) => {
          this.plugin.settings.moveOnOpen = value;
          await this.plugin.saveData(this.plugin.settings);
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

    // TODO: add explanation for the user on how to use stuff and what it does
    // TODO: explain that they can use regex groups to move files to different folders where they can use regex groups in the folder names
    // TODO: fix css so that inputs and titles are aligned

    /**
     * Instead of using the default .setting-item class I created a custom class to add other styling,
     * with the inclusion of the relevant styles from the .setting-item class
     */
    const movingRulesContainer = containerEl.createEl("div", {
      cls: "moving_rules_container",
    });
    const header = movingRulesContainer.createEl("div", { cls: "rule_header" });
    header.createEl("h2", { text: "Regex moving rules" });
    const addButton = header.createEl("button", {
      text: "+",
      cls: "rule_button",
    });
    addButton.addEventListener("click", () => {
      this.plugin.settings.movingRules.push(new MovingRule());
      // this is used to rerender the settings tab
      this.display();
    });

    const ruleList = movingRulesContainer.createEl("div");

    /**
     * Header of the rules
     */
    const ruleHeader = ruleList.createEl("div", { cls: "rule margig_right" });
    ruleHeader.createEl("p", { text: "Regex", cls: "rule_title" });
    ruleHeader.createEl("p", { text: "Folder", cls: "rule_title" });

    /**
     * List of rules
     */
    for (const rule of this.plugin.settings.movingRules) {
      const child = ruleList.createEl("div", { cls: "rule" });
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

      const duplicateButton = child.createEl("button", {
        text: "⿻",
        cls: "rule_button rule_button_duplicate",
      });
      duplicateButton.addEventListener("click", () => {
        this.plugin.settings.movingRules.push(
          new MovingRule(rule.regex, rule.folder),
        );
        this.display();
      });

      const deleteButton = child.createEl("button", {
        text: "x",
        cls: "rule_button rule_button_remove",
      });
      deleteButton.addEventListener("click", () => {
        this.plugin.settings.movingRules =
          this.plugin.settings.movingRules.filter((r) => r !== rule);
        this.display();
      });
    }
  }
}
