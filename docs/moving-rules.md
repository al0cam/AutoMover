# Moving Rules

## Important Notes

#### Important note 1: The text is case sensitive.
#### Important note 2: Use the "/" character to separate folders.
#### Writing Regex: The best tool for writing regex is Regex101 (https://regex101.com/)

## Examples without Regex

Lets imagine you have three files called Scroll 1, Scroll 2 and Scroll 3.
Such as you can see below:

![BeforeBasicScrollRule](https://github.com/user-attachments/assets/32b37cd2-8233-4af0-9e77-79cecb0a3c78)

After you install the plugin, you can create a rule to move all files that start with "Scroll" to the "Scrolls" folder.
The rule would look like this:

![BasicScrollRule](https://github.com/user-attachments/assets/292885cf-8bac-4d9d-95f7-80aeae4ed2aa)

This will then create a folder called "Scrolls" and move all files that start with "Scroll" to that folder.
The end result will look like this:

![BasicResult](https://github.com/user-attachments/assets/a4cd919f-db48-4d92-80cd-ae881a2f1154)

## Example with Regex and Groups

#### Important note: The regex flavor used in this plugin is the ECMAScript(Javascript) flavor. The biggest difference between ECMAScript and PCRE2 is that {} brackets require the first value to be something ({0,1} -> zero or one of), while in PCRE2 it can be empty ({,1} -> zero or one of).

Imagine that you wanted to sort each scroll by its number into a separate folder.
You could use the following regex to achieve that:

![RegexGroupingScrolls](https://github.com/user-attachments/assets/d2336c5c-1c14-4dd3-85a6-563aa6c8bde9)


This will then create a folder for each scroll number and move the respective files to the correct folder.
The end result will look like this:

![RegexGroupingResult](https://github.com/user-attachments/assets/96da1cf2-0799-4984-ae5b-302d5ff35a8f)
