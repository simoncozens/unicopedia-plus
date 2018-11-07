// Detect Unihan Self Variants
const variantProperties =
[
    "kSemanticVariant",
    "kSimplifiedVariant",
    "kSpecializedSemanticVariant",
    "kTraditionalVariant",
    "kZVariant"
];
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
let selfVariants = { };
for (let codePoint in codePoints)
{
    let properties = codePoints[codePoint];
    for (let property in properties)
    {
        if (variantProperties.includes (property))
        {
            let variants = properties[property];
            if (!Array.isArray (variants))
            {
                variants = [ variants ];
            }
            for (let variant of variants)
            {
                variant = variant.split ('<')[0];
                if (variant === codePoint)
                {
                    if (!(codePoint in selfVariants))
                    {
                        selfVariants[codePoint] = { };
                    }
                    selfVariants[codePoint][property] = properties[property];
                }
            }
        }
    }
}
return $.stringify (selfVariants, null, 4);
