//
const unit = document.getElementById ('unicode-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const nameSearchString = unit.querySelector ('.find-by-name .search-string');
const nameWholeWord = unit.querySelector ('.find-by-name .whole-word');
const nameUseRegex = unit.querySelector ('.find-by-name .use-regex');
const nameSearchButton = unit.querySelector ('.find-by-name .search-button');
const nameSearchInfo = unit.querySelector ('.find-by-name .search-info');
const nameSearchData = unit.querySelector ('.find-by-name .search-data');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const symbolSearchString = unit.querySelector ('.match-symbol .search-string');
const symbolCaseSensitive = unit.querySelector ('.match-symbol .case-sensitive');
const symbolUseRegex = unit.querySelector ('.match-symbol .use-regex');
const symbolSearchButton = unit.querySelector ('.match-symbol .search-button');
const symbolSearchInfo = unit.querySelector ('.match-symbol .search-info');
const symbolSearchData = unit.querySelector ('.match-symbol .search-data');
const symbolInstructions = unit.querySelector ('.match-symbol .instructions');
const symbolRegexExamples = unit.querySelector ('.match-symbol .regex-examples');
//
const nameParams = { };
const symbolParams = { };
//
module.exports.start = function (context)
{
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const dataTable = require ('./data-table.js');
    //
    const rewritePattern = require ('regexpu-core');
    //
    const defaultPrefs =
    {
        tabName: "",
        nameSearchString: "",
        nameWholeWord: false,
        nameUseRegex: false,
        namePageSize: 1024,
        nameInstructions: true,
        nameRegexExamples: false,
        symbolSearchString: "",
        symbolCaseSensitive: false,
        symbolUseRegex: false,
        symbolPageSize: 1024,
        symbolInstructions: true,
        symbolRegexExamples: false
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
    nameWholeWord.checked = prefs.nameWholeWord;
    nameUseRegex.checked = prefs.nameUseRegex;
    //
    nameSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                nameSearchButton.click ();
            }
        }
    );
    nameSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (nameUseRegex.checked)
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
    nameSearchString.value = prefs.nameSearchString;
    nameSearchString.dispatchEvent (new Event ('input'));
    //
    nameUseRegex.addEventListener
    (
        'change',
        (event) => nameSearchString.dispatchEvent (new Event ('input'))
    );
    //
    nameSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            nameSearchInfo.textContent = "";
            while (nameSearchData.firstChild) { nameSearchData.firstChild.remove (); };
            setTimeout
            (
                () =>
                {
                    let searchString = nameSearchString.value;
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
                            let pattern = (nameUseRegex.checked) ? searchString : Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                            if (nameWholeWord.checked)
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
                            characters = unicode.findCharactersByData (regex, false);
                            let stop = window.performance.now ();
                            let seconds = ((stop - start) / 1000).toFixed (2);
                            nameSearchInfo.innerHTML = `Results: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                            if (characters.length > 0)
                            {
                                dataTable.create (nameSearchData, characters, nameParams);
                            }
                        }
                    }
                }
            );
        }
    );
    //
    nameParams.pageSize = prefs.namePageSize;
    //
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    symbolCaseSensitive.checked = prefs.symbolCaseSensitive;
    symbolUseRegex.checked = prefs.symbolUseRegex;
    //
    symbolSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                symbolSearchButton.click ();
            }
        }
    );
    symbolSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (symbolUseRegex.checked)
            {
                try
                {
                    const flags = symbolCaseSensitive.checked ? 'u' : 'ui';
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
    symbolSearchString.value = prefs.symbolSearchString;
    symbolSearchString.dispatchEvent (new Event ('input'));
    //
    symbolUseRegex.addEventListener
    (
        'change',
        (event) => symbolSearchString.dispatchEvent (new Event ('input'))
    );
    //
    symbolSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            symbolSearchInfo.textContent = "";
            while (symbolSearchData.firstChild) { symbolSearchData.firstChild.remove (); };
            setTimeout
            (
                () =>
                {
                    let searchString = symbolSearchString.value;
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
                            let pattern = (symbolUseRegex.checked) ? searchString : Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                            const flags = symbolCaseSensitive.checked ? 'u' : 'ui';
                            pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                            regex = new RegExp (pattern, flags);
                        }
                        catch (e)
                        {
                        }
                        if (regex)
                        {
                            let start = window.performance.now ();
                            characters = unicode.findCharactersByData (regex, true);
                            let stop = window.performance.now ();
                            let seconds = ((stop - start) / 1000).toFixed (2);
                            symbolSearchInfo.innerHTML = `Results: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                            if (characters.length > 0)
                            {
                                dataTable.create (symbolSearchData, characters, symbolParams);
                            }
                        }
                    }
                }
            );
        }
    );
    //
    symbolParams.pageSize = prefs.symbolPageSize;
    //
    symbolInstructions.open = prefs.symbolInstructions;
    symbolRegexExamples.open = prefs.symbolRegexExamples;
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
        nameSearchString: nameSearchString.value,
        nameWholeWord: nameWholeWord.checked,
        nameUseRegex: nameUseRegex.checked,
        namePageSize: nameParams.pageSize,
        nameInstructions: nameInstructions.open,
        nameRegexExamples: nameRegexExamples.open,
        symbolSearchString: symbolSearchString.value,
        symbolCaseSensitive: symbolCaseSensitive.checked,
        symbolUseRegex: symbolUseRegex.checked,
        symbolPageSize: symbolParams.pageSize,
        symbolInstructions: symbolInstructions.open,
        symbolRegexExamples: symbolRegexExamples.open
    };
    context.setPrefs (prefs);
};
//
