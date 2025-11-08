import { ExclusionRule } from "Models/ExclusionRule";
import type AutoMoverPlugin from "main";
import { Setting } from "obsidian";

export function exclusionSection(containerEl: HTMLElement, plugin: AutoMoverPlugin, display: () => void) {
  /**
   * Debounced save function to avoid excessive disk writes
   */
  let saveTimeout: NodeJS.Timeout | null = null;
  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      plugin.saveData(plugin.settings);
    }, 500);
  };

  /**
   * Header for excluded folders
   */
  const exclusionRuleContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });

  // Class used from obdsidian's css for consistency
  const exclusionRuleDetails = exclusionRuleContainer.createEl("details", {});
  exclusionRuleDetails.createEl("summary", { text: "Exclusion rules", cls: ["setting-item-heading"] });

  exclusionRuleDetails.open = !plugin.settings.collapseSections.exclusionRules;
  exclusionRuleDetails.addEventListener("toggle", async () => {
    plugin.settings.collapseSections.exclusionRules = !exclusionRuleDetails.open;
    await plugin.saveData(plugin.settings);
  });

  const exclusionList = exclusionRuleDetails.createDiv({
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
      debouncedSave();
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
      plugin.settings.exclusionRules = plugin.settings.exclusionRules.filter((r) => r !== exclusion);
      display();
    });
  }
}
