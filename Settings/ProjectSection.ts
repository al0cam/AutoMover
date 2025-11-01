import { MovingRule } from "Models/MovingRule";
import * as obsidian from "obsidian";
import type AutoMoverPlugin from "main";
import { ProjectRule } from "Models/ProjectRule";

export function projectSection(containerEl: HTMLElement, plugin: AutoMoverPlugin, display: () => void) {
  /**
   * Header for project folders
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
    text: "Project name",
    cls: "rule_title",
  });
  projectHeader.createEl("p", {
    text: "Destination",
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
   * List of project
   */
  for (const project of plugin.settings.projectRules as ProjectRule[]) {
    const child = projectList.createDiv({ cls: "project" });
    const projectDetails = child.createDiv({ cls: "rule" });

    // Class used from obdsidian's css for consistency
    const movingRulesDetails = child.createEl("details", {});
    const movingRulesSummary = movingRulesDetails.createEl("summary", {
      cls: ["setting-item-heading", "rule"],
    });

    movingRulesDetails.open = !project.collapsed;
    movingRulesDetails.addEventListener("toggle", async () => {
      project.collapsed = !movingRulesDetails.open;
      await plugin.saveData(plugin.settings);
    });

    movingRulesSummary.createEl("input", {
      value: project.projectName,
      cls: "rule_input",
    }).onchange = (e) => {
      project.projectName = (e.target as HTMLInputElement).value;
      plugin.settings.projectRules.map((p) => (p === project ? project : p));
      plugin.saveData(plugin.settings);
    };
    movingRulesSummary.createEl("input", {
      value: project.folder,
      cls: "rule_input",
    }).onchange = (e) => {
      project.folder = (e.target as HTMLInputElement).value;
      plugin.settings.projectRules.map((p) => (p === project ? project : p));
      plugin.saveData(plugin.settings);
    };

    const addRuleButton = movingRulesSummary.createEl("button", {
      text: "+",
      cls: "rule_button",
    });
    addRuleButton.addEventListener("click", () => {
      project.rules.push(new MovingRule());
      display();
    });

    const duplicateRuleButton = movingRulesSummary.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateRuleButton.addEventListener("click", () => {
      plugin.settings.projectRules.push(new ProjectRule(project.projectName, project.folder));
      display();
    });

    const deleteRuleButton = movingRulesSummary.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteRuleButton.addEventListener("click", () => {
      plugin.settings.projectRules = plugin.settings.projectRules.filter((p) => p !== project);
      display();
    });

    const movingRules = movingRulesDetails.createDiv();
    /**
     * List of project rules
     */
    for (const rule of project.rules) {
      const child = movingRules.createDiv({ cls: "project_rule" });
      child.createEl("input", {
        value: rule.regex,
        cls: "rule_input",
      }).onchange = (e) => {
        rule.regex = (e.target as HTMLInputElement).value;
        project.rules.map((r) => (r === rule ? rule : r));
        plugin.saveData(plugin.settings);
      };
      child.createEl("input", {
        value: rule.folder,
        cls: "rule_input",
      }).onchange = (e) => {
        project.folder = (e.target as HTMLInputElement).value;
        project.rules.map((r) => (r === rule ? rule : r));
        plugin.saveData(plugin.settings);
      };

      const duplicateRuleButton = child.createEl("button", {
        text: "⿻",
        cls: "rule_button rule_button_duplicate",
      });
      duplicateRuleButton.addEventListener("click", () => {
        project.rules.push(new MovingRule(rule.regex, rule.folder));
        display();
      });

      const deleteRuleButton = child.createEl("button", {
        text: "x",
        cls: "rule_button rule_button_remove",
      });
      deleteRuleButton.addEventListener("click", () => {
        project.rules = plugin.settings.projectRules.find((p) => p === project)!.rules.filter((r) => r !== rule);
        display();
      });
    }

    projectDetails.createEl("br");
  }
}
