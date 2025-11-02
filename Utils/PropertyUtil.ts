import { TFile } from "obsidian";

class PropertyUtil {
  private static instance: PropertyUtil;

  private constructor() {}

  static getInstance(): PropertyUtil {
    if (!PropertyUtil.instance) {
      PropertyUtil.instance = new PropertyUtil();
    }
    return PropertyUtil.instance;
  }

  /**
   * TODO: Add property support
   *
   * overview.md
   * Page Properties:
   * Project: [[Project A]]
   * File Type: asset
   *
   * It would take those Project Property and File Type Properties, moving it to Project A/assets.
   *
   *
   *
   * Theoretically, projects should then take precedence over tags and names, as they are more specific.
   *
   *
   * The way i see the implementation is adding a new model that will contain the project destination
   * and then specify in subdirectories where each matching file goes.
   * And it has to check if the file contains the property from the project such as it was mentioned in the overview.md example.
   *
   */

  public getPropertiesFromFile(file: TFile): Record<string, string> {
    console.log("Extracted properties: ", properties);
    return properties;
  }
}

const propertyUtil = PropertyUtil.getInstance();
export default propertyUtil;
