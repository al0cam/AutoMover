import { MovingRule } from "Models/MovingRule";
import * as obsidian from "obsidian";
import type AutoMoverPlugin from "main";

export function tagSection(containerEl: HTMLElement, plugin: AutoMoverPlugin) {
  /**
   * Header for excluded folders
   */
  const tagRuleContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });
  new obsidian.Setting(tagRuleContainer).setName("Tag rules").setHeading();

  const tagList = tagRuleContainer.createDiv({
    cls: "rule_list",
  });
  const tagHeader = tagList.createDiv({
    cls: "rule margig_right",
  });
  tagHeader.createEl("p", {
    text: "Tag search criteria (string or regex)",
    cls: "rule_title",
  });

  const addTagButton = tagHeader.createEl("button", {
    text: "+",
    cls: "rule_button",
  });
  addTagButton.addEventListener("click", () => {
    plugin.settings.tagRules.push(new MovingRule());
    this.display();
  });

  /**
   * List of tag rules
   */
  for (const rule of plugin.settings.tagRules) {
    const child = tagList.createDiv({ cls: "rule" });
    child.createEl("input", {
      value: rule.regex,
      cls: "rule_input",
    }).onchange = (e) => {
      rule.regex = (e.target as HTMLInputElement).value;
      plugin.settings.tagRules.map((r) => (r === rule ? rule : r));
      plugin.saveData(plugin.settings);
    };
    child.createEl("input", {
      value: rule.folder,
      cls: "rule_input",
    }).onchange = (e) => {
      rule.folder = (e.target as HTMLInputElement).value;
      plugin.settings.tagRules.map((r) => (r === rule ? rule : r));
      plugin.saveData(plugin.settings);
    };

    const duplicateRuleButton = child.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateRuleButton.addEventListener("click", () => {
      plugin.settings.tagRules.push(new MovingRule(rule.regex, rule.folder));
      this.display();
    });

    const deleteRuleButton = child.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteRuleButton.addEventListener("click", () => {
      plugin.settings.tagRules = plugin.settings.tagRules.filter(
        (r) => r !== rule,
      );
      this.display();
    });
  }
}
