import { ProjectRule } from "Models/ProjectRule";

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
   * @param projectName
   * @param projectRules
   * @returns ProjectRule | null
   */
  public getMatchingProjectRule(projectName: string, projectRules: ProjectRule[]): ProjectRule | null {
    for (const projectRule of projectRules) {
      if (projectRule.projectName === projectName) {
        return projectRule;
      }
    }
    return null;
  }

  /**
   * Prepends the project folder to the destination path
   * and checks whether the project folder ends with a slash
   *
   * @param projectRule
   * @param subPath
   * @returns string
   */
  public constructProjectDestinationPath(projectRule: ProjectRule, subPath: string): string {
    let projectFolder = projectRule.folder;
    if (!projectFolder.endsWith("/")) {
      projectFolder += "/";
    }
    return projectFolder + subPath;
  }
}
const projectMatcherUtil = ProjectMatcherUtil.getInstance();
export default projectMatcherUtil;
