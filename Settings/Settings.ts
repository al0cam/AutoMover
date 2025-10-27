import type AutoMoverPlugin from "main";
import type { ExclusionRule } from "Models/ExclusionRule";
import type { MovingRule } from "Models/MovingRule";
import { ProjectRule } from "Models/ProjectRule";

export interface AutoMoverSettings {
  moveOnOpen: boolean;
  // moveOnSave: boolean;
  movingRules: MovingRule[];
  exclusionRules: ExclusionRule[];
  tagRules: MovingRule[];
  projectRules: ProjectRule[];
  automaticMoving: boolean;
  timer: number | null; // in miliseconds
  collapseSections: {
    tutorial: boolean;
    movingRules: boolean;
    exclusionRules: boolean;
    tagRules: boolean;
    projectRules: boolean;
  };
}

export const DEFAULT_SETTINGS: Partial<AutoMoverSettings> = {
  moveOnOpen: true,
  // moveOnSave: true,
  movingRules: [],
  exclusionRules: [],
  tagRules: [],
  projectRules: [],
  automaticMoving: false,
  timer: null,
  collapseSections: {
    tutorial: false,
    movingRules: false,
    exclusionRules: false,
    tagRules: false,
    projectRules: false,
  },
};

function loadSettings(AutoMoverPlugin: AutoMoverPlugin): Partial<AutoMoverSettings> {
  return Object.assign({}, DEFAULT_SETTINGS, AutoMoverPlugin.loadData());
}
