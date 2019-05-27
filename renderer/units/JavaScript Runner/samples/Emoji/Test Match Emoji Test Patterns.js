// Test Match Emoji Test Patterns
const emojiTestList = require ('emoji-test-list');
const emojiTestPatterns = require ('emoji-test-patterns');
const allEmojiRegex = new RegExp (emojiTestPatterns["Emoji_Test_All"], 'gu');
let allMatches = Object.keys (emojiTestList).join (" ").match (allEmojiRegex);
$.writeln ("Emoji_Test_All:", allMatches.length);
const componentEmojiRegex = new RegExp ('^' + emojiTestPatterns["Emoji_Test_Component"] + '$', 'u');
let matches = allMatches.filter (match => componentEmojiRegex.test (match));
$.writeln ("Emoji_Test_Component:", matches.length);
const keyboardEmojiRegex = new RegExp ('^' + emojiTestPatterns["Emoji_Test_Keyboard"] + '$', 'u');
matches = allMatches.filter (match => keyboardEmojiRegex.test (match));
$.writeln ("Emoji_Test_Keyboard:", matches.length);
const displayEmojiRegex = new RegExp ('^' + emojiTestPatterns["Emoji_Test_Display"] + '$', 'u');
matches = allMatches.filter (match => displayEmojiRegex.test (match));
$.writeln ("Emoji_Test_Display:", matches.length);
