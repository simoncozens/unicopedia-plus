//
const unit = document.getElementById ('regex-properties-unit');
//
const container = unit.querySelector ('.container');
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        instructions: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let groups = require ('./groups.json');
    //
    const showOptional = false;
    //
    groups.forEach
    (
        group =>
        {
            let category = document.createElement ('h2');
            category.textContent = group.category;
            container.appendChild (category);
            let propertyList = document.createElement ('table');
            propertyList.className = 'property-list';
            let header = document.createElement ('tr');
            let canonicHeader = document.createElement ('th');
            canonicHeader.className = 'canonic';
            canonicHeader.textContent = "Canonical";
            header.appendChild (canonicHeader);
            let aliasHeader = document.createElement ('th');
            aliasHeader.className = 'alias';
            aliasHeader.textContent = "Alias";
            header.appendChild (aliasHeader);
            propertyList.appendChild (header);
            group.items.forEach
            (
                item =>
                {
                    let row = document.createElement ('tr');
                    if ("canonic" in item)
                    {
                        let canonic = document.createElement ('td');
                        canonic.className = 'canonic';
                        let canonics = [ ];
                        if (group.canonic && ((!group.optional) || showOptional))
                        {
                            canonics.push (`\\p{${group.canonic}=${item.canonic}}`);
                        }
                        else
                        {
                            canonics.push (`\\p{${item.canonic}}`);
                        }
                        canonic.innerHTML = canonics.join ('<br>');
                        row.appendChild (canonic);
                    }
                    if ("alias" in item)
                    {
                        let alias = document.createElement ('td');
                        alias.className = 'alias';
                        if (item.alias)
                        {
                            let aliases = [ ];
                            alias.textContent = `\\p{${item.alias || item.canonic}}`;
                            if (group.alias && ((!group.optional) || showOptional))
                            {
                                aliases.push (`\\p{${group.alias}=${item.alias}}`);
                            }
                            else
                            {
                                aliases.push (`\\p{${item.alias}}`);
                            }
                            alias.innerHTML = aliases.join ('<br>');
                        }
                        row.appendChild (alias);
                    }
                    propertyList.appendChild (row);
                }
            );
            container.appendChild (propertyList);
            let footer = document.createElement ('tr');
            let canonicFooter = document.createElement ('th');
            canonicFooter.className = 'canonic';
            canonicFooter.textContent = "Canonical";
            footer.appendChild (canonicFooter);
            let aliasFooter = document.createElement ('th');
            aliasFooter.className = 'alias';
            aliasFooter.textContent = "Alias";
            footer.appendChild (aliasFooter);
            propertyList.appendChild (footer);
        }
    );
    //
    instructions.open = prefs.instructions;
    //
    references.open = prefs.references;
    //
    const emojiLinks = require ('./regex-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, emojiLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
