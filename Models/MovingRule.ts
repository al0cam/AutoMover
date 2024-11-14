
export class MovingRule {
  /**
   * This filed is used for defining the regex with its group matchers
   * TODO: Maybe it should be turned into a RegExp object
   * will try with string for now
   */
  public regex: string;
  /**
   * This field is used for defining the folder to which the files will be moved
   * It can use the previously defined groups to create folders with the same name
   */
  public folder: string;

  constructor(regex?: string, folder?: string) {
    this.regex = regex || '';
    this.folder = folder || '';
  }
}