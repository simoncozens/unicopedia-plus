// Test Exec Emoji Test Patterns
const emojiTestPatterns = require ('emoji-test-patterns');
const allEmojiRegex = new RegExp (emojiTestPatterns["Emoji_Test_All"], 'gu');
const text = "AaĀā👩‍❤️‍💋‍👨#*0❤🇦愛爱애💜";
let match;
while (match = allEmojiRegex.exec (text))
{
    const emoji = match[0];
    $.writeln (`Matched sequence: ${emoji} — Code points: ${[...emoji].length}`);
}
