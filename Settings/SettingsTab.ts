import AutoMoverPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab{
  plugin: AutoMoverPlugin;

  constructor(app: App, plugin: AutoMoverPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    // maybe not required
    containerEl.empty();

    new Setting(containerEl)
      .setName("Move on open")
      .setDesc("Should the file be moved when it is opened?")
      .addToggle(cb => cb
        .setValue(this.plugin.settings.moveOnOpen)
        .onChange(async (value) => {
          this.plugin.settings.moveOnOpen = value;
          await this.plugin.saveData(this.plugin.settings);
        }));

    new Setting(containerEl)
      .setName("Move on save")
      .setDesc("Should the file be moved when it is saved?")
      .addToggle(cb => cb
        .setValue(this.plugin.settings.moveOnSave)
        .onChange(async (value) => {
          this.plugin.settings.moveOnSave = value;
          await this.plugin.saveData(this.plugin.settings);
        }));

    new Setting(containerEl)
      .setName("Move on close")
      .setDesc("Should the file be moved when it is closed?")
      .addToggle(cb => cb
        .setValue(this.plugin.settings.moveOnClose)
        .onChange(async (value) => {
          this.plugin.settings.moveOnClose = value;
          await this.plugin.saveData(this.plugin.settings);
        }));

    new Setting(containerEl)
      .setName("Move on create")
      .setDesc("Should the file be moved when it is created?")
      .addToggle(cb => cb
        .setValue(this.plugin.settings.moveOnCreate)
        .onChange(async (value) => {
          this.plugin.settings.moveOnCreate = value;
          await this.plugin.saveData(this.plugin.settings);
        }));


// TODO: ipmplement button to add new rules with empty fields
// TODO: add button to remove rules

    // custom definition of settings list
    // list of items which should be dynamic

    /**
     * instead of using the default .setting-item class I created a custom class to add other styling,
     * with the inclusion of the relevant styles from the .setting-item class
     */
    let movingRulesContainer = containerEl.createEl('div', {cls: 'moving_rules_container'});
      let header = movingRulesContainer.createEl('div', {cls: 'rule_header'});
        header.createEl('h2', {text: 'Regex moving rules',});
        header.createEl('button', {text: '+',});

      let ruleList = movingRulesContainer.createEl('div');

        // Inputs for the moving rules
        let ruleHeader = ruleList.createEl('div', {cls: 'rule'});
          ruleHeader.createEl('p', {text: "Regex", cls: 'rule_title'});
          ruleHeader.createEl('p', {text: "Folder", cls: 'rule_title'});

        let child = ruleList.createEl('div', {cls: 'rule'});
          child.createEl('input', {value: 'something', cls:'rule_input'});
          child.createEl('input', {value: 'something', cls:'rule_input'});

        /**
         * List of rules
         */
        for (let rule of this.plugin.settings.movingRules) {
          let child = ruleList.createEl('div', {cls: 'rule'});
            child.createEl('input', {value: rule.regex, cls: 'rule_input'});
            child.createEl('input', {value: rule.folder, cls: 'rule_input' });
        }
  }

}