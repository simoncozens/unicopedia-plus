//
const useRewritePattern = true;
//
let rewritePattern = require ('regexpu-core');
//
function characterToEcmaScriptEscape (character)
{
    return `\\u{${character.codePointAt (0).toString (16).toUpperCase ()}}`;
}
//
module.exports.build = function (pattern, options)
{
    if (!options)
    {
        options = { };
    }
    let flags = 'u';
    if (!options.caseSensitive)
    {
         flags += 'i';
    }
    if (!options.useRegex)
    {
         pattern = Array.from (pattern).map ((char) => characterToEcmaScriptEscape (char)).join ('');
    }
    if (options.wholeWord)
    {
        const beforeWordBoundary = '(?<![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        const afterWordBoundary = '(?![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        pattern = `${beforeWordBoundary}(?:${pattern})${afterWordBoundary}`;
    }
    if (useRewritePattern)
    {
        pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, lookbehind: true, useUnicodeFlag: true });
    }
    return new RegExp (pattern, flags);
};
//
