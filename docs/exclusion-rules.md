# Exclusion Rules

The exclusion rules are used to exclude files and folders from being moved.
They go above the moving rules and are used to filter out files and folders that you don't want to be moved.

They syntax is the same as the one used for the moving rules but here you can find some exaples of how to use them anyway:

## Example without Regex

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

## Example with Regex

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
