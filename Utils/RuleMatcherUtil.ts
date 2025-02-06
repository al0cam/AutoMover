import type { MovingRule } from "Models/MovingRule";
import type { TFile } from "obsidian";

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
  public getMatchingRule(file: TFile, rules: MovingRule[]): MovingRule | null {
    for(const rule of rules) {
      if(rule.regex == null || rule.regex === "") {
        console.error("Rule does not have a regex: ", rule);
        continue;
      } else if(!this.isValidRegex(rule.regex)) {
        console.error("Rule has an invalid regex: ", rule);
        continue;
      }
      console.log("Checking if matches: ", file.name.match(rule.regex));
      console.log("Rule: ", rule);
      if(file.name.match(rule.regex)) {
        return rule;
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

  // TODO: implement the distinction between named and unnamed groups
  public constructFinalDesinationPath(rule: MovingRule, matches: RegExpMatchArray): string {
    const folderPath = rule.folder;
    return folderPath;
  }

  private hasUnnamedGroups(pattern: string): boolean {
    return /\(/.test(pattern);
  }

  private getNamedGroups(pattern: string): RegExpMatchArray | null {
    return pattern.match(/\(\?<\w+>/g);
  }

  private getUnnamedGroups(pattern: string): RegExpMatchArray | null {
    return pattern.match(/\(/g);
  }
}

const ruleMatcherUtil = RuleMatcherUtil.getInstance();
export default ruleMatcherUtil;
