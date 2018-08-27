// Display Emoji Test Pattern Sizes
const emojiPatterns = require ('emoji-test-patterns');
for (let name in emojiPatterns)
{
    let pattern = emojiPatterns[name];
    $.writeln (`${name}: ${pattern.length}`);
}
