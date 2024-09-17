import { Plugin } from "obsidian";
import movingUtil from "Utils/MovingUtil";

export default class AutoMoverPlugin extends Plugin {
  async onload() {
    console.log('loading plugin')
	movingUtil.init(this.app);
	console.log(movingUtil.isFile("Untitled.md"));
	console.log(movingUtil.isFolder("Untitled.md"));
	console.log("CANCER");
  }
  async onunload() {
    console.log('unloading plugin')
  }
}
