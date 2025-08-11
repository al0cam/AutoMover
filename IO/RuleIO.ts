class SettingsIO {
  private static instance: SettingsIO;

  private constructor() {}

  public static getInstance(): SettingsIO {
    if (!SettingsIO.instance) {
      SettingsIO.instance = new SettingsIO();
    }
    return SettingsIO.instance;
  }

  // reading from yaml
  // reading from json
  // reading from regular txt file

}

const settingsIO = SettingsIO.getInstance();
export default settingsIO;
