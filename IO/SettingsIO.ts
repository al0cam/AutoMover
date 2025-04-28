import type { AutoMoverSettings } from "Settings/Settings";
import { Notice, TFile } from "obsidian";
import type { App } from "obsidian";

class SettingsIO {
  private static instance: SettingsIO;
  private app: App;

  private constructor() {}

  public static getInstance(): SettingsIO {
    if (!SettingsIO.instance) {
      SettingsIO.instance = new SettingsIO();
    }
    return SettingsIO.instance;
  }

  public init(app: App): void {
    this.app = app;
  }

  /**
   * Exports the plugin settings to a JSON file.
   *
   * @param settings - The settings object to export.
   * @returns A promise that resolves to true if the export was successful, false otherwise.
   */
  public async exportSettings(settings: AutoMoverSettings) {
    try {
      if (!this.app) {
        throw new Error("App reference not set");
      }

      const settingsData = JSON.stringify(settings, null, 2);

      const electron = (window as any).require
        ? (window as any).require("electron")
        : null;
      const remote = electron ? electron.remote : null;

      if (!remote || !remote.dialog) {
        // Fall back to saving in vault if Electron APIs are not available
        return this.exportToVault(settingsData);
      }

      const { canceled, filePath } = await remote.dialog.showSaveDialog({
        title: "Export AutoMover Settings",
        defaultPath: "AutoMover_settings.json",
        filters: [{ name: "JSON Files", extensions: ["json"] }],
        properties: ["createDirectory"],
      });

      if (canceled || !filePath) {
        return false;
      }

      const fs = require("node:fs");
      fs.writeFileSync(filePath, settingsData);

      new Notice("Settings exported successfully");
      return true;
    } catch (error) {
      console.error("Failed to export settings:", error);
      new Notice("Failed to export settings");
      return false;
    }
  }

  /**
   * Exports the settings to the vault.
   * Exports the settings to a file named AutoMover_settings.json
   *
   * @param settingsData - The settings data to export.
   * @returns A promise that resolves to true if the export was successful, false otherwise.
   */
  private async exportToVault(settingsData: string): Promise<boolean> {
    try {
      const filename = "AutoMover_settings.json";
      await this.app.vault.create(filename, settingsData);
      new Notice(`Settings exported to vault: ${filename}`);
      return true;
    } catch (error) {
      console.error("Failed to export to vault:", error);
      new Notice("Failed to export settings to vault");
      return false;
    }
  }

  /**
   * Imports settings from a JSON file.
   *
   * @returns The imported settings or null if the import failed.
   */
  public async importSettings(): Promise<AutoMoverSettings | null> {
    try {
      if (!this.app) {
        throw new Error("App reference not set");
      }

      const electron = (window as any).require
        ? (window as any).require("electron")
        : null;
      const remote = electron ? electron.remote : null;

      if (!remote || !remote.dialog) {
        // Fall back to importing from vault if Electron APIs are not available
        return this.importFromVault();
      }

      const { canceled, filePaths } = await remote.dialog.showOpenDialog({
        title: "Import AutoMover Settings",
        filters: [{ name: "JSON Files", extensions: ["json"] }],
        properties: ["openFile"],
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return null;
      }

      const fs = require("node:fs");
      const fileContent = fs.readFileSync(filePaths[0], "utf8");

      const importedSettings = JSON.parse(fileContent);

      if (!this.validateSettings(importedSettings)) {
        new Notice("Invalid settings file format");
        return null;
      }

      new Notice("Settings imported successfully");
      return importedSettings;
    } catch (error) {
      console.error("Failed to import settings:", error);
      new Notice("Failed to import settings");
      return null;
    }
  }

  /**
   * Fallback method to import settings from the vault.
   * from the file AutoMover_settings.json
   *
   * @returns The imported settings or null if the import failed.
   */
  private async importFromVault(): Promise<AutoMoverSettings | null> {
    try {
      const filename = "AutoMover_settings.json";
      const file = this.app.vault.getAbstractFileByPath(filename);

      if (!file || !(file instanceof TFile)) {
        new Notice(`Could not find ${filename} in vault`);
        return null;
      }

      const fileContent = await this.app.vault.read(file);
      const importedSettings = JSON.parse(fileContent);

      if (!this.validateSettings(importedSettings)) {
        new Notice("Invalid settings file format");
        return null;
      }

      new Notice("Settings imported from vault successfully");
      return importedSettings;
    } catch (error) {
      console.error("Failed to import from vault:", error);
      new Notice("Failed to import settings from vault");
      return null;
    }
  }

  /**
   * Validates the settings object to ensure it has the correct structure.
   *
   * @param settings - The settings object to validate.
   * @return True if the settings object is valid, false otherwise.
   */
  private validateSettings(settings: any): settings is AutoMoverSettings {
    if (!settings) return false;

    if (typeof settings.moveOnOpen !== "boolean") return false;
    if (!Array.isArray(settings.movingRules)) return false;
    if (!Array.isArray(settings.exclusionRules)) return false;
    if (typeof settings.automaticMoving !== "boolean") return false;

    if (settings.timer !== null && typeof settings.timer !== "number")
      return false;

    return true;
  }
}

const settingsIO = SettingsIO.getInstance();
export default settingsIO;
