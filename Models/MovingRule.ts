
class MovingRule {
  /**
   * This filed is used for defining the regex with its group matchers
   * TODO: Maybe it should be turned into a RegExp object
   */
  private _regex: string;
  /**
   * This field is used for defining the folder to which the files will be moved
   * It can use the previously defined groups to create folders with the same name
   */
  private _folder: string;

  constructor(regex: string, folder: string) {
    this._regex = regex;
    this._folder = folder;
  }
  public get regex(): string {
    return this._regex;
  }

  public set regex(value: string) {
    this._regex = value;
  }

  public get folder(): string {
    return this._folder;
  }

  public set folder(value: string) {
    this._folder = value;
  }
}