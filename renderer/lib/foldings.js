//
module.exports.toCase = function (string, folding, locale)
{
    let result = string;
    if (folding === 'uppercase')
    {
        if (typeof locale === 'undefined')
        {
            result = string.toUpperCase ();
        }
        else
        {
            result = string.toLocaleUpperCase (locale || undefined);
        }
    }
    else if (folding === 'lowercase')
    {
        if (typeof locale === 'undefined')
        {
            result = string.toLowerCase ();
        }
        else
        {
            result = string.toLocaleLowerCase (locale || undefined);
        }
    }
    return result;
}
//