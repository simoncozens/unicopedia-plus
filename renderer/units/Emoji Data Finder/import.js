//
const unit = document.getElementById ('emoji-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const nameSearchString = unit.querySelector ('.find-by-name .search-string');
const nameWholeWord = unit.querySelector ('.find-by-name .whole-word');
const nameUseRegex = unit.querySelector ('.find-by-name .use-regex');
const nameSearchButton = unit.querySelector ('.find-by-name .search-button');
const nameHitCount = unit.querySelector ('.find-by-name .hit-count');
const nameEmojiDataList = unit.querySelector ('.find-by-name .emoji-data-list');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const symbolSearchString = unit.querySelector ('.match-symbol .search-string');
const symbolWholeWord = unit.querySelector ('.match-symbol .whole-word');
const symbolUseRegex = unit.querySelector ('.match-symbol .use-regex');
const symbolSearchButton = unit.querySelector ('.match-symbol .search-button');
const symbolHitCount = unit.querySelector ('.match-symbol .hit-count');
const symbolEmojiDataList = unit.querySelector ('.match-symbol .emoji-data-list');
const symbolInstructions = unit.querySelector ('.match-symbol .instructions');
const symbolRegexExamples = unit.querySelector ('.match-symbol .regex-examples');
//
const textClearButton = unit.querySelector ('.filter-text .clear-button');
const textEmojiSamples = unit.querySelector ('.filter-text .emoji-samples');
const textFilterButton = unit.querySelector ('.filter-text .filter-button');
const textInputString = unit.querySelector ('.filter-text .input-string');
const textHitCount = unit.querySelector ('.filter-text .hit-count');
const textEmojiDataList = unit.querySelector ('.filter-text .emoji-data-list');
const textInstructions = unit.querySelector ('.filter-text .instructions');
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const rewritePattern = require ('regexpu-core');
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        nameSearchString: "",
        nameWholeWord: false,
        nameUseRegex: false,
        nameInstructions: true,
        nameRegexExamples: false,
        //
        symbolSearchString: "",
        symbolWholeWord: false,
        symbolUseRegex: false,
        symbolInstructions: true,
        symbolRegexExamples: false,
        //
        textInputString: "",
        textInstructions: true
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
    const emojiList = require ('emoji-test-list');
    const emojiKeys = Object.keys (emojiList).sort ().reverse ();
    //
    const cldrAnnotations = require ('../../lib/unicode/get-cldr-annotations.js') ("en.xml");
    //
    function getEmojiCodePoints (emoji)
    {
        return emojiList[emoji].code.split (" ").map (source => { return `U+${source}`; }).join (" ");
    }
    //
    function getEmojiShortName (emoji)
    {
        return cldrAnnotations[emoji.replace (/\uFE0F/g, "")].shortName;
    }
    //
    function getEmojiKeywords (emoji)
    {
        return cldrAnnotations[emoji.replace (/\uFE0F/g, "")].keywords;
    }
    //
    function findEmojiByName (regex)
    {
        let emojiByName = [ ];
        for (let emoji in emojiList)
        {
            if (getEmojiShortName (emoji).match (regex))
            {
                emojiByName.push (emoji);
            }
            else
            {
                for (let keyword of getEmojiKeywords (emoji))
                {
                    if (keyword.match (regex))
                    {
                        emojiByName.push (emoji);
                        break;
                    }
                }
            }
        }
        return emojiByName;
    }
    //
    function findEmojiBySymbol (regex)
    {
        let emojiBySymbol = [ ];
        for (let emoji in emojiList)
        {
            if (regex.test (emoji))
            {
                emojiBySymbol.push (emoji);
            }
        }
        return emojiBySymbol;
    }
    //
    const emojiPattern = require ('emoji-test-patterns')["Emoji_Test_All"];
    const emojiRegex = new RegExp (emojiPattern, 'gu');
    //
    function getEmojiList (string)
    {
        return string.match (emojiRegex) || [ ];
    }
     //
    function clearDataList (emojiDataList, hitCount)
    {
        hitCount.textContent = "";
        while (emojiDataList.firstChild)
        {
            emojiDataList.firstChild.remove ();
        }
    }
   //
    function displayDataList (string, emojiDataList, hitCount)
    {
        while (emojiDataList.firstChild)
        {
           emojiDataList.firstChild.remove ();
        }
        let characters = [...new Set (getEmojiList (string))];
        hitCount.innerHTML = `<strong>${characters.length}</strong>&nbsp;/&nbsp;${emojiKeys.length}`;
        for (let character of characters)
        {
            let emojiTable = document.createElement ('table');
            emojiTable.className = 'emoji-table';
            let firstRow = document.createElement ('tr');
            let emojiData = document.createElement ('td');
            emojiData.className = 'emoji-data';
            emojiData.rowSpan = 2;
            let emoji = document.createElement ('div');
            emoji.className = 'emoji';
            emoji.textContent = character;
            emojiData.appendChild (emoji);
            firstRow.appendChild (emojiData);
            let namesData = document.createElement ('td');
            namesData.className = 'names-data';
            let shortName = document.createElement ('div');
            shortName.className = 'short-name';
            shortName.textContent = getEmojiShortName (character);
            namesData.appendChild (shortName);
            let keywords = document.createElement ('div');
            keywords.className = 'keywords';
            keywords.textContent = getEmojiKeywords (character).join (", ");
            namesData.appendChild (keywords);
            emojiTable.appendChild (firstRow);
            firstRow.appendChild (namesData);
            let secondRow = document.createElement ('tr');
            let codesData = document.createElement ('td');
            codesData.className = 'codes-data';
            let codes = document.createElement ('div');
            codes.className = 'codes';
            let code = getEmojiCodePoints (character);
            codes.textContent = code;
            codesData.appendChild (codes);
            let toolTip = "STATUS: " + (emojiList[character].toFullyQualified ? "DISPLAY/PROCESS": "KEYBOARD/PALETTE");
            emojiTable.title = toolTip;
            if (emojiList[character].toFullyQualified)
            {
                emoji.classList.add ('non-fully-qualified');
                shortName.classList.add ('non-fully-qualified');
                keywords.classList.add ('non-fully-qualified');
                codes.classList.add ('non-fully-qualified');
            }
            secondRow.appendChild (codesData);
            emojiTable.appendChild (secondRow);
            emojiDataList.appendChild (emojiTable);
        }
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
                event.preventDefault ();    // ??
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
            clearDataList (nameEmojiDataList, nameHitCount);
            let name = nameSearchString.value;
            if (name)
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
                    let pattern = (nameUseRegex.checked) ? name : Array.from (name).map ((char) => characterToEcmaScriptEscape (char)).join ('');
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
                    let emojiByName = findEmojiByName (regex);
                    displayDataList (emojiByName.join (''), nameEmojiDataList, nameHitCount);
                }
            }
        }
    );
    //
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    symbolWholeWord.checked = prefs.symbolWholeWord;
    symbolUseRegex.checked = prefs.symbolUseRegex;
    //
    symbolSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault ();    // ??
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
            clearDataList (symbolEmojiDataList, symbolHitCount);
            let symbol = symbolSearchString.value;
            if (symbol)
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
                    let pattern = (symbolUseRegex.checked) ? symbol : Array.from (symbol).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                    if (symbolWholeWord.checked)
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
                    let emojiBySymbol = findEmojiBySymbol (regex);
                    displayDataList (emojiBySymbol.join (''), symbolEmojiDataList, symbolHitCount);
                }
            }
        }
    );
    //
    symbolInstructions.open = prefs.symbolInstructions;
    symbolRegexExamples.open = prefs.symbolRegexExamples;
    //
    textClearButton.addEventListener
    (
        'click',
        (event) =>
        {
            textInputString.value = "";
            textInputString.dispatchEvent (new Event ('input'));
            textInputString.focus ();
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let emojiMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            textInputString.value = sample.string;
            textInputString.dispatchEvent (new Event ('input'));
        }
    );
    //
    textEmojiSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), emojiMenu);
        }
    );
    //
    textFilterButton.addEventListener
    (
        'click',
        (event) =>
        {
            textInputString.value = getEmojiList (textInputString.value).join ("");
            textInputString.dispatchEvent (new Event ('input'));
        }
    );
    //
    textInputString.addEventListener
    (
        'input',
        (event) =>
        {
            displayDataList (event.target.value, textEmojiDataList, textHitCount);
        }
    );
    textInputString.value = prefs.textInputString;
    textInputString.dispatchEvent (new Event ('input'));
    //
    textInstructions.open = prefs.textInstructions;
};
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
        nameSearchString: nameSearchString.value,
        nameWholeWord: nameWholeWord.checked,
        nameUseRegex: nameUseRegex.checked,
        nameInstructions: nameInstructions.open,
        nameRegexExamples: nameRegexExamples.open,
        //
        symbolSearchString: symbolSearchString.value,
        symbolWholeWord: symbolWholeWord.checked,
        symbolUseRegex: symbolUseRegex.checked,
        symbolInstructions: symbolInstructions.open,
        symbolRegexExamples: symbolRegexExamples.open,
        //
        textInputString: textInputString.value,
        textInstructions: textInstructions.open
    };
    context.setPrefs (prefs);
};
//
