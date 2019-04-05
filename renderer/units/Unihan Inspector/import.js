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
    const rewritePattern = require ('regexpu-core');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    const numericValuesData = require ('../../lib/unicode/parsed-numeric-values-data.js');
    //
    const compatibilityVariants = require ('../../lib/unicode/get-cjk-compatibility-variants.js');
    //
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    //
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    // Unihan character
    let flags = 'u';
    let unihanPattern = '(?=\\p{Script=Han})(?=\\p{Other_Letter})';
    unihanPattern = rewritePattern (unihanPattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
    let unihanRegex = new RegExp (unihanPattern, flags);
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
                { label: "Name", value: unicodeData.name },
                { label: "Age", value: unicodeData.age, title: unicodeData.ageDate },
                { label: "Plane", value: unicodeData.planeName, title: unicodeData.planeRange },
                { label: "Block", value: unicodeData.blockName, title: unicodeData.blockRange },
                { label: "Script", value: unicodeData.script },
                { label: "Script\xA0Extensions", value: unicodeData.scriptExtensions },
                { label: "General\xA0Category", value: unicodeData.category },
                { label: "Decomposition", value: unicodeData.decomposition },
                { label: "Binary\xA0Properties", value: unicodeData.binaryProperties },
                { label: "Equivalent\xA0Unified\xA0Ideograph", value: unicodeData.equivalentUnifiedIdeograph }
            ];
            //
            let unicodeInfo = document.createElement ('div');
            unicodeInfo.className = 'unicode-info';
            for (let unicodeField of unicodeFields)
            {
                if (unicodeField.value)
                {
                    let field = document.createElement ('div');
                    field.className = 'unicode-field';
                    if (unicodeField.title)
                    {
                        field.title = unicodeField.title;
                    }
                    field.textContent = `${unicodeField.label}: ${unicodeField.value}`;
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
                                if (parsed[1] === 'C')
                                {
                                    let [ index, strokes, residual ] = parsed[2].split ('.');
                                    rsValues.push ([ index, residual ].join ('.'));
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
                let unihanFields =
                [
                    { label: "Radical/Strokes", value: rsValues, class: rsClasses },
                    { label: "Definition", value: definitionValue, class: 'line-clamp' },
                    { label: "Numeric\xA0Value", value: numericValue },
                    { label: "Compatibility\xA0Variants", value: compatibility.join (" ") },
                    { label: "Yasuoka\xA0Variants", value: yasuoka.join (" ") }
                ];
                //
                for (let unihanField of unihanFields)
                {
                    if (unihanField.value)
                    {
                        let field = document.createElement ('div');
                        field.className = 'unihan-field';
                        if (typeof unihanField.class === 'string')
                        {
                            field.classList.add (unihanField.class);
                        }
                        if (Array.isArray (unihanField.value))
                        {
                            let labelText = document.createElement ('span');
                            labelText.textContent = `${unihanField.label}:`;
                            field.appendChild (labelText);
                            let lineBreak = document.createElement ('br');
                            field.appendChild (lineBreak);
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
                            field.appendChild (list);
                        }
                        else
                        {
                            field.textContent = `${unihanField.label}: ${unihanField.value}`;
                        }
                        unihanInfo.appendChild (field);
                    }
                }
                //
                if ("kIICore" in tags)
                {
                    let coreField = document.createElement ('div');
                    coreField.className = 'unihan-field';
                    coreField.textContent = "Set: IICore";
                    unihanInfo.appendChild (coreField);
                }
            }
            else
            {
                let invalidUnihan = document.createElement ('div');
                invalidUnihan.className = 'unihan-field invalid-unihan';
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
                        showCategories = event.target.checked;
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
            let hex = character.codePointAt (0).toString (16).toUpperCase ();
            if (hex.length < 5)
            {
                hex = ("000" + hex).slice (-4);
            }    
            let codePoint = `U+${hex}`;
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
            event.target.classList.remove ('invalid');
            if (event.target.value)
            {
                if (!parseUnihanCharacter (event.target.value))
                {
                    event.target.classList.add ('invalid');
                }
            }
        }
    );
    unihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
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
                if (event.key === "ArrowUp")
                {
                    event.preventDefault ();
                    if (unihanHistoryIndex === -1)
                    {
                        unihanHistorySave = event.target.value;
                    }
                    unihanHistoryIndex++;
                    if (unihanHistoryIndex > (unihanHistory.length - 1))
                    {
                        unihanHistoryIndex = (unihanHistory.length - 1);
                    }
                    if (unihanHistoryIndex !== -1)
                    {
                        event.target.value = unihanHistory[unihanHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === "ArrowDown")
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
                            event.target.value = unihanHistorySave;
                            event.target.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.target.value = unihanHistory[unihanHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
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
