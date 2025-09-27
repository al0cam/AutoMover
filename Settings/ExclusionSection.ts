import { ExclusionRule } from "Models/ExclusionRule";
import type AutoMoverPlugin from "main";
import { Setting } from "obsidian";

export function exclusionSection(
  containerEl: HTMLElement,
  plugin: AutoMoverPlugin,
  display: () => void,
) {
  /**
   * Header for excluded folders
   */
  const exclusionRuleContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });
  new Setting(exclusionRuleContainer).setName("Exclusion rules").setHeading();

  const exclusionList = exclusionRuleContainer.createDiv({
    cls: "rule_list",
  });
  const exclusionHeader = exclusionList.createDiv({
    cls: "rule margig_right",
  });
  exclusionHeader.createEl("p", {
    text: "Excluded folders or files (string or regex)",
    cls: "rule_title",
  });

  const addExclusionButton = exclusionHeader.createEl("button", {
    text: "+",
    cls: "rule_button",
  });
  addExclusionButton.addEventListener("click", () => {
    plugin.settings.exclusionRules.push(new ExclusionRule());
    display();
  });

  /**
   * List of excluded folders
   */
  for (const exclusion of plugin.settings.exclusionRules) {
    const child = exclusionList.createDiv({ cls: "rule" });
    child.createEl("input", {
      value: exclusion.regex,
      cls: "rule_input",
    }).onchange = (e) => {
      exclusion.regex = (e.target as HTMLInputElement).value;
      plugin.settings.exclusionRules.map((ef) =>
        ef === exclusion ? exclusion : ef,
      );
      plugin.saveData(plugin.settings);
    };

    const duplicateExclusionButton = child.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateExclusionButton.addEventListener("click", () => {
      plugin.settings.exclusionRules.push(new ExclusionRule(exclusion.regex));
      display();
    });

    const deleteExclusionButton = child.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteExclusionButton.addEventListener("click", () => {
      plugin.settings.exclusionRules = plugin.settings.exclusionRules.filter(
        (r) => r !== exclusion,
      );
      display();
    });
  }
}
