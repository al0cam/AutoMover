import AutoMoverPlugin from "main";
import { MovingRule } from "Models/MovingRule";

export interface AutoMoverSettings {
  moveOnOpen: boolean,
  moveOnSave: boolean,
  moveOnClose: boolean,
  moveOnCreate: boolean,
  movingRules: MovingRule[],
}

// TODO: Define a value which accepts a regex that will be used to manage files
// the matcher group should accept an argument which will be the name of the folder to which the files will be moved
// e.g. if the file is a daily note like 14.09.2021.md, then the folder structure should be YYYY/MM/DD


// there should be a button in the settings to sort all the files according to given criteria
// the button should be disabled if the regex is invalid -> there are no matches

// regex that should be accepted:
// YYYY -> year
// MM -> month
// DD -> day
// some string -> the string should be the name of the folder

export const DEFAULT_SETTINGS: Partial<AutoMoverSettings> = {
  moveOnOpen: true,
  moveOnSave: true,
  moveOnClose: false,
  moveOnCreate: false,
  movingRules: [],
}

function loadSettings(AutoMoverPlugin: AutoMoverPlugin): Partial<AutoMoverSettings> {
  return Object.assign({}, DEFAULT_SETTINGS, AutoMoverPlugin.loadData());
}