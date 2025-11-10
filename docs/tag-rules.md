# Tag Rules

The tag rules apply only to the one tag, tag arrays and sequences are not supported.
And if you define multiple tag rules, only the first matching one will be applied.

## Important Notes

#### Important note 1: The text is case sensitive.
#### Important note 2: Use the "/" character to separate folders.
#### Writing Regex: The best tool for writing regex is Regex101 (https://regex101.com/)

## Examples without Regex

Lets imagine you have some files tagged with different tags such as #work, #personal and #urgent.

And tag rules defined such as these:
Regex: work → Folder: Work
Regex: personal → Folder: Personal
Regex: #urgent → Folder: Urgent
(As you can see, if you use # before the tag in the rulename, it will work as well.)

After applying the tag rules, the files will be moved to their respective folders based on their tags.

## Example with Regex

Imagine you have files tagged with tags like #project-alpha, #project-beta, and #project-gamma.


