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
const tagRegexExamples = unit.querySelector ('.find-by-tag-value .regex-examples');
//
const tagParams = { };
//
let tagCurrentTag;
let tagShowCategories;
//
const rsExtraSourcesCheckbox = unit.querySelector ('.radical-strokes .extra-sources-checkbox');
const rsFullSetCheckbox = unit.querySelector ('.radical-strokes .full-set-checkbox');
const rsAllStrokesCheckbox = unit.querySelector ('.radical-strokes .all-strokes-checkbox');
const rsRadicalSelect = unit.querySelector ('.radical-strokes .radical-select');
const rsStrokesSelect = unit.querySelector ('.radical-strokes .strokes-select');
const rsSearchButton = unit.querySelector ('.radical-strokes .search-button');
const rsSearchInfo = unit.querySelector ('.radical-strokes .search-info');
const rsSearchData = unit.querySelector ('.radical-strokes .search-data');
const rsInstructions = unit.querySelector ('.radical-strokes .instructions');
const rsRadicalList = unit.querySelector ('.radical-strokes .radical-list');
const rsRadicals = unit.querySelector ('.radical-strokes .radicals');
//
const rsParams = { };
//
let rsCurrentRadical;
let rsCurrentStrokes;
//
module.exports.start = function (context)
{
    const rewritePattern = require ('regexpu-core');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    unihanCount = unihanData.fullSet.length;
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
        tagRegexExamples: false,
        //
        rsExtraSourcesCheckbox: false,
        rsFullSetCheckbox: false,
        rsAllStrokesCheckbox: false,
        rsRadicalSelect: "",
        rsStrokesSelect: "",
        rsInstructions: true,
        rsRadicalList: false
    };
    let prefs = context.getPrefs (defaultPrefs);
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
    tagCurrentTag = prefs.tagSelect;
    tagShowCategories = prefs.tagShowCategories;
    //
    const tagDataTable = require ('./tag-data-table.js');
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
            let sortedTags = Object.keys (unihanData.tags).sort ((a, b) => a.localeCompare (b));
            for (let tag of sortedTags)
            {
                let option = document.createElement ('option');
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
        for (let codePoint of unihanData.fullSet)
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
                        tagSearchData.appendChild (tagDataTable.create (characterInfos, tagParams));
                    }
                }
            }
        }
    );
    //
    tagParams.pageSize = prefs.tagPageSize;
    tagParams.observer = null;
    tagParams.root = unit;
    //
    tagInstructions.open = prefs.tagInstructions;
    tagRegexExamples.open = prefs.tagRegexExamples;
    //
    const rsDataTable = require ('./rs-data-table.js');
    //
    // rsExtraSourcesCheckbox.checked = prefs.rsExtraSourcesCheckbox;
    rsExtraSourcesCheckbox.checked = defaultPrefs.rsExtraSourcesCheckbox;   // TEMP!
    //
    rsFullSetCheckbox.checked = prefs.rsFullSetCheckbox;
    //
    rsAllStrokesCheckbox.addEventListener
    (
        'input',
        event =>
        {
            rsStrokesSelect.disabled = event.target.checked;
            if (event.target.checked)
            {
                rsStrokesSelect.classList.add ('disabled');
                rsStrokesSelect.parentElement.classList.add ('disabled');
            }
            else
            {
                rsStrokesSelect.classList.remove ('disabled');
                rsStrokesSelect.parentElement.classList.remove ('disabled');
            }
        }
    );
    //
    // rsAllStrokesCheckbox.checked = prefs.rsAllStrokesCheckbox;
    rsAllStrokesCheckbox.checked = defaultPrefs.rsAllStrokesCheckbox;   // TEMP!
    rsAllStrokesCheckbox.dispatchEvent (new Event ('input'));
    //
    rsCurrentRadical = prefs.rsRadicalSelect;
    rsCurrentStrokes = prefs.rsStrokesSelect;
    //
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    //
    let lastStrokes = 0;
    let optionGroup = null;
    for (let radical of kangxiRadicals)
    {
        if (lastStrokes !== radical.strokes)
        {
            if (optionGroup)
            {
                rsRadicalSelect.appendChild (optionGroup);
            }
            optionGroup = document.createElement ('optgroup');
            optionGroup.label = `${radical.strokes} Stroke${radical.strokes > 1 ? 's': ''}`;
            lastStrokes = radical.strokes;
        }
        let option = document.createElement ('option');
        option.textContent = `${radical.index}\u2002${radical.radical}\u2002(${radical.name})`;
        option.value = radical.index;
        optionGroup.appendChild (option);
    }
    rsRadicalSelect.appendChild (optionGroup);
    //
    rsRadicalSelect.value = rsCurrentRadical;
    if (rsRadicalSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsRadicalSelect.selectedIndex = 0;
    }
    rsCurrentRadical = rsRadicalSelect.value;
    //
    rsRadicalSelect.addEventListener ('input', event => { rsCurrentRadical = event.target.value; });
    //
    const minStrokes = 0;
    const maxStrokes = 50;
    //
    for (let strokesIndex = minStrokes; strokesIndex <= maxStrokes; strokesIndex++)
    {
        let option = document.createElement ('option');
        option.textContent = strokesIndex;
        rsStrokesSelect.appendChild (option);
    }
    //
    rsStrokesSelect.value = rsCurrentStrokes;
    if (rsStrokesSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsStrokesSelect.selectedIndex = 0;
    }
    rsCurrentStrokes = rsStrokesSelect.value;
    //
    rsStrokesSelect.addEventListener ('input', event => { rsCurrentStrokes = event.target.value; });
    //
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    function findCharactersByRadicalStrokes (options)
    {
        function matchRadicalStrokes (tags, radical, strokes)
        {
            let found = false;
            let extraSource = false;
            let irgSourceValues = [ ];
            //
            const rsTags =
            [
                "kRSUnicode",   // Must be first
                "kRSKangXi",
                "kRSJapanese",
                "kRSKanWa",
                "kRSKorean",
                "kRSAdobe_Japan1_6"
            ];
            for (let rsTag of rsTags)
            {
                let rsTagValues = tags[rsTag];
                if (rsTagValues)
                {
                    if (!Array.isArray (rsTagValues))
                    {
                        rsTagValues = [ rsTagValues ];
                    }
                    if (rsTag == "kRSUnicode")
                    {
                        irgSourceValues = [...rsTagValues];
                    }
                    for (let rsTagValue of rsTagValues)
                    {
                        let rsValue;
                        if (rsTag === "kRSAdobe_Japan1_6")
                        {
                            let parsed = rsTagValue.match (/^([CV])\+[0-9]{1,5}\+([1-9][0-9]{0,2}\.[1-9][0-9]?\.[0-9]{1,2})$/);
                            if (parsed[1] === 'C')
                            {
                                let [ index, strokes, residual ] = parsed[2].split ('.');
                                {
                                    rsValue = [ index, residual ].join ('.');
                                }
                            }
                        }
                        else
                        {
                            rsValue = rsTagValue;
                        }
                        if (rsValue)
                        {
                            let [ tagRadical, tagResidual ] = rsValue.split ('.');
                            if ((parseInt (tagRadical) === radical) && (Math.max (parseInt (tagResidual), 0) === strokes))
                            {
                                found = true;
                                extraSource = (rsTag !== "kRSUnicode");
                                break;
                            }
                        }
                    }
                    if (found) break;
                }
            }
            //
            return [ found, extraSource, irgSourceValues ];
        }
        // 
        let items = [ ];
        for (let strokes = options.minStrokes; strokes <= options.maxStrokes; strokes++)
        {
            let item = { };
            item.strokes = strokes;
            item.characters = [ ];
            let codePoints = unihanData.codePoints;
            let set = options.fullSet ? unihanData.fullSet : unihanData.coreSet;
            for (let codePoint of set)
            {
                let [ found, extraSource, irgSourceValues ] = matchRadicalStrokes (codePoints[codePoint], options.radical, strokes);
                if (found && ((!extraSource) || options.extraSources))
                {
                    let character =
                    {
                        symbol: String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)),
                        codePoint: codePoint
                    };
                    if (extraSource)
                    {
                        character.extraSource = extraSource;
                        character.toolTip = irgSourceValues.map (rsValue => fromRSValue (rsValue).join (" +\xA0")).join ("\n");
                    }
                    item.characters.push (character);
                }
            }
            if (item.characters.length > 0)
            {
                items.push (item);
            }
        }
        return items;
    }
    //
    rsSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            rsSearchInfo.textContent = "";
            while (rsSearchData.firstChild)
            {
                rsSearchData.firstChild.remove ();
            }
            let findOptions =
            {
                extraSources: rsExtraSourcesCheckbox.checked,
                fullSet: rsFullSetCheckbox.checked,
                radical: parseInt (rsCurrentRadical),
                minStrokes: rsAllStrokesCheckbox.checked ? minStrokes : parseInt (rsCurrentStrokes),
                maxStrokes: rsAllStrokesCheckbox.checked ? maxStrokes : parseInt (rsCurrentStrokes)
            };
            let start = window.performance.now ();
            let items = findCharactersByRadicalStrokes (findOptions);
            let stop = window.performance.now ();
            let seconds = ((stop - start) / 1000).toFixed (2);
            let resultCount = 0;
            for (let item of items)
            {
                resultCount += item.characters.length;
            };
            rsSearchInfo.innerHTML = `Unihan characters: <strong>${resultCount}</strong>&nbsp;/&nbsp;${unihanCount} (${seconds}&nbsp;seconds)`;
            if (resultCount > 0)
            {
                let title = "Radical\u2002" + rsRadicalSelect[rsRadicalSelect.selectedIndex].textContent;
                rsSearchData.appendChild (rsDataTable.create (title, items, rsParams));
            }
        }
    );
    //
    rsParams.observer = null;
    rsParams.root = unit;
    //
    rsInstructions.open = prefs.rsInstructions;
    rsRadicalList.open = prefs.rsRadicalList;
    //
    let radicalsTable = require ('./radicals-table.js');
    //
    rsRadicals.appendChild (radicalsTable.create (kangxiRadicals));
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
        tagRegexExamples: tagRegexExamples.open,
        //
        rsExtraSourcesCheckbox: rsExtraSourcesCheckbox.checked,
        rsFullSetCheckbox: rsFullSetCheckbox.checked,
        rsAllStrokesCheckbox: rsAllStrokesCheckbox.checked,
        rsRadicalSelect: rsCurrentRadical,
        rsStrokesSelect: rsCurrentStrokes,
        rsInstructions: rsInstructions.open,
        rsRadicalList: rsRadicalList.open
    };
    context.setPrefs (prefs);
};
//
