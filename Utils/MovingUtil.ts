import * as obsidian from "obsidian";

class MovingUtil {
  private static instance: MovingUtil;
  private app: obsidian.App;

  private constructor() {}

  public static getInstance(): MovingUtil {
    if (!MovingUtil.instance) {
      MovingUtil.instance = new MovingUtil();
    }
    return MovingUtil.instance;
  }

  public init(app: obsidian.App): void {
    this.app = app;
  }

  /**
   * Checks if the path is a file
   *
   * @param path - Path to be checked
   * @returns boolean
   */
  public isFile(path: string): boolean {
    const file = this.app.vault.getAbstractFileByPath(path);
    return file instanceof obsidian.TFile;
  }

  /**
   * Checks if the path is a folder
   *
   * @param path - Path to be checked
   * @returns boolean
   */
  public isFolder(path: string): boolean {
    return (
      this.app.vault.getAbstractFileByPath(path) instanceof obsidian.TFolder
    );
  }

  /**
   * Moves the file to the destination path
   *
   * @param file - File to be moved
   * @param newPath - Destination path
   * @returns void
   */
  public moveFile(file: obsidian.TFile, newPath: string): void {
    console.log(`Moving file ${file.name} to ${newPath}`);
    // is folder is saying false for something that is clearly a folder
    console.log(`Is folder: ${this.isFolder(newPath)}`);
    if (this.isFolder(newPath)) {
      this.app.vault.rename(file, `${newPath}/${file.name}`);
    } else {
      new obsidian.Notice(
        `Invalid destination path\n${newPath} is not a folder!\nCreating requested folder.`,
        5000,
      );
      console.error(
        `Invalid destination path\n${newPath} is not a folder!\nCreating requested folder.`,
      );
      this.createMissingFolders(newPath).then(() => {
        this.app.vault.rename(file, `${newPath}/${file.name}`);
      });
    }
  }

  /**
   * Moves the folder to the destination path
   *
   * @param folder - Folder to be moved
   * @param newPath - Destination path
   * @returns void
   */
  public moveFolder(folder: obsidian.TFolder, newPath: string): void {
    if (this.isFolder(newPath)) {
      this.app.vault.rename(folder, `${newPath}/${folder.name}`);
    } else {
      new obsidian.Notice(
        `Invalid destination path\n${newPath} is not a folder!`,
        5000,
      );
      console.error(`Invalid destination path\n${newPath} is not a folder!`);
    }
  }

  /**
   * Creates folder in destination path if it does not exist already
   *
   * @param path - Path of the folder to be created
   * @returns Created folder or null if folder already exists
   */
  public createFolder(path: string): obsidian.TFolder | null {
    if (!this.isFolder(path)) {
      this.app.vault.createFolder(path).then((folder) => {
        return folder;
      });
    } else {
      new obsidian.Notice("Folder already exists", 5000);
      console.error("Folder already exists");
    }
    return null;
  }

  /**
   * Splits the path into an array of strings
   *
   * @param path - Path to be split
   * @returns string[]
   */
  private splitPath(path: string): string[] {
    return path.split("/");
  }

  /**
   * Create missing folders in the path
   *
   * @param path - Path to be checked
   * @returns void
   */
  private async createMissingFolders(path: string): Promise<boolean> {
    const splitPath = this.splitPath(path);
    let currentPath = "";
    for (const folder of splitPath) {
      currentPath += folder;
      if (!this.isFolder(currentPath)) {
        await this.app.vault.createFolder(path);
      }
      currentPath += "/";
    }
    if (this.isFolder(path)) {
      return true;
    }

    return false;
  }
}

const movingUtil = MovingUtil.getInstance();
export default movingUtil;
