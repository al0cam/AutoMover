# AutoMover plugin

This plugin is used for designating folders in which your files will be moved automatically.
It seeks to be an alternative to the "https://github.com/farux/obsidian-auto-note-mover" plugin from farux.
The problem I had with that plugin was the lack of support for regex and regex groups in the destination paths.

Therefore, this plugin supports regex and regex groups to create the destination paths unless they already exist.

## How to use

Using the plugin doens't require any special setup. Just install it and you're good to go.
Also, you can use it without knowing what regex is, but it's recommended to learn it to get the most out of this plugin.

## Introduction to the UI

This image shows the UI of the plugin with numbers attached to each part of the UI.
The numbers are elaborate below the image.

![Explanation](https://github.com/user-attachments/assets/2c7ec7e0-f8e1-4f7f-ad12-c74e733be751)


1. **Plugin location**: This is where you can access the plugin's settings.
2. **On-open toggle button**: This button toggles whether the plugin will run when you open a file.
3. **Manual run button**: This button will run the mover manually for all the files in the obsidian vault.
4. **Quick Tutorial**: This is a quick tutorial and reminder on how to use the plugin.
5. **Search criteria**: This is where you can input strings or regex that will be used to match the files you want to move.
6. **Destination path**: This is where you can input the destination path for the files that match the search criteria.
7. **Add rule button**: This button will add a rule to the list of rules.
8. **Delete rule button**: This button will delete the selected rule from the list of rules.
9. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.


### Exclusion rules UI
From patch 1.0.2 onwards, you can exclude files and folders from being moved.
The UI that is used for the exclusion rules is the same as the one used for the search criteria.
But here is a quick glance at how it looks:

![ImageOfExclusionRules](https://github.com/user-attachments/assets/d2d6e30b-c36f-4650-833f-46036ba864d4)

1. **Excluded folder or files**: This is where you can input the folder or file paths you want to exclude from being moved.
2. **Add rule button**: This button will add a rule to the list of rules.
3. **Delete rule button**: This button will delete the selected rule from the list of rules.
4. **Duplicate rule button**: This button will duplicate the selected rule from the list of rules.

## Usage of moving rules

#### Important note 1: The text is case sensitive.
#### Important note 2: Use the "/" character to separate folders.
#### Writing Regex: The best tool for writing regex is Regex101 (https://regex101.com/)

### Examples without regex

Lets imagine you have three files called Scroll 1, Scroll 2 and Scroll 3.
Such as you can see below:

![BeforeBasicScrollRule](https://github.com/user-attachments/assets/32b37cd2-8233-4af0-9e77-79cecb0a3c78)

After you install the plugin, you can create a rule to move all files that start with "Scroll" to the "Scrolls" folder.
The rule would look like this:

![BasicScrollRule](https://github.com/user-attachments/assets/292885cf-8bac-4d9d-95f7-80aeae4ed2aa)

This will then create a folder called "Scrolls" and move all files that start with "Scroll" to that folder.
The end result will look like this:

![BasicResult](https://github.com/user-attachments/assets/a4cd919f-db48-4d92-80cd-ae881a2f1154)

### Example with the usage of regex and groups

#### Important note: The regex flavor used in this plugin is the ECMAScript(Javascript) flavor. The biggest difference between ECMAScript and PCRE2 is that {} brackets require the first value to be something ({0,1} -> zero or one of), while in PCRE2 it can be empty ({,1} -> zero or one of).

Imagine that you wanted to sort each scroll by its number into a separate folder.
You could use the following regex to achieve that:

![RegexGroupingScrolls](https://github.com/user-attachments/assets/d2336c5c-1c14-4dd3-85a6-563aa6c8bde9)


This will then create a folder for each scroll number and move the respective files to the correct folder.
The end result will look like this:

![RegexGroupingResult](https://github.com/user-attachments/assets/96da1cf2-0799-4984-ae5b-302d5ff35a8f)


## Usage of exclusion rules

The exclusion rules are used to exclude files and folders from being moved.
They go above the moving rules and are used to filter out files and folders that you don't want to be moved.

They syntax is the same as the one used for the moving rules but here you can find some exaples of how to use them anyway:

### Example without regex

Lets imagine you have some creatures you want to move into folders like this.
The list of creatures looks like this:

![ExclusionExample1Before](https://github.com/user-attachments/assets/a6f5a658-94de-4d78-9eb5-2342164d7cff)

And the rules you want to apply to them look like this:

![rulesToApplyRats](https://github.com/user-attachments/assets/83eef1c8-1874-465c-a356-ec2754f62f52)

After moving them you are left with this:

![Example1Sorted](https://github.com/user-attachments/assets/2c952393-3e0b-4ff6-885e-2af1e526d4ab)

And now you are thinking "Damn, despite all that rage, those are still rats in a cage..."
And because you saw how angry the rats were, you decided you don't want to include them in further sorting.
Therefore, a rule would look like this:

![ExcludedRat](https://github.com/user-attachments/assets/f4eaa39e-f7b4-43e1-9e34-b9dfe24eb6f7)

And the result would look like this:

![RatsUntrapped](https://github.com/user-attachments/assets/91de85b3-14e1-471b-91e1-bb677b714ae5)

### Example with regex

I don't have any funny examples for this one, but I thought it could be useful to have the opportunity to exclude files and folders using regex as well.

Let's imagine you are moving the following files:

![SystemFiles](https://github.com/user-attachments/assets/9bc0de03-8e3a-4a11-8b23-48b28cade020)

And you decided you want to exclude those that have numbers as a suffix.
Then your rules can look like this:

![SystemRules](https://github.com/user-attachments/assets/c1779dee-2c13-459c-a11d-4f39fd49c3de)

And the result would look like this:

![SystemResult](https://github.com/user-attachments/assets/b5c2b915-7a3d-41f5-a91a-249f57f88d86)

A sidenote for this is that regex can by default be used to manage exclusions as well.
So the current example of exclusion could have been handled with a slight change to the moving rule as well.
The rule would looks like this "System [^\d\W]*" and the result would be the same.

## Requesting features and reporting issues

If you want to request a feature or report an issue, please do so by creating an issue in the issues tab of this repository.
In case you for some reason want to contact me directly, you can do so by sending me an email which is displayed in my github profile or via LinkedIn which is also displayed in my github profile.

## Contribution

If you want to contribute to this plugin, you can do so by forking this repository and creating a pull request with your changes and an elaboration what they are and why.
Thank you!


## Future plans

- [x] Add excluded folder support
- [x] Add excluded file support
- [x] Add regex support for excluded folders and files (must support language accents like ñ, á, š, đ, こ, 猫, etc.)
- [ ] Add a file like .gitignore which contains all the moving rules (i am assuming the list can grow quite big for some people)

