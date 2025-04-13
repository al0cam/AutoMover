import type AutoMoverPlugin from "main";
import type { ExclusionRule } from "Models/ExclusionRule";
import type { MovingRule } from "Models/MovingRule";

export interface AutoMoverSettings {
  moveOnOpen: boolean;
  moveOnSave: boolean;
  moveOnClose: boolean;
  moveOnCreate: boolean;
  movingRules: MovingRule[];
  excludedFolders: ExclusionRule[];
}

export const DEFAULT_SETTINGS: Partial<AutoMoverSettings> = {
  moveOnOpen: true,
  moveOnSave: true,
  moveOnClose: false,
  moveOnCreate: false,
  movingRules: [],
  excludedFolders: [],
};

function loadSettings(
  AutoMoverPlugin: AutoMoverPlugin,
): Partial<AutoMoverSettings> {
  return Object.assign({}, DEFAULT_SETTINGS, AutoMoverPlugin.loadData());
}
