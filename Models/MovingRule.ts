/**
 * Regex based rule for moving files
 */
export class MovingRule {
  /**
   * This field is used for defining the regex with its group matchers
   *
   * This can contain the follwoing:
   *	- Names of files w/w/o extensions
   *	- Names of folders
   *	- Extensions of files
   *	- Regex strings w/w/o groups
   *	- Any combination of the above
   *
   * Tag update:
   *    - The regex can now hold tags as well, which can be used to match files based on their tags.
   *
   */
  public regex: string;
  /**
   * This field is used for defining the folder to which the files will be moved
   * It can use the previously defined groups to create folders with the same name
   */
  public folder: string;

  constructor(regex?: string, folder?: string) {
    this.regex = regex || "";
    this.folder = folder || "";
  }
}
