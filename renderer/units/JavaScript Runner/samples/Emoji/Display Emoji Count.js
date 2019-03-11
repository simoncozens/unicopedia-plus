// Display Emoji Count
let emojiTestList = require ('emoji-test-list');
let componentCount = 0;
let keyboardCount = 0;
let displayCount = 0;
let count = 0;
for (let emoji in emojiTestList)
{
    if (emojiTestList[emoji].isComponent)
    {
        componentCount++
    }
    else if (emojiTestList[emoji].toFullyQualified)
    {
        displayCount++;
    }
    else
    {
        keyboardCount++;
    }
    count++;
}
$.writeln (`Component Emoji: ${componentCount}`);
$.writeln (`Fully-Qualified (Keyboard/Palette) Emoji: ${keyboardCount}`);
$.writeln (`Non-Fully-Qualified (Display/Process) Emoji: ${displayCount}`);
$.writeln (`Total Emoji: ${count}`);
