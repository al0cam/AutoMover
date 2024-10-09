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

    // custom definition of settings list
    // list of items which should be dynamic
    let movingRules = containerEl.createEl('div', {cls: 'setting-item'});
    movingRules.createEl('h2', {text: 'Regex moving rules',});
    movingRules.createEl('div');

  }

}