# Tag Rules

Tag rules allow you to organize files based on their Obsidian tags. When a file contains tags, the plugin will check each tag against your defined tag rules and move the file accordingly.

## How Tag Rules Work

1. **Tag matching**: The plugin checks all tags in a file against your tag rules
2. **First match wins**: If multiple tag rules match, only the first matching rule is applied
3. **Tag format flexibility**: Tags are matched with or without the `#` prefix (both work)
4. **Regex support**: You can use regex patterns to match tags and extract groups for dynamic folder paths

## Rule Precedence

The plugin checks rules in this order:
1. Project rules (if file has `Project` frontmatter)
2. Moving rules (filename-based)
3. Tag rules (tag-based)

## Important Notes

#### Important note 1: The text is case sensitive.
#### Important note 2: Use the "/" character to separate folders.
#### Important note 3: The regex flavor used is ECMAScript (JavaScript). The biggest difference from PCRE2 is that {} brackets require the first value to be something ({0,1} works, but {,1} does not).
#### Writing Regex: The best tool for writing regex is Regex101 (https://regex101.com/)

## Examples without Regex

Let's imagine you have files tagged with #work, #personal, and #urgent.

**Tag rules setup:**
- Regex: `work` → Folder: `Work`
- Regex: `personal` → Folder: `Personal`
- Regex: `urgent` → Folder: `Urgent`

Note: You can use `#work` or just `work` in the regex field - both will match the tag `#work`.

**Results:**
- A file tagged with `#work` → moves to `Work/`
- A file tagged with `#personal` → moves to `Personal/`
- A file tagged with `#urgent` → moves to `Urgent/`
- A file tagged with `#work` and `#urgent` → moves to `Work/` (first matching rule)

## Example with Regex and Groups

Imagine you have files tagged with tags like `#project-alpha`, `#project-beta`, and `#project-gamma`.

You want to extract the project name and organize files into subfolders based on that name.

**Tag rule setup:**
- Regex: `#?project-(.+)` → Folder: `Projects/$1`

The regex pattern explained:
- `#?` - Optionally matches the `#` symbol
- `project-` - Matches the literal text "project-"
- `(.+)` - Captures one or more characters (the project name)
- `$1` - In the folder path, this is replaced with the captured group

**Results:**
- File tagged with `#project-alpha` → moves to `Projects/alpha/`
- File tagged with `#project-beta` → moves to `Projects/beta/`
- File tagged with `#project-gamma` → moves to `Projects/gamma/`

## Advanced Example with Multiple Groups

You can use multiple capture groups for more complex organization:

**Tag rule setup:**
- Regex: `#?([a-z]+)-([0-9]+)` → Folder: `$1/Year-$2`

**Results:**
- File tagged with `#archive-2023` → moves to `archive/Year-2023/`
- File tagged with `#draft-2024` → moves to `draft/Year-2024/`

## Tips

- **Test your regex**: Use Regex101.com to test patterns before adding them to the plugin
- **Tag priority**: If a file has multiple tags, organize your tag rules with the most specific patterns first
- **Combine with other rules**: Remember that project rules take priority over tag rules
- **Escape special characters**: If your tags contain regex special characters like `.` or `()`, escape them with a backslash

