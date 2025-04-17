import type { ExclusionRule } from "Models/ExclusionRule";
import type { TFile } from "obsidian";

class ExclusionMatcherUtil {
  private static instance: ExclusionMatcherUtil;

  private constructor() {}

  public static getInstance(): ExclusionMatcherUtil {
    if (!ExclusionMatcherUtil.instance) {
      ExclusionMatcherUtil.instance = new ExclusionMatcherUtil();
    }
    return ExclusionMatcherUtil.instance;
  }

  /**
   * This method is used to check if the file is excluded by the exclusion rule
   * @param file - The file to be checked
   * @param exclusionRules - The exclusion rule to be used
   * @returns true if the file path is excluded, false otherwise
   */
  isFilePathExcluded(file: TFile, exclusionRules: ExclusionRule[]): boolean {
    for (const rule of exclusionRules) {
      const regex = new RegExp(rule.regex);
      if (regex.test(file.path)) {
        return true;
      }
    }
    return false;
  }
}
const exclusionMatcherUtil = ExclusionMatcherUtil.getInstance();
export default exclusionMatcherUtil;
