// Test Exec Emoji Test Patterns
const emojiPatterns = require ('emoji-test-patterns');
const emojiAllRegex = new RegExp (emojiPatterns["Emoji_Test_All"], 'gu');
const text = "AaĀā👩‍❤️‍💋‍👨#*0❤🇦愛爱애💜";
let match;
while (match = emojiAllRegex.exec (text))
{
    const emoji = match[0];
    $.writeln (`Matched sequence: ${emoji} — Code points: ${[...emoji].length}`);
}
