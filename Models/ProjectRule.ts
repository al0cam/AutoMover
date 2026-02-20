import { MovingRule } from "./MovingRule";

/**
 * Project rules for defining how files should be moved inside project folders
 */
export class ProjectRule {
  /**
   * The name of the project this rule belongs to
   * e.g. "Project A"
   * e.g. "Book collection"
   * e.g. "Music albums 2025"
   */
  public projectName: string;
  /**
   * Project destination folder
   * e.g. "Projects/Project A"
   * e.g. "Projects/Project B/
   */
  public folder: string;
  /**
   * Rules for moving files inside the project folder
   */
  public rules: Array<MovingRule>;
  public collapsed: boolean;
  constructor(projectName?: string, folder?: string, rules?: Array<MovingRule>, collapsed?: boolean) {
    this.projectName = projectName || "";
    this.folder = folder || "";
    this.rules = rules || [];
    this.collapsed = collapsed || false;
  }
}
