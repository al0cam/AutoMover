import { ProjectRule } from "Models/ProjectRule";
import type { TFile } from "obsidian";
import propertyUtil from "./PropertyUtil";

class ProjectMatcherUtil {
  private static instance: ProjectMatcherUtil;

  private constructor() {}

  public static getInstance(): ProjectMatcherUtil {
    if (!ProjectMatcherUtil.instance) {
      ProjectMatcherUtil.instance = new ProjectMatcherUtil();
    }
    return ProjectMatcherUtil.instance;
  }

  /**
   * Returns the first project rule that matches the file
   * If no rule matches, returns null
   * @param file
   * @param projectRules
   * @returns ProjectRule | null
   */
  public getMatchingProjectRule(file: TFile, projectRules: ProjectRule[]): ProjectRule | null {
	propertyUtil.getPropertiesFromFile(file);
    for (const rule of projectRules) {
      if (rule.projectName == null || rule.projectName === "") {
        console.error("Project Rule does not have a project name: ", rule);
        continue;
      }
      if (rule.folder == null || rule.folder === "") {
        console.error("Project Rule does not have a destination folder: ", rule);
        continue;
      }
      // Check if the file path contains the project name as a wiki link or plain text
      const wikiLink = `[[${rule.projectName}]]`;
      if (file.path.includes(wikiLink) || file.path.includes(rule.projectName)) {
        return rule;
      }
    }
    return null;
  }
}
const exclusionMatcherUtil = ProjectMatcherUtil.getInstance();
export default exclusionMatcherUtil;
