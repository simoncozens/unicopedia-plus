// Display CLDR Annotations
const annotations = require ('./lib/unicode/get-cldr-annotations.js') ("en.xml");
$.writeln ($.stringify (annotations, null, 4));
