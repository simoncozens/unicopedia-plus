// Get Component Emoji String
let emojiTestList = require ('emoji-test-list');
let emojis = Object.keys (emojiTestList).filter (emoji => emojiTestList[emoji].isComponent);
$.writeln ("Component Emoji:", emojis.length);
$.writeln (emojis.join (""));
