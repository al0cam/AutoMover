import AutoMoverPlugin from "main";
import { MovingRule } from "Models/MovingRule";
import { Setting } from "obsidian";

export default function movingRuleSection(containerEl: HTMLElement, plugin: AutoMoverPlugin, display: () => void) {
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
   * Header of the rules
   */
  const movingRulesContainer = containerEl.createDiv({
    cls: "moving_rules_container",
  });

  // Class used from obdsidian's css for consistency
  const movingRuleDetails = movingRulesContainer.createEl("details", {});
  movingRuleDetails.createEl("summary", { text: "Moving rules", cls: ["setting-item-heading"] });

  movingRuleDetails.open = !plugin.settings.collapseSections.movingRules;
  movingRuleDetails.addEventListener("toggle", async () => {
    plugin.settings.collapseSections.movingRules = !movingRuleDetails.open;
    await plugin.saveData(plugin.settings);
  });

  const ruleList = movingRuleDetails.createDiv({ cls: "rule_list" });
  const ruleHeader = ruleList.createDiv({ cls: "rule margig_right" });
  ruleHeader.createEl("p", {
    text: "Search criteria (string or regex)",
    cls: "rule_title",
  });
  ruleHeader.createEl("p", {
    text: "Folder (can contain regex groups)",
    cls: "rule_title",
  });

  const addRuleButton = ruleHeader.createEl("button", {
    text: "+",
    cls: "rule_button",
  });
  addRuleButton.addEventListener("click", () => {
    plugin.settings.movingRules.push(new MovingRule());
    display();
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
      debouncedSave();
    };
    child.createEl("input", {
      value: rule.folder,
      cls: "rule_input",
    }).onchange = (e) => {
      rule.folder = (e.target as HTMLInputElement).value;
      debouncedSave();
    };

    const duplicateRuleButton = child.createEl("button", {
      text: "⿻",
      cls: "rule_button rule_button_duplicate",
    });
    duplicateRuleButton.addEventListener("click", () => {
      plugin.settings.movingRules.push(new MovingRule(rule.regex, rule.folder));
      display();
    });

    const deleteRuleButton = child.createEl("button", {
      text: "x",
      cls: "rule_button rule_button_remove",
    });
    deleteRuleButton.addEventListener("click", () => {
      plugin.settings.movingRules = plugin.settings.movingRules.filter((r) => r !== rule);
      display();
    });
  }
}
