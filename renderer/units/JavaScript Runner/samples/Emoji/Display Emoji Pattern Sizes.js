// Display Emoji Pattern Sizes
const emojiPatterns = require ('emoji-patterns');
for (let name in emojiPatterns)
{
    let pattern = emojiPatterns[name];
    $.writeln (`${name}: ${pattern.length}`);
}
