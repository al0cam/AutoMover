class PropertyUtil {
  private static instance: PropertyUtil;

  private constructor() {}

  static getInstance(): PropertyUtil {
    if (!PropertyUtil.instance) {
      PropertyUtil.instance = new PropertyUtil();
    }
    return PropertyUtil.instance;
  }


/**
 * TODO: Add property support
 *
 * overview.md
 * Page Properties:
 * Project: [[Project A]]
 * File Type: asset
 *
 * It would take those Project Property and File Type Properties, moving it to Project A/assets.
 *
 *
 *
 * Theoretically, projects should then take precedence over tags and names, as they are more specific.
 *
 */

}

const propertyUtil = PropertyUtil.getInstance();
export default propertyUtil;
