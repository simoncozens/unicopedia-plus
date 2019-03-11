// Display Emoji Test Pattern Sizes
const emojiTestPatterns = require ('emoji-test-patterns');
for (let name in emojiTestPatterns)
{
    let pattern = emojiTestPatterns[name];
    $.writeln (`${name}: ${pattern.length}`);
}
