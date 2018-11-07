//
const unit = document.getElementById ('unihan-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const tagSelect = unit.querySelector ('.find-by-tag-value .tag-select');
const tagCategoriesCheckbox = unit.querySelector ('.find-by-tag-value .categories-checkbox');
const tagSearchString = unit.querySelector ('.find-by-tag-value .search-string');
const tagWholeWord = unit.querySelector ('.find-by-tag-value .whole-word');
const tagUseRegex = unit.querySelector ('.find-by-tag-value .use-regex');
const tagSearchButton = unit.querySelector ('.find-by-tag-value .search-button');
const tagSearchInfo = unit.querySelector ('.find-by-tag-value .search-info');
const tagSearchData = unit.querySelector ('.find-by-tag-value .search-data');
const tagInstructions = unit.querySelector ('.find-by-tag-value .instructions');
//
// const rsInstructions = unit.querySelector ('.radical-strokes .instructions');
//
const tagParams = { };
const rsParams = { };
//
let tagCurrentTag;
//
let tagShowCategories;
//
module.exports.start = function (context)
{
    const dataTable = require ('./data-table.js');
    //
    const rewritePattern = require ('regexpu-core');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    unihanCount = Object.keys (unihanData.codePoints).length;
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        tagSelect: "",
        tagShowCategories: false,
        tagSearchString: "",
        tagWholeWord: false,
        tagUseRegex: false,
        tagPageSize: 8,
        tagInstructions: true,
        //
        // rsInstructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    tagCurrentTag = prefs.tagSelect;
    //
    tagShowCategories = prefs.tagShowCategories;
    //
    function updateTab (tabName)
    {
        let foundIndex = 0;
        tabs.forEach
        (
            (tab, index) =>
            {
                let match = (tab.parentElement.textContent === tabName);
                if (match)
                {
                    foundIndex = index;
                }
                else
                {
                    tab.checked = false;
                    tabPanes[index].hidden = true;
                    tabInfos[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
        tabInfos[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.target.parentElement.textContent); });
    }
    //
    function updateTagMenu ()
    {
        while (tagSelect.firstChild)
        {
            tagSelect.firstChild.remove ();
        }
        if (tagShowCategories)
        {
            for (let category of unihanData.categories)
            {
                let optionGroup = document.createElement ('optgroup');
                optionGroup.label = "◎\xA0" + category.name;
                for (let tag of category.tags)
                {
                    let option = document.createElement ('option');
                    option.textContent = tag;
                    optionGroup.appendChild (option);
                }
                tagSelect.appendChild (optionGroup);
            }
        }
        else
        {
            for (let tag in unihanData.tags)
            {
                let option = document.createElement ('option');
                // option.title = unihanData.tags[tag].name;
                option.textContent = tag;
                tagSelect.appendChild (option);
            }
        }
        //
        tagSelect.value = tagCurrentTag;
        if (tagSelect.selectedIndex < 0) // -1: no element is selected
        {
            tagSelect.selectedIndex = 0;
        }
        tagCurrentTag = tagSelect.value;
    }
    //
    tagCategoriesCheckbox.checked = tagShowCategories;
    tagCategoriesCheckbox.addEventListener
    (
        'input',
        event => 
        {
            tagShowCategories = event.target.checked;
            updateTagMenu ();
        }
    );
    //
    tagSelect.addEventListener ('input', event => { tagCurrentTag = event.target.value; });
    updateTagMenu ();
    //
    tagWholeWord.checked = prefs.tagWholeWord;
    tagUseRegex.checked = prefs.tagUseRegex;
    //
    tagSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                tagSearchButton.click ();
            }
        }
    );
    tagSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (tagUseRegex.checked)
            {
                try
                {
                    const flags = 'ui';
                    let pattern = event.target.value;
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                    let regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    event.target.title = e;
                }
            }
        }
    );
    tagSearchString.value = prefs.tagSearchString;
    tagSearchString.dispatchEvent (new Event ('input'));
    //
    tagUseRegex.addEventListener
    (
        'change',
        (event) => tagSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function findCharactersByTag (regex, tag)
    {
        let characterInfoList = [ ];
        let codePoints = unihanData.codePoints;
        for (let codePoint in codePoints)
        {
            if (tag in codePoints[codePoint])
            {
                let values = codePoints[codePoint][tag];
                if (!Array.isArray (values))
                {
                    values = [ values ];
                }
                let matchingValues = [ ];
                for (let value of values)
                {
                    if (value.match (regex))
                    {
                        matchingValues.push (value);
                    }
                }
                if (matchingValues.length > 0)
                {
                    characterInfoList.push
                    (
                        {
                            character: String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)),
                            codePoint: codePoint,
                            tag: tag,
                            value: ((matchingValues.length > 1) ? matchingValues : matchingValues[0])
                        }
                    );
                }
            }
        }
        return characterInfoList;
    }
    //
    tagSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            tagSearchInfo.textContent = "";
            while (tagSearchData.firstChild)
            {
                tagSearchData.firstChild.remove ();
            }
            setTimeout
            (
                () =>
                {
                    let searchString = tagSearchString.value;
                    if (searchString)
                    {
                        let regex = null;
                        try
                        {
                            function characterToEcmaScriptEscape (character)
                            {
                                let num = character.codePointAt (0);
                                let hex = num.toString (16).toUpperCase ();
                                return `\\u{${hex}}`;
                            }
                            //
                            let pattern = (tagUseRegex.checked) ? searchString : Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                            if (tagWholeWord.checked)
                            {
                                const beforeWordBoundary = '(?:^|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                                const afterWordBoundary = '(?:$|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                                pattern = `${beforeWordBoundary}(${pattern})${afterWordBoundary}`;
                            }
                            const flags = 'ui';
                            pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                            regex = new RegExp (pattern, flags);
                        }
                        catch (e)
                        {
                        }
                        if (regex)
                        {
                            let start = window.performance.now ();
                            let characterInfos = findCharactersByTag (regex, tagCurrentTag);
                            let stop = window.performance.now ();
                            let seconds = ((stop - start) / 1000).toFixed (2);
                            tagSearchInfo.innerHTML = `Unihan characters: <strong>${characterInfos.length}</strong>&nbsp;/&nbsp;${unihanCount} (${seconds}&nbsp;seconds)`;
                            if (characterInfos.length > 0)
                            {
                                tagSearchData.appendChild (dataTable.create (characterInfos, tagParams));
                            }
                        }
                    }
                }
            );
        }
    );
    //
    tagParams.pageSize = prefs.tagPageSize;
    tagParams.observer = null;
    //
    tagInstructions.open = prefs.tagInstructions;
    //
    // rsInstructions.open = prefs.rsInstructions;
}
//
module.exports.stop = function (context)
{
    function getCurrentTabName ()
    {
        let currentTabName = "";
        for (let tab of tabs)
        {
            if (tab.checked)
            {
                currentTabName = tab.parentElement.textContent;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        //
        tagSelect: tagCurrentTag,
        tagShowCategories: tagShowCategories,
        tagSearchString: tagSearchString.value,
        tagWholeWord: tagWholeWord.checked,
        tagUseRegex: tagUseRegex.checked,
        tagPageSize: tagParams.pageSize,
        tagInstructions: tagInstructions.open,
        //
        // rsInstructions: rsInstructions.open
    };
    context.setPrefs (prefs);
};
//
