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
         pattern = Array.from (pattern, (char) => `\\u{${char.codePointAt (0).toString (16)}}`).join ('');
    }
    if (options.wholeWord)
    {
        const beforeWordBoundary = '(?<![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        const afterWordBoundary = '(?![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        pattern = `${beforeWordBoundary}(?:${pattern})${afterWordBoundary}`;
    }
    return new RegExp (pattern, flags);
};
//
