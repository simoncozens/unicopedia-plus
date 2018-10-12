//
const unit = document.getElementById ('unihan-references-unit');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        references: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    references.open = prefs.references;
    //
    const unihanLinks = require ('./unihan-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, unihanLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        references: references.open
    };
    context.setPrefs (prefs);
};
//
