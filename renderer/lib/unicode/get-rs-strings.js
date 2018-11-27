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
function fromRSValue (rsValue)
{
    let [ index, residual ] = rsValue.split ('.');
    return [ `${fromRadical (parseInt (index), index.match (/'$/))}`, `${residual}` ];
};
//
module.exports =
{
    fromRadical,
    fromRSValue
};
//