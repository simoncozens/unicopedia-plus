//
const unit = document.getElementById ('regex-properties-unit');
//
const categorySelect = unit.querySelector ('.category-select');
const negatedCheckbox = unit.querySelector ('.negated-checkbox');
const optionalPrefixCheckbox = unit.querySelector ('.optional-prefix-checkbox');
const container = unit.querySelector ('.container');
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        categorySelect: "",
        negatedCheckbox: false,
        optionalPrefixCheckbox: false,
        instructions: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let groups = require ('./groups.json');
    //
    for (let group of groups)
    {
        let option = document.createElement ('option');
        option.textContent = group.category;
        categorySelect.appendChild (option);
    }
    //
    function updateTable ()
    {
        while (container.firstChild)
        {
            container.firstChild.remove ();
        }
        for (let group of groups)
        {
            if (group.category === categorySelect.value)
            {
                let property = negatedCheckbox.checked ? "\\P": "\\p";
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
                            if (group.canonic && ((!group.optional) || optionalPrefixCheckbox.checked))
                            {
                                canonics.push (`${property}{${group.canonic}=${item.canonic}}`);
                            }
                            else
                            {
                                canonics.push (`${property}{${item.canonic}}`);
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
                                if (group.alias && ((!group.optional) || optionalPrefixCheckbox.checked))
                                {
                                    if (Array.isArray (item.alias))
                                    {
                                        item.alias.forEach
                                        (
                                            element =>
                                            {
                                                 aliases.push (`${property}{${group.alias}=${element}}`);
                                            }
                                        );
                                    }
                                    else
                                    {
                                        aliases.push (`${property}{${group.alias}=${item.alias}}`);
                                    }
                                }
                                else
                                {
                                    if (Array.isArray (item.alias))
                                    {
                                        item.alias.forEach
                                        (
                                            element =>
                                            {
                                                aliases.push (`${property}{${element}}`);
                                            }
                                        );
                                    }
                                    else
                                    {
                                        aliases.push (`${property}{${item.alias}}`);
                                    }
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
                break;
            }
        }
    }
    //
    categorySelect.value = prefs.categorySelect;
    if (categorySelect.selectedIndex < 0) // -1: no element is selected
    {
        categorySelect.selectedIndex = 0;
    }
    //
    categorySelect.addEventListener ('input', (event) => updateTable ());
    //
    negatedCheckbox.checked = prefs.negatedCheckbox;
    negatedCheckbox.addEventListener ('input', (event) => updateTable ());
    //
    optionalPrefixCheckbox.checked = prefs.optionalPrefixCheckbox;
    optionalPrefixCheckbox.addEventListener ('input', (event) => updateTable ());
    //
    updateTable ();
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
        categorySelect: categorySelect.value,
        negatedCheckbox: negatedCheckbox.checked,
        optionalPrefixCheckbox: optionalPrefixCheckbox.checked,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
