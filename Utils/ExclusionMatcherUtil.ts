import type { ExclusionRule } from "Models/ExclusionRule";
import type { TFile } from "obsidian";

class ExclusionMatcherUtil {
  private static instance: ExclusionMatcherUtil;
  private regexCache: Map<string, RegExp> = new Map();

  private constructor() {}

  public static getInstance(): ExclusionMatcherUtil {
    if (!ExclusionMatcherUtil.instance) {
      ExclusionMatcherUtil.instance = new ExclusionMatcherUtil();
    }
    return ExclusionMatcherUtil.instance;
  }

  /**
   * Gets a compiled regex from cache or creates and caches it
   * @param pattern - The regex pattern string
   * @returns RegExp
   */
  private getCompiledRegex(pattern: string): RegExp {
    if (!this.regexCache.has(pattern)) {
      this.regexCache.set(pattern, new RegExp(pattern));
    }
    return this.regexCache.get(pattern)!;
  }

  /**
   * This method is used to check if the file is excluded by the exclusion rule
   * @param file - The file to be checked
   * @param exclusionRules - The exclusion rule to be used
   * @returns true if the file path is excluded, false otherwise
   */
  isFilePathExcluded(file: TFile, exclusionRules: ExclusionRule[]): boolean {
    for (const rule of exclusionRules) {
      const regex = this.getCompiledRegex(rule.regex);
      if (regex.test(file.path)) {
        return true;
      }
    }
    return false;
  }
}
const exclusionMatcherUtil = ExclusionMatcherUtil.getInstance();
export default exclusionMatcherUtil;
