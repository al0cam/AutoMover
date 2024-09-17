import { Plugin } from "obsidian";
import { AutoMoverSettings, DEFAULT_SETTINGS } from "Settings/Settings";
import movingUtil from "Utils/MovingUtil";

export default class AutoMoverPlugin extends Plugin {
  settings: AutoMoverSettings;

  async onload() {
    console.log('loading plugin')
    movingUtil.init(this.app);
    console.log(movingUtil.isFile("Untitled.md"));
    console.log(movingUtil.isFolder("Untitled.md"));
    console.log("CANCER");
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    console.log(this.settings);
  }
  async onunload() {
    console.log('unloading plugin')
  }
}
