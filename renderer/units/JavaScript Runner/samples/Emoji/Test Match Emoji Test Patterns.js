// Test Match Emoji Test Patterns
const emojiList = require ('emoji-test-list');
const emojiPatterns = require ('emoji-test-patterns');
const emojiRegex = new RegExp (emojiPatterns["Emoji_Test_All"], 'gu');
let matches = Object.keys (emojiList).join (' ').match (emojiRegex);
$.writeln ("Emoji_Test_All:", matches.length);
const keyboardEmojiRegex = new RegExp ('^' + emojiPatterns["Emoji_Test_Keyboard"] + '$', 'u');
matches = matches.filter (match => keyboardEmojiRegex.test (match));
$.writeln ("Emoji_Test_Keyboard:", matches.length);
