// Count Emoji
let emojiList = require ('emoji-test-list');
let keyboardCount = 0;
let count = 0;
for (let emoji in emojiList)
{
    if (!emojiList[emoji].toFullyQualified) keyboardCount++;
    count++;
}
$.writeln (`Fully-Qualified (Keyboard/Palette) Emoji: ${keyboardCount}`);
$.writeln (`Non-Fully-Qualified (Display/Process) Emoji: ${count - keyboardCount}`);
$.writeln (`Total Emoji: ${count}`);
