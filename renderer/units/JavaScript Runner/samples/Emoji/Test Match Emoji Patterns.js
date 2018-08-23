// Test Match Emoji Patterns
const emojiList = require ('emoji-test-list');
const emojiPatterns = require ('emoji-patterns');
const emojiRegex = new RegExp (emojiPatterns["Emoji_All"], 'gu');
let matches = Object.keys (emojiList).join (' ').match (emojiRegex);
$.writeln ("Emoji_All:", matches.length);
const keyboardEmojiRegex = new RegExp ('^' + emojiPatterns["Emoji_Keyboard"] + '$', 'u');
matches = matches.filter (match => keyboardEmojiRegex.test (match));
$.writeln ("Emoji_Keyboard:", matches.length);
