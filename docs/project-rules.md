# Project Rules

Project rules allow you to organize files by project using frontmatter metadata. Files with a `Project` or `project` field in their frontmatter will be matched against project rules first, before checking regular moving rules or tag rules.
For reference, frontmatter refers to the obsidian file properties defined at the top of a note, enclosed within triple dashes (`---`).

Reference to file properties: https://help.obsidian.md/properties

## How Project Rules Work

1. **Frontmatter matching**: Add a `Project` or `project` field to your file's frontmatter
2. **Project folder**: Each project rule has a base folder where all project files go
3. **Sub-rules**: Within each project, you can define moving rules that work just like regular moving rules (see [Moving Rules](moving-rules.md) for detailed examples). The only difference is that sub-rules place files within the project folder instead of the vault root.
4. **Fallback to project root**: If no sub-rule matches, the file is moved to the project root folder

## Project Rule Precedence

The plugin checks rules in this order:
1. Project rules (if file has `Project` frontmatter)
2. Moving rules (filename-based)
3. Tag rules (tag-based)

## Fallback Behavior

Files with project frontmatter will always end up in their project folder, even if no specific rule matches:

- **No sub-rules defined**: File goes to project root folder
- **No sub-rule matches**: File goes to project root folder
- **Sub-rule with empty folder or `./`**: File goes to project root folder
- **Sub-rule with specific folder**: File goes to that subfolder within the project

## Example

Imagine you have a project called "Book Collection" with the following structure:

**File frontmatter:**
```yaml
---
Project: Book Collection
---
```

**Project rule setup:**
- Project name: `Book Collection`
- Project folder: `Projects/Books`
- Sub-rules:
  - Regex: `Chapter` → Folder: `Chapters`
  - Regex: `Character` → Folder: `Characters`
  - Regex: `Index` → Folder: `./`

**Results:**
- `Chapter 1.md` → `Projects/Books/Chapters/Chapter 1.md`
- `Character Notes.md` → `Projects/Books/Characters/Character Notes.md`
- `Index.md` → `Projects/Books/Index.md` (using `./` moves to project root)
- `Random Note.md` → `Projects/Books/Random Note.md` (no matching rule, goes to project root)
