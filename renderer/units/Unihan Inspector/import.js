//
const unit = document.getElementById ('unihan-inspector-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
const randomButton = unit.querySelector ('.random-button');
const fullSetCheckbox = unit.querySelector ('.full-set-checkbox');
const infoContainer = unit.querySelector ('.info-container');
//
const instructions = unit.querySelector ('.instructions');
//
let currentTypefaceLanguage;
let currentTypefaceDefault;
//
const unihanHistorySize = 256;   // 0: unlimited
//
let unihanHistory = [ ];
let unihanHistoryIndex = -1;
let unihanHistorySave = null;
//
let currentUnihanCharacter;
//
let showCategories;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const regexUnicode = require ('../../lib/regex-unicode.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const numericValuesData = require ('../../lib/unicode/parsed-numeric-values-data.js');
    const compatibilityVariants = require ('../../lib/unicode/get-cjk-compatibility-variants.js');
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    // Unihan character
    let unihanRegex = regexUnicode.build ('(?=\\p{Script=Han})(?=\\p{Other_Letter})', { useRegex: true });
    //
    function randomElement (elements)
    {
        return elements [Math.floor (Math.random () * elements.length)];
    }
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        typefaceLanguage: "",
        typefaceDefault: false,
        fullSetCheckbox: false,
        showCategories: false,
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    fullSetCheckbox.checked = prefs.fullSetCheckbox;
    //
    showCategories = prefs.showCategories;
    //
    const languages =
    {
        "ja": { label: "JP", title: "Japanese typeface" },
        "ko":  { label: "KR", title: "Korean typeface" },
        "zh-Hans": { label: "SC", title: "Simplified Chinese typeface" },
        "zh-Hant": { label: "TC", title: "Traditional Chinese typeface" },
        "zh-HK": { label: "HK", title: "Hong Kong Chinese typeface" }
    };
    const languageKeys = Object.keys (languages);
    //
    currentTypefaceLanguage = prefs.typefaceLanguage;
    if (!languageKeys.includes (currentTypefaceLanguage))
    {
        currentTypefaceLanguage = languageKeys[0];
    }
    //
    currentTypefaceDefault = prefs.typefaceDefault;
    //
    function displayData (character)
    {
        function displayCharacterData (character, codePoint, tags)
        {
            let characterData = document.createElement ('div');
            characterData.className = 'character-data';
            //
            let unihanCard = document.createElement ('div');
            unihanCard.className = 'unihan-card';
            let unihanWrapper = document.createElement ('div');
            unihanWrapper.className = 'unihan-wrapper';
            let unihanCharacter = document.createElement ('div');
            unihanCharacter.textContent = character;
            unihanCharacter.className = 'unihan-character';
            unihanWrapper.appendChild (unihanCharacter);
            let indexOfUnihanCharacter = unihanHistory.indexOf (unihanCharacter.textContent);
            if (indexOfUnihanCharacter !== -1)
            {
                unihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            unihanHistory.unshift (unihanCharacter.textContent);
            if ((unihanHistorySize > 0) && (unihanHistory.length > unihanHistorySize))
            {
                unihanHistory.pop ();
            }
            unihanHistoryIndex = -1;
            unihanHistorySave = null;
            let filler = document.createElement ('div');
            filler.className = 'filler';
            unihanWrapper.appendChild (filler);
            let unihanCodePoint= document.createElement ('div');
            unihanCodePoint.textContent = codePoint;
            unihanCodePoint.className = 'unihan-code-point';
            unihanWrapper.appendChild (unihanCodePoint);
            unihanCard.appendChild (unihanWrapper);
            let typefaceWidget = document.createElement ('div');
            typefaceWidget.className = 'typeface-widget';
            let typefacePrevious = document.createElement ('span');
            typefacePrevious.className = 'typeface-previous';
            typefacePrevious.textContent = "◀";
            typefaceWidget.appendChild (typefacePrevious);
            let typefaceTag = document.createElement ('span');
            typefaceTag.className = 'typeface-tag';
            typefaceWidget.appendChild (typefaceTag);
            let typefaceNext = document.createElement ('span');
            typefaceNext.className = 'typeface-next';
            typefaceNext.textContent = "▶";
            typefaceWidget.appendChild (typefaceNext);
            unihanWrapper.appendChild (typefaceWidget);
            //
            function updateTypefaceWidget ()
            {
                if (currentTypefaceDefault)
                {
                    typefaceWidget.classList.add ('default');
                    unihanCharacter.lang = "";
                    typefaceTag.textContent = "--";
                    typefaceTag.title = "Default typeface";
                }
                else
                {
                    typefaceWidget.classList.remove ('default');
                    unihanCharacter.lang = currentTypefaceLanguage;
                    let currentLanguage = languages[currentTypefaceLanguage];
                    typefaceTag.textContent = currentLanguage.label;
                    typefaceTag.title = currentLanguage.title;
                }
            }
            updateTypefaceWidget ();
            //
            typefaceTag.addEventListener
            (
                'dblclick',
                 event =>
                {
                    event.preventDefault ();
                    currentTypefaceDefault = !currentTypefaceDefault;
                    updateTypefaceWidget ();
                }
            );
            //
            function updateTypeface (reverse)
            {
                let index = languageKeys.indexOf (unihanCharacter.lang);
                if (reverse)
                {
                    index--;
                    if (index < 0)
                    {
                        index = languageKeys.length - 1;
                    }
                }
                else
                {
                    index++;
                    if (index >= languageKeys.length)
                    {
                        index = 0;
                    }
                }
                currentTypefaceLanguage = languageKeys[index];
                unihanCharacter.lang = currentTypefaceLanguage;
                let currentLanguage = languages[currentTypefaceLanguage];
                typefaceTag.textContent = currentLanguage.label;
                typefaceTag.title = currentLanguage.title;
            }
            //
            typefacePrevious.addEventListener ('click', event => { updateTypeface (true); });
            typefaceNext.addEventListener ('click', event => { updateTypeface (false); });
            //
            let unicodeData = unicode.getCharacterData (unihanCharacter.textContent);
            let unicodeFields =
            [
                { name: "Name", value: unicodeData.name },
                { name: "Age", value: unicodeData.age, toolTip: unicodeData.ageDate },
                { name: "Plane", value: unicodeData.planeName, toolTip: unicodeData.planeRange },
                { name: "Block", value: unicodeData.blockName, toolTip: unicodeData.blockRange },
                { name: "Script", value: unicodeData.script },
                { name: "Script Extensions", value: unicodeData.scriptExtensions },
                { name: "General Category", value: unicodeData.category },
                { name: "Decomposition", value: unicodeData.decomposition },
                { name: "Extended Properties", value: unicodeData.extendedProperties },
                { name: "Equivalent Unified Ideograph", value: unicodeData.equivalentUnifiedIdeograph }
            ];
            //
            let unicodeInfo = document.createElement ('div');
            unicodeInfo.className = 'unicode-info';
            for (let unicodeField of unicodeFields)
            {
                if (unicodeField.value)
                {
                    let field = document.createElement ('div');
                    field.className = 'field';
                    if (unicodeField.toolTip)
                    {
                        field.title = unicodeField.toolTip;
                    }
                    let name = document.createElement ('span');
                    name.className = 'name';
                    name.textContent = unicodeField.name.replace (/ /g, "\xA0");
                    field.appendChild (name);
                    field.appendChild (document.createTextNode (": "));
                    let value = document.createElement ('span');
                    value.className = 'value';
                    value.textContent = Array.isArray (unicodeField.value) ? unicodeField.value.join (", ") : unicodeField.value;
                    field.appendChild (value);
                    unicodeInfo.appendChild (field);
                }
            }
            //
            let unihanInfo = document.createElement ('div');
            unihanInfo.className = 'unihan-info';
            if (tags)
            {
                let rsValues = [ ];
                let rsClasses = [ ];
                let rsIRGCount = 0;
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
                //
                for (let rsTag of rsTags)
                {
                    let rsTagValues = tags[rsTag];
                    if (rsTagValues)
                    {
                        if (!Array.isArray (rsTagValues))
                        {
                            rsTagValues = [ rsTagValues ];
                        }
                        if (rsTag === "kRSUnicode")
                        {
                            rsIRGCount = rsTagValues.length;
                        }
                        for (let rsTagValue of rsTagValues)
                        {
                            if (rsTag === "kRSAdobe_Japan1_6")
                            {
                                let parsed = rsTagValue.match (/^([CV])\+[0-9]{1,5}\+([1-9][0-9]{0,2}\.[1-9][0-9]?\.[0-9]{1,2})$/);
                                if (parsed[1] === "C")
                                {
                                    let [ index, strokes, residual ] = parsed[2].split (".");
                                    rsValues.push ([ index, residual ].join ("."));
                                }
                            }
                            else
                            {
                                rsValues.push (rsTagValue);
                            }
                        }
                    }
                }
                //
                // Remove duplicates
                rsValues = [...new Set (rsValues)];
                //
                rsClasses = rsValues.map ((rsValue, index) => (index < rsIRGCount) ? 'irg-source' : 'no-irg-source');
                //
                rsValues = rsValues.map (rsValue => fromRSValue (rsValue).join (" +\xA0"));
                //
                let definitionValue = tags["kDefinition"];
                let numericValue = numericValuesData[codePoint] || "";
                let compatibility = compatibilityVariants[character] || [ ];
                let yasuoka = yasuokaVariants[character] || [ ];
                yasuoka = yasuoka.filter (variant => unihanRegex.test (variant));
                let iiCoreSet = ("kIICore" in tags) ? "IICore" : "";
                let unihanFields =
                [
                    { name: "Radical/Strokes", value: rsValues, class: rsClasses },
                    { name: "Definition", value: definitionValue, class: 'line-clamp' },
                    { name: "Numeric Value", value: numericValue },
                    { name: "Compatibility Variants", value: compatibility.join (" ") },
                    { name: "Yasuoka Variants", value: yasuoka.join (" ") },
                    { name: "Set", value: iiCoreSet }
                ];
                //
                for (let unihanField of unihanFields)
                {
                    if (unihanField.value)
                    {
                        let field = document.createElement ('div');
                        field.className = 'field';
                        if (typeof unihanField.class === 'string')
                        {
                            field.classList.add (unihanField.class);
                        }
                        if (Array.isArray (unihanField.value))
                        {
                            let name = document.createElement ('span');
                            name.className = 'name';
                            name.textContent = unihanField.name.replace (/ /g, "\xA0");
                            field.appendChild (name);
                            field.appendChild (document.createTextNode (": "))
                            let value = document.createElement ('span');
                            value.className = 'value';
                            let list = document.createElement ('ul');
                            list.className = 'list';
                            unihanField.value.forEach
                            (
                                (element, index) =>
                                {
                                    let item = document.createElement ('li');
                                    item.className = 'item';
                                    if (Array.isArray (unihanField.class))
                                    {
                                        let itemClass = unihanField.class[index];
                                        if (itemClass)
                                        {
                                            item.classList.add (itemClass);
                                        }
                                    }
                                    item.textContent = element;
                                    list.appendChild (item);
                                }
                            );
                            value.appendChild (list);
                            field.appendChild (value);
                        }
                        else
                        {
                            let name = document.createElement ('span');
                            name.className = 'name';
                            name.textContent = unihanField.name.replace (/ /g, "\xA0");
                            field.appendChild (name);
                            field.appendChild (document.createTextNode (": "));
                            let value = document.createElement ('span');
                            value.className = 'value';
                            value.textContent = unihanField.value;
                            field.appendChild (value);
                        }
                        unihanInfo.appendChild (field);
                    }
                }
            }
            else
            {
                let invalidUnihan = document.createElement ('div');
                invalidUnihan.className = 'field invalid-unihan';
                // "Not a Unihan character"
                // "Not a valid Unihan character"
                // "No Unihan character information"
                invalidUnihan.textContent = "No Unihan information available";
                unihanInfo.appendChild (invalidUnihan);
            }
            //
            characterData.appendChild (unihanCard);
            characterData.appendChild (unicodeInfo);
            characterData.appendChild (unihanInfo);
            infoContainer.appendChild (characterData);
        }
        //
        function displayTags (tags)
        {
            function createTagsList (showCategories)
            {
                let tagsList = document.createElement ('table');
                tagsList.className = 'tags-list';
                let headerRow = document.createElement ('tr');
                headerRow.className = 'header-row';
                let tagHeader = document.createElement ('th');
                tagHeader.className = 'tag-header';
                tagHeader.textContent = "Unihan\xA0Tag"; // "Unihan\xA0Property"
                headerRow.appendChild (tagHeader);
                let valueHeader = document.createElement ('th');
                valueHeader.className = 'value-header';
                valueHeader.textContent = "Value";
                headerRow.appendChild (valueHeader);
                tagsList.appendChild (headerRow);
                if (showCategories)
                {
                    for (let category of unihanData.categories)
                    {
                        let categoryTags = category.tags.filter (tag => (tag in tags));
                        if (categoryTags.length > 0)
                        {
                            let categoryRow = document.createElement ('tr');
                            categoryRow.className = 'category-row';
                            let categoryName = document.createElement ('td');
                            categoryName.className = 'category-name';
                            categoryName.textContent = category.name;
                            categoryName.colSpan = 2;
                            categoryRow.appendChild (categoryName);
                            tagsList.appendChild (categoryRow);
                            for (let tag of categoryTags)
                            {
                                let value = tags[tag];
                                if (value)
                                {
                                    let tagRow = document.createElement ('tr');
                                    let tagCell = document.createElement ('td');
                                    tagCell.className = 'tag';
                                    if (unihanData.tags[tag])
                                    {
                                        tagCell.title = unihanData.tags[tag].name;
                                    }
                                    tagCell.textContent = tag;
                                    tagRow.appendChild (tagCell);
                                    let valueCell = document.createElement ('td');
                                    valueCell.className = 'value';
                                    if (Array.isArray (value))
                                    {
                                        let list = document.createElement ('ul');
                                        list.className = 'list';
                                        for (let element of value)
                                        {
                                            let item = document.createElement ('li');
                                            item.className = 'item';
                                            item.textContent = element;
                                            list.appendChild (item);
                                        }
                                        valueCell.appendChild (list);
                                    }
                                    else
                                    {
                                        valueCell.textContent = value;
                                    }
                                    tagRow.appendChild (valueCell);
                                    tagsList.appendChild (tagRow);
                                }
                            }
                        }
                    }
                }
                else
                {
                    let sortedKeys = Object.keys (tags).sort ((a, b) => a.localeCompare (b));
                    for (let tag of sortedKeys)
                    {
                        let tagRow = document.createElement ('tr');
                        let value = tags[tag];
                        let tagCell = document.createElement ('td');
                        tagCell.className = 'tag';
                        tagCell.textContent = tag;
                        tagRow.appendChild (tagCell);
                        let valueCell = document.createElement ('td');
                        valueCell.className = 'value';
                        if (Array.isArray (value))
                        {
                            let list = document.createElement ('ul');
                            list.className = 'list';
                            for (let element of value)
                            {
                                let item = document.createElement ('li');
                                item.className = 'item';
                                item.textContent = element;
                                list.appendChild (item);
                            }
                            valueCell.appendChild (list);
                        }
                        else
                        {
                            valueCell.textContent = value;
                        }
                        tagRow.appendChild (valueCell);
                        tagsList.appendChild (tagRow);
                    }
                }
                return tagsList;
            }
            //
            if (tags)
            {
                let tagsData = document.createElement ('div');
                tagsData.className = 'tags-data';
                //
                let interface = document.createElement ('div');
                interface.className = 'interface';
                let optionGroup = document.createElement ('span');
                optionGroup.className = 'option-group';
                let categoriesOption = document.createElement ('span');
                categoriesOption.className = 'option';
                let categoriesLabel = document.createElement ('label');
                let categoriesCheckbox = document.createElement ('input');
                categoriesCheckbox.className = "categories-checkbox";
                categoriesCheckbox.type = 'checkbox';
                categoriesCheckbox.checked = showCategories;
                categoriesCheckbox.addEventListener
                (
                    'input',
                    event =>
                    {
                        showCategories = event.currentTarget.checked;
                        while (tagsWrapper.firstChild)
                        {
                            tagsWrapper.firstChild.remove ();
                        }
                        tagsWrapper.appendChild (createTagsList (showCategories));
                    }
                );
                categoriesLabel.appendChild (categoriesCheckbox);
                let categoriesText = document.createTextNode ("\xA0Categories");
                categoriesLabel.appendChild (categoriesText);
                categoriesOption.appendChild (categoriesLabel);
                optionGroup.appendChild (categoriesOption);
                interface.appendChild (optionGroup);
                infoContainer.appendChild (interface);
                //
                let tagsWrapper = document.createElement ('div');
                tagsWrapper.appendChild (createTagsList (showCategories));
                tagsData.appendChild (tagsWrapper);
                //
                infoContainer.appendChild (tagsData);
            }
        }
        //
        while (infoContainer.firstChild)
        {
            infoContainer.firstChild.remove ();
        }
        currentUnihanCharacter = character;
        if (character)
        {
            let codePoint = unicode.characterToCodePoint (character);
            let tags = unihanData.codePoints[codePoint];
            displayCharacterData (character, codePoint, tags);
            displayTags (tags);
        }
    }
    //
    const characterOrCodePointRegex = /^\s*(?:(.)|(?:[Uu]\+)?([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    //
    function parseUnihanCharacter (inputString)
    {
        let character = "";
        let match = inputString.match (characterOrCodePointRegex);
        if (match)
        {
            if (match[1])
            {
                character = match[1];
            }
            else if (match[2])
            {
                character = String.fromCodePoint (parseInt (match[2], 16));
            }
            if (!unihanRegex.test (character))
            {
                character = "";
            }
        }
        return character;
    }
    // 
    unihanInput.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!parseUnihanCharacter (event.currentTarget.value))
                {
                    event.currentTarget.classList.add ('invalid');
                }
            }
        }
    );
    unihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                lookupButton.click ();
            }
        }
    );
    unihanInput.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (unihanHistoryIndex === -1)
                    {
                        unihanHistorySave = event.currentTarget.value;
                    }
                    unihanHistoryIndex++;
                    if (unihanHistoryIndex > (unihanHistory.length - 1))
                    {
                        unihanHistoryIndex = (unihanHistory.length - 1);
                    }
                    if (unihanHistoryIndex !== -1)
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    unihanHistoryIndex--;
                    if (unihanHistoryIndex < -1)
                    {
                        unihanHistoryIndex = -1;
                        unihanHistorySave = null;
                    }
                    if (unihanHistoryIndex === -1)
                    {
                        if (unihanHistorySave !== null)
                        {
                            event.currentTarget.value = unihanHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    function updateUnihanData (character)
    {
        unihanInput.value = "";
        unihanInput.dispatchEvent (new Event ('input'));
        displayData (character);
    }
    //
    lookupButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (unihanInput.value)
            {
                let character = parseUnihanCharacter (unihanInput.value);
                if (character)
                {
                    updateUnihanData (character);
                }
                else
                {
                    remote.shell.beep ();
                }
            }
            else
            {
                unihanHistoryIndex = -1;
                unihanHistorySave = null;
                updateUnihanData ("");
            }
        }
    );
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
    //
    randomButton.addEventListener
    (
        'click',
        (event) =>
        {
            let codePoint = randomElement (fullSetCheckbox.checked ? unihanData.fullSet : unihanData.coreSet);
            updateUnihanData (String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)));
        }
    );
    //
    instructions.open = prefs.instructions;
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        unihanHistory: unihanHistory,
        unihanCharacter: currentUnihanCharacter,
        typefaceLanguage: currentTypefaceLanguage,
        typefaceDefault: currentTypefaceDefault,
        fullSetCheckbox: fullSetCheckbox.checked,
        showCategories: showCategories,
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
