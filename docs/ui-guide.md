# UI Guide

## Introduction to the UI

This image shows the UI of the plugin with numbers attached to each part of the UI.
The numbers are elaborate below the image.

![settingsUpdatedWithExportImport](https://github.com/user-attachments/assets/70819309-abf1-4537-8106-7705995a03ae)

1. **Plugin location**: This is where you can access the plugin's settings.
2. **Export/Import**: This is where you can export and import the settings you have set up.
3. **On-open toggle button**: This button toggles whether the plugin will run when you open a file.
4. **Manual run button**: This button will run the mover manually for all the files in the obsidian vault.
5. **Automatic moving toggle and input**: This toggle and input will allow you to set a time interval in which the plugin will run automatically. If the time is not set it won't run automatically.
6. **Quick Tutorial**: This is a quick tutorial and reminder on how to use the plugin.
7. **Search criteria**: This is where you can input strings or regex that will be used to match the files you want to move.
8. **Destination path**: This is where you can input the destination path for the files that match the search criteria.
9. **Add rule button**: This button will add a rule to the list of rules.
10. **Delete rule button**: This button will delete the selected rule from the list of rules.
11. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.


## Export and Import

By default, if you are using some way of syncing your obsidian vaults, this doesn't provide anyting new for you.
However, if you wish to transition your notes accross devices which aren't synced or accross vaults, this makes your life easier.

The export and import buttons are used to export and import the settings you have set up.
In case your device can't open a file manager for you to choose the destination and name for the file,
then it will save the settings in the root folder of your vault with the name "AutoMoverSettings.json".

**Obsidian doesn't show json files by default, so you will have to use a file manager to see the file.**
I didn't want the file to be popping out of your notes, I don't consider it more important than your notes.

The same goes for the import button, if your device can't open a file manager for you to choose the file to import,
then it will look for the file "AutoMoverSettings.json" in the root folder of your vault.

Importing new settings will overwrite the current settings you have set up and there is no undo button.
Therefore, the best thing to do is to export the settings before importing new ones, in case you care about them.

## Timer and Timed Moving

The time displayed is an interval, 20:00:00 will execucte every 20 hours.
Other examples could include:
1. 00:05:00 -> triggers every five minutes
2. 00:00:05 -> triggers every five seconds
3. 72:30:00 -> triggers every 3 days and 30 minutes (if your Device is online and obsidian runnning for that long)

## Collapsible UI Sections

From patch 1.0.7 onwards, all rule sections can be collapsed and expanded for better organization (image below).
Each section (Tutorial, Moving Rules, Exclusion Rules, Tag Rules, and Project Rules) can be individually collapsed by clicking on the section header.

Additionally, individual project rules can be collapsed to hide their sub-rules, making it easier to manage multiple projects without cluttering the interface.

The collapse state is saved automatically, so your preferred view will persist between sessions.

<img width="1548" height="475" alt="image" src="https://github.com/user-attachments/assets/a8ef8f50-196c-4658-ae3d-9dba2daf896a" />


## Project Rules UI

From patch 1.0.7 onwards, you can use project rules to group moving rules together.
And to move files based on the project they belong to.
Project rules take precedence over the normal moving rules considering they are way more specific.

Each project rule can be collapsed individually to hide its sub-rules, and the entire Project Rules section can also be collapsed.

<img width="1531" height="611" alt="image" src="https://github.com/user-attachments/assets/c74d13de-6a2f-48f7-bc48-3e25f0f607e9" />

1. **Add Project rule button**: This button will add a project rule to the list of project rules.
2. **Delete rule button**: This button will delete the selected rule from the list of rules.
3. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.


## Tag Rules UI

From patch 1.0.6 onwards, you can move files using tags.
It takes into account the first rule that is a match,
**if it first matches with a FileName rule, it won't check the Tag rules.**
There are no pictures for this one, as it is identical to the previous ruleset.


## Exclusion Rules UI

From patch 1.0.2 onwards, you can exclude files and folders from being moved.
The UI that is used for the exclusion rules is the same as the one used for the search criteria.
But here is a quick glance at how it looks:

![ImageOfExclusionRules](https://github.com/user-attachments/assets/d2d6e30b-c36f-4650-833f-46036ba864d4)

1. **Excluded folder or files**: This is where you can input the folder or file paths you want to exclude from being moved.
2. **Add rule button**: This button will add a rule to the list of rules.
3. **Delete rule button**: This button will delete the selected rule from the list of rules.
4. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.


## Command Palette

From patch 1.0.4 onwards, you can access the plugin from the command palette.
With the available commands being:
- **AutoMover: Move files**: This command will run the mover manually for all the files in the obsidian vault.

## Sidebar (Ribbon)

From patch 1.0.4 onwards, you can access the plugin from the sidebar (ribbon).
In case you need something faster than the command palette, now you have the the option to use the button in the sidebar.
This is what it looks like:

![sidebarRibbon](https://github.com/user-attachments/assets/a632cecf-9113-45c2-947e-ab5ac85c47d9)
