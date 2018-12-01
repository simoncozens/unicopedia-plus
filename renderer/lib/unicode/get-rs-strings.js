//
const kangxiRadicals = require ('./kangxi-radicals.json');
//
function fromRadical (index, simplified)
{
    let kangxiRadical = kangxiRadicals[index - 1];
    let name;
    let radical;
    if (simplified)
    {
        for (let cjk of kangxiRadical.cjk)
        {
            if (cjk.simplified)
            {
                name = cjk.name;
                radical = cjk.radical;
                break;
            }
        }
    }
    else
    {
        radical = kangxiRadical.radical;
        name = kangxiRadical.name;
    }
    return `${index} ${radical} (${name})`;
};
//
function fromRSValue (rsValue, verbose)
{
    let result;
    let [ index, residual ] = rsValue.split ('.');
    if (verbose)
    {
        result =
        [
            `Radical ${fromRadical (parseInt (index), index.match (/'$/))}`,
            `${residual} Stroke${residual > 1 ? 's': ''}`
        ];
    }
    else
    {
        result = [ `${fromRadical (parseInt (index), index.match (/'$/))}`, `${residual}` ];
    }
    return result;
};
//
module.exports =
{
    fromRadical,
    fromRSValue
};
//
