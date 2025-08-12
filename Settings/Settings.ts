import type AutoMoverPlugin from "main";
import type { ExclusionRule } from "Models/ExclusionRule";
import type { MovingRule } from "Models/MovingRule";

export interface AutoMoverSettings {
  moveOnOpen: boolean;
  // moveOnSave: boolean;
  movingRules: MovingRule[];
  exclusionRules: ExclusionRule[];
  tagRules: MovingRule[];
  automaticMoving: boolean;
  timer: number | null; // in miliseconds
}

export const DEFAULT_SETTINGS: Partial<AutoMoverSettings> = {
  moveOnOpen: true,
  // moveOnSave: true,
  movingRules: [],
  exclusionRules: [],
  tagRules: [],
  automaticMoving: false,
  timer: null,
};

function loadSettings(
  AutoMoverPlugin: AutoMoverPlugin,
): Partial<AutoMoverSettings> {
  return Object.assign({}, DEFAULT_SETTINGS, AutoMoverPlugin.loadData());
}
