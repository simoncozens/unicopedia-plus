// Display Emoji Pattern Names
const emojiPatterns = require ('emoji-patterns');
return $.stringify (Object.keys (emojiPatterns).sort (), null, 4);