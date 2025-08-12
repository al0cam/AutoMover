import { MovingRule } from "Models/MovingRule";
import type AutoMoverPlugin from "main";
import { Setting } from "obsidian";

export default function movingRuleSection(
  containerEl: HTMLElement,
  plugin: AutoMoverPlugin,
) {
  /**
   * Header of the rules
   */
  const movingRulesContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });

  new Setting(movingRulesContainer).setName("Moving rules").setHeading();

  const ruleList = movingRulesContainer.createDiv({ cls: "rule_list" });
  const ruleHeader = ruleList.createDiv({ cls: "rule margig_right" });
  ruleHeader.createEl("p", {
    text: "Search criteria (string or regex)",
    cls: "rule_title",
  });
  ruleHeader.createEl("p", {
    text: "Folder (string that can contain regex groups)",
    cls: "rule_title",
  });

  const addRuleButton = ruleHeader.createEl("button", {
    text: "+",
    cls: "rule_button",
  });
  addRuleButton.addEventListener("click", () => {
    plugin.settings.movingRules.push(new MovingRule());
    // this is used to rerender the settings tab
    this.display();
  });

  /**
   * List of rules
   */
  for (const rule of plugin.settings.movingRules) {
    const child = ruleList.createDiv({ cls: "rule" });
    child.createEl("input", {
      value: rule.regex,
      cls: "rule_input",
    }).onchange = (e) => {
      rule.regex = (e.target as HTMLInputElement).value;
      plugin.settings.movingRules.map((r) => (r === rule ? rule : r));
      plugin.saveData(plugin.settings);
    };
    child.createEl("input", {
      value: rule.folder,
      cls: "rule_input",
    }).onchange = (e) => {
      rule.folder = (e.target as HTMLInputElement).value;
      plugin.settings.movingRules.map((r) => (r === rule ? rule : r));
      plugin.saveData(plugin.settings);
    };

    const duplicateRuleButton = child.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateRuleButton.addEventListener("click", () => {
      plugin.settings.movingRules.push(new MovingRule(rule.regex, rule.folder));
      this.display();
    });

    const deleteRuleButton = child.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteRuleButton.addEventListener("click", () => {
      plugin.settings.movingRules = plugin.settings.movingRules.filter(
        (r) => r !== rule,
      );
      this.display();
    });
  }
}
