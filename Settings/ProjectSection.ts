import { MovingRule } from "Models/MovingRule";
import * as obsidian from "obsidian";
import type AutoMoverPlugin from "main";
import { ProjectRule } from "Models/ProjectRule";

export function projectSection(containerEl: HTMLElement, plugin: AutoMoverPlugin, display: () => void) {
  /**
   * Header for excluded folders
   */
  const projectRuleContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });

  // Class used from obdsidian's css for consistency
  const projectRuleDetails = projectRuleContainer.createEl("details", {});
  projectRuleDetails.createEl("summary", { text: "Project rules", cls: ["setting-item-heading"] });

  projectRuleDetails.open = !plugin.settings.collapseSections.projectRules;
  projectRuleDetails.addEventListener("toggle", async () => {
    plugin.settings.collapseSections.projectRules = !projectRuleDetails.open;
    await plugin.saveData(plugin.settings);
  });

  const projectList = projectRuleDetails.createDiv({
    cls: "rule_list",
  });
  const projectHeader = projectList.createDiv({
    cls: "rule margig_right",
  });
  projectHeader.createEl("p", {
    text: "Project search criteria (string or regex)",
    cls: "rule_title",
  });

  const addProjectButton = projectHeader.createEl("button", {
    text: "+",
    cls: "rule_button",
  });
  addProjectButton.addEventListener("click", () => {
    plugin.settings.projectRules.push(new ProjectRule());
    display();
  });

  /**
   * List of project rules
   */
  for (const project of plugin.settings.projectRules) {
    const child = projectList.createDiv({ cls: "rule" });
    child.createEl("input", {
      value: project.projectName,
      cls: "rule_input",
    }).onchange = (e) => {
      project.projectName = (e.target as HTMLInputElement).value;
      plugin.settings.projectRules.map((r) => (r === project ? project : r));
      plugin.saveData(plugin.settings);
    };
    child.createEl("input", {
      value: project.folder,
      cls: "rule_input",
    }).onchange = (e) => {
      project.folder = (e.target as HTMLInputElement).value;
      plugin.settings.projectRules.map((r) => (r === project ? project : r));
      plugin.saveData(plugin.settings);
    };

    const duplicateRuleButton = child.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateRuleButton.addEventListener("click", () => {
      plugin.settings.projectRules.push(new ProjectRule(project.projectName, project.folder));
      display();
    });

    const deleteRuleButton = child.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteRuleButton.addEventListener("click", () => {
      plugin.settings.projectRules = plugin.settings.projectRules.filter((r) => r !== project);
      display();
    });
  }
}
