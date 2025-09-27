import type { MovingRule } from "Models/MovingRule";
import type { TagCache, TFile } from "obsidian";

class RuleMatcherUtil {
  private static instance: RuleMatcherUtil;

  private constructor() {}

  public static getInstance(): RuleMatcherUtil {
    if (!RuleMatcherUtil.instance) {
      RuleMatcherUtil.instance = new RuleMatcherUtil();
    }
    return RuleMatcherUtil.instance;
  }

  /**
   * Returns the first rule that matches the file
   * If no rule matches, returns null
   *
   * @param file
   * @param rules
   * @returns MovingRule | null
   */
  public getMatchingRuleByName(file: TFile, rules: MovingRule[]): MovingRule | null {
    for (const rule of rules) {
      if (rule.regex == null || rule.regex === "") {
        console.error("Rule does not have a regex: ", rule);
        continue;
      }
      if (rule.folder == null || rule.folder === "") {
        console.error("Rule does not have a destination folder: ", rule);
        continue;
      }
      if (!this.isValidRegex(rule.regex)) {
        console.error("Rule has an invalid regex: ", rule);
        continue;
      }
      if (file.name.match(rule.regex)) {
        return rule;
      }
    }
    return null;
  }

  /**
   * Returns the first rule that matches any of the tags
   * If no rule matches, returns null
   * @param tags
   * @param rules
   * @returns MovingRule | null
   */
  public getMatchingRuleByTag(tags: TagCache[], rules: MovingRule[]): MovingRule | null {
    for (const rule of rules) {
      if (rule.regex == null || rule.regex === "") {
        console.error("Tag Rule does not have a regex: ", rule);
        continue;
      }
      if (rule.folder == null || rule.folder === "") {
        console.error("Tag Rule does not have a destination folder: ", rule);
        continue;
      }
      if (!this.isValidRegex(rule.regex)) {
        console.error("Tag Rule has an invalid regex: ", rule);
        continue;
      }

      for (const tag of tags) {
        if (tag.tag.match(rule.regex)) {
          return rule;
        }
      }
    }
    return null;
  }

  /**
   * Returns the regex groups of the file that match the rule
   * If no groups match, returns an empty array
   *
   * @param file
   * @param rule
   * @returns string[]
   */
  public getGroupMatches(file: TFile, rule: MovingRule): RegExpMatchArray | null {
    const matches = file.name.match(rule.regex);
    return matches;
  }

  /**
   * Checks if the regex pattern is valid
   * Meaning, syntax errors are caught, but not logical errors
   *
   * @param pattern
   * @returns boolean
   */
  private isValidRegex(pattern: string): boolean {
    try {
      new RegExp(pattern);
      return true;
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error(`Invalid regex pattern: ${e.message}`);
      }
      return false;
    }
  }

  /**
   * Constructs the final destination path from the matched groups
   * The path is constructed by replacing the $1, $2, $3, etc. with the matched groups
   *
   * @param rule
   * @param matches
   */
  public constructFinalDesinationPath(rule: MovingRule, matches: RegExpMatchArray): string {
    let folderPath = rule.folder;
    const unnamedGroups = this.getUnnamedGroups(rule.regex);
    // it has been asserted before that there is no way this can be null before the call, the rule and file are checked to be valid
    for (let i = 0; i < unnamedGroups!.length; i++) {
      folderPath = folderPath.replace(`$${i + 1}`, matches[i + 1] ?? "");
    }
    return folderPath;
  }

  /**
   * Is regex grouped
   * Groups are defined by (...) and used with $1, $2, $3, etc.
   *
   * @param rule
   * @returns boolean
   */
  public isRegexGrouped(rule: MovingRule): boolean {
    return this.doesDestinationUseGroups(rule) && this.getUnnamedGroups(rule.regex) != null;
  }

  /**
   * Returns the unnamed groups in the regex pattern
   *
   * @param pattern
   * @returns RegExpMatchArray | null
   */
  private getUnnamedGroups(pattern: string): RegExpMatchArray | null {
    return pattern.match(/\(/g);
  }

  /**
   * Does destination use groups
   * Groups are defined by $1, $2, $3, etc.
   *
   * @param rule
   * @returns boolean
   */
  private doesDestinationUseGroups(rule: MovingRule): boolean {
    return /\$\d/.test(rule.folder);
  }
}

const ruleMatcherUtil = RuleMatcherUtil.getInstance();
export default ruleMatcherUtil;
