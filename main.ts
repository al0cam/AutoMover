import { Plugin, TFile } from "obsidian";
import { AutoMoverSettings, DEFAULT_SETTINGS } from "Settings/Settings";
import { SettingsTab } from "Settings/SettingsTab";
import movingUtil from "Utils/MovingUtil";

export default class AutoMoverPlugin extends Plugin {
  settings: AutoMoverSettings;

  async onload() {
    console.log('loading plugin')
    movingUtil.init(this.app);

    // create file
    // let newFile: TFile;
    // if(this.app.vault.getAbstractFileByPath("Something.md") === null) {
    //   newFile = await this.app.vault.create("./Something.md", "This is a test file")
    // } else {
    //   newFile = this.app.vault.getAbstractFileByPath("Something.md") as TFile;
    // }
    // delete file
    // await this.app.vault.delete(this.app.vault.getAbstractFileByPath("amFolder/Something.md") as TFile);
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new SettingsTab(this.app, this));
    console.log(this.settings);
  }

  asyncloadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async onunload() {
    console.log('unloading plugin')
  }
}
