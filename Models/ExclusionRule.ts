/**
 * Defines the Exlclusion rules that will jump over the folders defined in the regex
 */
export class ExclusionRule {
	/**
	 * This filed is used for defining the regex with its group matchers
	 */
	public regex: string;

	constructor(regex?: string) {
		this.regex = regex || "";
	}
}
