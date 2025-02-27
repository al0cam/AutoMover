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

    containerEl.createEl("h1", { text: "AutoMover settings" });
    containerEl.createSpan({
      text: "This plugin will move files to a specified folder based on a regex match.",
    });

    containerEl.createEl("h2", { text: "Automatic moving" });
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

    /**
     * Rule description and tutorial
     */
    const description = movingRulesContainer.createEl("div");

    description.createEl("br", {});
    description.createEl("span", {
      text: "You can use regex to match the file name and move it to a specified folder.",
    });
    description.createEl("br", {});
    description.createSpan({
      text: "If you have multiple rules referencing the same file, the first rule will be applied.",
    });
    description.createEl("br", {});
    description.createSpan({
      text: "	Usage of regex groups is supported. To use them in the folder name, use $1, $2, etc. to reference the group.",
    });
    description.createEl("br", {});

    description.createEl("span", {
      text: "Examples: ",
    });

    description.createEl("br", {});
    const example1 = description.createDiv({ cls: "rule margig_right" });
    example1.createEl("span", {
      text: " ^(.*)$",
      cls: "rule_title",
    });
    example1.createEl("span", {
      text: " $1",
      cls: "rule_title",
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
