//
const unit = document.getElementById ('emoji-data-finder-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const emojiSamples = unit.querySelector ('.emoji-samples');
const searchString = unit.querySelector ('.search-string');
const wholeWord = unit.querySelector ('.whole-word');
const useRegex = unit.querySelector ('.use-regex');
const searchButton = unit.querySelector ('.search-button');
const inputString = unit.querySelector ('.input-string');
const hitCount = unit.querySelector ('.hit-count');
const filterButton = unit.querySelector ('.filter-button');
const emojiDataList = unit.querySelector ('.emoji-data-list');
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const useES6Regex = true;
    //
    const rewritePattern = require ('regexpu-core');
    //
    const defaultPrefs =
    {
        searchString: "",
        wholeWord: false,
        useRegex: false,
        inputString: ""
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const cldrAnnotations = require ('../../lib/unicode/get-cldr-annotations.js') ("en.xml");
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
    const emojiList = require ('emoji-test-list');
    const emojiKeys = Object.keys (emojiList).sort ().reverse ();
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
    const emojiPattern = require ('emoji-test-patterns')["Emoji_Test_All"];
    const emojiRegex = new RegExp (emojiPattern, 'gu');
    //
    function getEmojiDataList (string)
    {
        return [...new Set (string.match (emojiRegex))];
    }
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.value = "";
            inputString.dispatchEvent (new Event ('input'));
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
            inputString.value = sample.string;
            inputString.dispatchEvent (new Event ('input'));
        }
    );
    //
    emojiSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), emojiMenu);
        }
    );
    //
    wholeWord.checked = prefs.wholeWord;
    useRegex.checked = prefs.useRegex;
    //
    searchString.placeholder = "Name or keyword...";
    searchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault ();    // ??
                searchButton.click ();
            }
        }
    );
    searchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (useRegex.checked)
            {
                try
                {
                    const flags = 'ui';
                    let pattern = event.target.value;
                    if (useES6Regex)
                    {
                        pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                    }
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
    searchString.value = prefs.searchString;
    searchString.dispatchEvent (new Event ('input'));
    //
    useRegex.addEventListener
    (
        'change',
        (event) => searchString.dispatchEvent (new Event ('input'))
    );
    //
    searchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearButton.click ();
            setTimeout
            (
                () =>
                {
                    let name = searchString.value;
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
                            let pattern = (useRegex.checked) ? name : Array.from (name).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                            if (wholeWord.checked)
                            {
                                const beforeWordBoundary =
                                (useES6Regex) ?
                                    '(?:^|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])' :
                                    '(?:^|[^\\w])';
                                const afterWordBoundary =
                                (useES6Regex) ?
                                    '(?:$|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])' :
                                    '(?:$|[^\\w])';
                                pattern = `${beforeWordBoundary}(${pattern})${afterWordBoundary}`;
                            }
                            const flags = 'ui';
                            if (useES6Regex)
                            {
                                pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                            }
                            regex = new RegExp (pattern, flags);
                        }
                        catch (e)
                        {
                        }
                        if (regex)
                        {
                            let emojiByName = findEmojiByName (regex);
                            inputString.value = emojiByName.join ('');
                            inputString.dispatchEvent (new Event ('input'));
                        }
                    }
                }
            );
        }
    );
    //
    filterButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.value = getEmojiDataList (inputString.value).join ("");
            // inputString.dispatchEvent (new Event ('input'));
        }
    );
    //
    function displayDataList (string)
    {
        while (emojiDataList.firstChild)
        {
           emojiDataList.firstChild.remove ();
        }
        let characters = getEmojiDataList (string);
        hitCount.textContent = `${characters.length}\xA0/\xA0${emojiKeys.length}`;
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
            let code = emojiList[character].code.split (" ").map (source => { return `U+${source}`; }).join (" ");
            // let code = emojiList[character].code;
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
    inputString.addEventListener
    (
        'input',
        (event) =>
        {
            displayDataList (event.target.value);
        }
    );
    inputString.value = prefs.inputString;
    inputString.dispatchEvent (new Event ('input'));
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        searchString: searchString.value,
        wholeWord: wholeWord.checked,
        useRegex: useRegex.checked,
        inputString: inputString.value
    };
    context.setPrefs (prefs);
};
//
