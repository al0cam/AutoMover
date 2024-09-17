import { App, Notice, TFile, TFolder } from "obsidian";


class MovingUtil {
  private static instance: MovingUtil;
  private app: App;

  private constructor() {}

  public static getInstance(): MovingUtil {
    if (!MovingUtil.instance) {
      MovingUtil.instance = new MovingUtil();
    }
    return MovingUtil.instance;
  }

  public init(app: App): void {
    this.app = app;
  }

  public isFile(path: string): boolean {
    return this.app.vault.getAbstractFileByPath(path) instanceof TFile;
  }

  public isFolder(path: string): boolean {
    return this.app.vault.getAbstractFileByPath(path) instanceof TFolder;
  }

  public moveFile(file: TFile, newPath: string): void {
    if(this.isFolder(newPath)) {
      this.app.vault.rename(file, newPath + "/" + file.name);
    } else {
      new Notice("Invalid destination path\n" + newPath + "is not a folder!", 5000);
      console.error("Invalid destination path\n" + newPath + "is not a folder!");
    }
  }

  public moveFolder(folder: TFolder, newPath: string): void {
    if(this.isFolder(newPath)) {
      this.app.vault.rename(folder, newPath + "/" + folder.name);
    } else {
      new Notice("Invalid destination path\n" + newPath + "is not a folder!", 5000);
      console.error("Invalid destination path\n" + newPath + "is not a folder!");
    }
  }

}

const movingUtil = MovingUtil.getInstance();
export default movingUtil;
