// Get Display Emoji String
let emojiTestList = require ('emoji-test-list');
let emojis = Object.keys (emojiTestList).filter (emoji => emojiTestList[emoji].toFullyQualified);
$.writeln ("Display Emoji:", emojis.length);
$.writeln (emojis.join (''));
