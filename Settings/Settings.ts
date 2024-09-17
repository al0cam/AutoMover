import AutoMoverPlugin from "main";

export interface AutoMoverSettings {
  moveOnOpen: boolean,
  moveOnSave: boolean,
  moveOnClose: boolean,
  moveOnCreate: boolean,
}

export const DEFAULT_SETTINGS: Partial<AutoMoverSettings> = {
  moveOnOpen: true,
  moveOnSave: true,
  moveOnClose: false,
  moveOnCreate: false,
}

function loadSettings(AutoMoverPlugin: AutoMoverPlugin): Partial<AutoMoverSettings> {
  return Object.assign({}, DEFAULT_SETTINGS, AutoMoverPlugin.loadData());
}