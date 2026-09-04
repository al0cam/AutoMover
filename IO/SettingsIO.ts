import type { AutoMoverSettings } from "Settings/Settings";
import loggerUtil from "Utils/LoggerUtil";
import { TFile } from "obsidian";
import type { App } from "obsidian";

class SettingsIO {
  private static instance: SettingsIO;
  private app: App;

  private constructor() {}

  /**
   * Returns the singleton instance of SettingsIO, creating it on first access.
   *
   * @returns SettingsIO
   */
  public static getInstance(): SettingsIO {
    if (!SettingsIO.instance) {
      SettingsIO.instance = new SettingsIO();
    }
    return SettingsIO.instance;
  }

  /**
   * Stores the Obsidian app reference used for vault and dialog access.
   *
   * @param app - The Obsidian App instance
   * @returns void
   */
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

      if (!this.canUseBrowserDownload()) {
        // Fall back to saving in vault if the download API is not available
        return this.exportToVault(settingsData);
      }

      const blob = new Blob([settingsData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "AutoMover_settings.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoking straight away can cancel the download in some browsers.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      loggerUtil.infoNotice("Settings exported successfully");
      return true;
    } catch (error) {
      loggerUtil.errorNotice("Failed to export settings", error);
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
      loggerUtil.infoNotice(`Settings exported to vault: ${filename}`);
      return true;
    } catch (error) {
      loggerUtil.errorNotice("Failed to export settings to vault", error);
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

      if (!this.canUseFilePicker()) {
        // Fall back to importing from vault if the file picker is not available
        return this.importFromVault();
      }

      const fileContent = await this.pickJsonFile();

      if (fileContent === null) {
        return null;
      }

      const importedSettings = JSON.parse(fileContent);

      if (!this.validateSettings(importedSettings)) {
        loggerUtil.warnNotice("Invalid settings file format");
        return null;
      }

      loggerUtil.infoNotice("Settings imported successfully");
      return importedSettings;
    } catch (error) {
      loggerUtil.errorNotice("Failed to import settings", error);
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
        loggerUtil.warnNotice(`Could not find ${filename} in vault`);
        return null;
      }

      const fileContent = await this.app.vault.read(file);
      const importedSettings = JSON.parse(fileContent);

      if (!this.validateSettings(importedSettings)) {
        loggerUtil.warnNotice("Invalid settings file format");
        return null;
      }

      loggerUtil.infoNotice("Settings imported from vault successfully");
      return importedSettings;
    } catch (error) {
      loggerUtil.errorNotice("Failed to import settings from vault", error);
      return null;
    }
  }

  /**
   * Checks whether the environment can trigger a file download from the browser.
   *
   * @returns True if a blob download can be started, false otherwise.
   */
  private canUseBrowserDownload(): boolean {
    return typeof URL !== "undefined" && typeof URL.createObjectURL === "function" && typeof document !== "undefined";
  }

  /**
   * Checks whether the environment can open a native file picker.
   *
   * @returns True if a file input can be used, false otherwise.
   */
  private canUseFilePicker(): boolean {
    return typeof document !== "undefined" && typeof Blob !== "undefined" && typeof Blob.prototype.text === "function";
  }

  /**
   * Opens a file picker and reads the chosen JSON file as text.
   *
   * @returns The file contents, or null if the user cancelled.
   */
  private pickJsonFile(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.style.display = "none";

      const cleanup = () => {
        input.remove();
      };

      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) {
          cleanup();
          resolve(null);
          return;
        }

        try {
          resolve(await file.text());
        } catch (error) {
          loggerUtil.errorNotice("Failed to read settings file", error);
          resolve(null);
        } finally {
          cleanup();
        }
      });

      // Fires when the picker is dismissed without a selection.
      input.addEventListener("cancel", () => {
        cleanup();
        resolve(null);
      });

      document.body.appendChild(input);
      input.click();
    });
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
