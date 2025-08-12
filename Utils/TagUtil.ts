class TagUtil {
  private static instance: TagUtil;
  private constructor() {}

  public static getInstance(): TagUtil {
    if (!TagUtil.instance) {
      TagUtil.instance = new TagUtil();
    }
    return TagUtil.instance;
  }
}

const tagUtil = TagUtil.getInstance();
export default tagUtil;
