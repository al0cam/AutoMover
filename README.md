# AutoMover plugin

This plugin is used for designating folders in which your files will be moved automatically.
It seeks to be an alternative to the "https://github.com/farux/obsidian-auto-note-mover" plugin from farux.
The problem I had with that plugin was the lack of support for regex and regex groups in the destination paths.

Therefore, this plugin supports regex and regex groups to create the destination paths unless they already exist.

## How to use

Using the plugin doens't require any special setup. Just install it and you're good to go.
Also, you can use it without knowing what regex is, but it's recommended to learn it to get the most out of this plugin.

### Introduction to the UI

This image shows the UI of the plugin with numbers attached to each part of the UI.
The numbers are elaborate below the image.

![Explanation](https://github.com/user-attachments/assets/e398f5dd-1f28-4416-8114-404ab72b39f9)


1. **Plugin location**: This is where you can access the plugin's settings.
2. **On-open toggle button**: This button toggles whether the plugin will run when you open a file.
3. **Manual run button**: This button will run the mover manually for all the files in the obsidian vault.
4. **Quick Tutorial**: This is a quick tutorial and reminder on how to use the plugin.
5. **Search criteria**: This is where you can input strings or regex that will be used to match the files you want to move.
6. **Destination path**: This is where you can input the destination path for the files that match the search criteria.
7. **Add rule button**: This button will add a rule to the list of rules.
8. **Delete rule button**: This button will delete the selected rule from the list of rules.
9. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.


### Example without regex

#### Important note: The text is case sensitive.

Lets imagine you have three files called Scroll 1, Scroll 2 and Scroll 3.
Such as you can see below:
![BeforeBasicScrollRule](https://github.com/user-attachments/assets/32b37cd2-8233-4af0-9e77-79cecb0a3c78)

After you install the plugin, you can create a folder called "Scrolls" and then create a rule to move all files that start with "Scroll" to the "Scrolls" folder.
The rule would look like this:
![BasicScrollRule](https://github.com/user-attachments/assets/292885cf-8bac-4d9d-95f7-80aeae4ed2aa)

This will then create a folder called "Scrolls" and move all files that start with "Scroll" to that folder.
The end result will look like this:
![BasicResult](https://github.com/user-attachments/assets/a4cd919f-db48-4d92-80cd-ae881a2f1154)

### Example with the usage of regex and groups

#### Important note: The regex flavor used in this plugin is the ECMAScript(Javascript) flavor. The biggest difference between ECMAScript and PCRE2 is that {} brackets require the first value to be something ({0,1} -> zero or one of), while in PCRE2 it can be empty ({,1} -> zero or one of).

Imagine that you wanted to sort each scroll by its number into a separate folder.
You could use the following regex to achieve that:
![RegexGroupingScrolls](https://github.com/user-attachments/assets/9a588831-95cd-45c7-8295-4c6fec204662)


This will then create a folder for each scroll number and move the respective files to the correct folder.
The end result will look like this:
![RegexGroupingResult](https://github.com/user-attachments/assets/96da1cf2-0799-4984-ae5b-302d5ff35a8f)

## Contribution

If you want to contribute to this plugin, you can do so by forking this repository and creating a pull request with your changes and an elaboration what they are and why.
Thank you!
