# AutoMover Plugin

This plugin is used for designating folders in which your files will be moved automatically.
It seeks to be an alternative to the "https://github.com/farux/obsidian-auto-note-mover" plugin from farux.
The problem I had with that plugin was the lack of support for regex and regex groups in the destination paths.

Therefore, this plugin supports regex and regex groups to create the destination paths unless they already exist.

## Features

- **Automatic file moving** based on filename patterns, tags, or project metadata
- **Regex support** with capture groups for dynamic folder creation
- **Project-based organization** using frontmatter metadata
- **Tag-based rules** for organizing files by tags
- **Exclusion rules** to protect specific files/folders from being moved
- **Multiple triggers**: on file open, manual execution, or time-based automation
- **Collapsible UI** for better organization of complex rule sets
- **Import/Export** settings for easy backup and sharing

## Documentation

- [UI Guide](docs/ui-guide.md) - Complete overview of the plugin interface and settings
- [Moving Rules](docs/moving-rules.md) - Filename-based rules with regex examples
- [Tag Rules](docs/tag-rules.md) - Filename-based rules with regex examples
- [Project Rules](docs/project-rules.md) - Organize files by project using frontmatter
- [Exclusion Rules](docs/exclusion-rules.md) - Protect specific files and folders

## Quick Start

1. Install the plugin from the Obsidian Community Plugins
2. Open Settings → AutoMover
3. Create your first rule:
   - **Search criteria**: Enter a filename pattern or regex (e.g., "Meeting")
   - **Destination folder**: Enter the target folder path (e.g., "Work/Meetings")
4. Toggle "Move on open" to enable automatic moving
5. Use the "Move files" button to apply rules to existing files

### Rule Priority

The plugin checks rules in this order:
1. **Exclusion rules** - Files matching these are never moved
2. **Project rules** - Files with `Project` frontmatter match first
3. **Moving rules** - Filename-based pattern matching
4. **Tag rules** - Tag-based matching (if no filename rule matched)

## Installation

### From Obsidian Community Plugins (Recommended)
1. Open Settings → Community Plugins
2. Browse and search for "AutoMover"
3. Click Install, then Enable

### Manual Installation
1. Download the latest release from GitHub
2. Extract files to `.obsidian/plugins/AutoMover/`
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Requesting Features and Reporting Issues

If you want to request a feature or report an issue, please do so by creating an issue in the issues tab of this repository.
In case you for some reason want to contact me directly, you can do so by sending me an email which is displayed in my github profile or via LinkedIn which is also displayed in my github profile.

## Contribution

If you want to contribute to this plugin, you can do so by forking this repository and creating a pull request with your changes and an elaboration what they are and why.
Thank you!


## Future Plans

- [x] Add excluded folder support
- [x] Add excluded file support
- [x] Add regex support for excluded folders and files (must support language accents like ñ, á, š, đ, こ, 猫, etc.)
- [x] Add time based execution of rule sorting
- [x] Exposing the move files button to the left toolbar
- [x] Exposing the move files to the commands accessible via command palette
- [x] Add import and export of rules
- [x] Add #tag rule support
- [ ] Add a file like .gitignore which contains all the moving rules (i am assuming the list can grow quite big for some people)
- [ ] Auto tagging of moved files with the destination folder name (last folder in the path)
- [ ] Add undo button to the notification popup for the moved files


- [x] Add collapse/expand all rules button
- [x] Add Project moving rules
	- [x] Project name and destination path
	- [x] Subfield that contain the moving rules for the project
- [x] Add project rules UI
- [x] Project rules business logic
