//
const unit = document.getElementById ('unihan-inspector-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
const randomButton = unit.querySelector ('.random-button');
const infoContainer = unit.querySelector ('.info-container');
//
const instructions = unit.querySelector ('.instructions');
//
let currentTypefaceLanguage;
//
let showCategories;
//
module.exports.start = function (context)
{
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    const variantsData = require ('./parsed-variants-data.js');
    //
    function randomElement (elements)
    {
        return elements [Math.floor (Math.random () * elements.length)];
    }
    //
    const defaultPrefs =
    {
        unihanInput: "",
        typefaceLanguage: "",
        showCategories: false,
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    showCategories = prefs.showCategories;
    //
    const languages =
    {
        "ja": { label: "JP", title: "Japanese typeface" },
        "ko":  { label: "KR", title: "Korean typeface" },
        "zh-Hans": { label: "SC", title: "Simplified Chinese typeface" },
        "zh-Hant": { label: "TC", title: "Traditional Chinese typeface" }
    };
    const languageKeys = Object.keys (languages);
    //
    currentTypefaceLanguage = prefs.typefaceLanguage;
    if (!languageKeys.includes (currentTypefaceLanguage))
    {
        currentTypefaceLanguage = languageKeys[0];
    }
    //
    let currentCodePoint = null;
    //
    function displayData (codePoint)
    {
        function displayCharacterData (codePoint, tags)
        {
            let characterData = document.createElement ('div');
            characterData.className = 'character-data';
            //
            let unihanCard = document.createElement ('div');
            unihanCard.className = 'unihan-card';
            let unihanWrapper = document.createElement ('div');
            unihanWrapper.className = 'unihan-wrapper';
            let unihanCharacter = document.createElement ('div');
            unihanCharacter.textContent = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
            unihanCharacter.className = 'unihan-character';
            unihanWrapper.appendChild (unihanCharacter);
            console.log (unihanCharacter.textContent);  // Temp!
            let filler = document.createElement ('div');
            filler.className = 'filler';
            unihanWrapper.appendChild (filler);
            let unihanCodePoint= document.createElement ('div');
            unihanCodePoint.textContent = codePoint;
            unihanCodePoint.className = 'unihan-code-point';
            unihanWrapper.appendChild (unihanCodePoint);
            unihanCard.appendChild (unihanWrapper);
            let unihanLanguageWidget = document.createElement ('div');
            unihanLanguageWidget.className = 'unihan-language-widget';
            let unihanLanguagePrevious = document.createElement ('span');
            unihanLanguagePrevious.className = 'unihan-language-previous';
            unihanLanguagePrevious.textContent = "◀";
            unihanLanguageWidget.appendChild (unihanLanguagePrevious);
            let unihanLanguageTag = document.createElement ('span');
            unihanLanguageTag.className = 'unihan-language-tag';
            unihanLanguageWidget.appendChild (unihanLanguageTag);
            let unihanLanguageNext = document.createElement ('span');
            unihanLanguageNext.className = 'unihan-language-next';
            unihanLanguageNext.textContent = "▶";
            unihanLanguageWidget.appendChild (unihanLanguageNext);
            unihanCharacter.lang = currentTypefaceLanguage;
            let currentLanguage = languages[currentTypefaceLanguage];
            unihanLanguageTag.textContent = currentLanguage.label;
            unihanLanguageTag.title = currentLanguage.title;
            unihanWrapper.appendChild (unihanLanguageWidget);
            //
            function updateUnihanLanguage (reverse)
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
                unihanLanguageTag.textContent = currentLanguage.label;
                unihanLanguageTag.title = currentLanguage.title;
            }
            //
            unihanLanguagePrevious.addEventListener ('click', event => { updateUnihanLanguage (true); });
            unihanLanguageNext.addEventListener ('click', event => { updateUnihanLanguage (false); });
            //
            let unicodeData = unicode.getCharacterData (unihanCharacter.textContent);
            let unicodeFields =
            [
                { label: "Name", value: unicodeData.name },
                { label: "Age", value: unicodeData.age, title: unicodeData.ageDate },
                { label: "Plane", value: unicodeData.planeName, title: unicodeData.planeRange },
                { label: "Block", value: unicodeData.blockName, title: unicodeData.blockRange },
                { label: "Script", value: unicodeData.script },
                { label: "General\xA0Category", value: unicodeData.category },
                { label: "Decomposition", value: unicodeData.decomposition },
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
                rsValues = [... new Set (rsValues)];
                //
                rsClasses = rsValues.map ((rsValue, index) => (index < rsIRGCount) ? 'irg-source' : 'no-irg-source');
                //
                rsValues = rsValues.map (rsValue => fromRSValue (rsValue).join (" +\xA0"));
                //
                let definitionValue = tags["kDefinition"];
                let variants = variantsData[codePoint] || [ ];
                let variantsValue = variants.map (variant => String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16))).join (" ");
                let unihanFields =
                [
                    { label: "Radical/Strokes", value: rsValues, class: rsClasses },
                    { label: "Definition", value: definitionValue, class: 'line-clamp' },
                    { label: "Yasuoka\xA0Variants", value: variantsValue }
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
        function displayTags (codePoint, tags)
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
        if (codePoint)
        {
            let tags = unihanData.codePoints[codePoint];
            displayCharacterData (codePoint, tags);
            displayTags (codePoint, tags);
        }
    }
    //
    const unihanRegex = /^\s*(?:(.)|(?:[Uu]\+)?\s*([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    unihanInput.pattern = unihanRegex.source;
    //
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
    unihanInput.value = prefs.unihanInput;
    unihanInput.dispatchEvent (new Event ('input'));
    //
    lookupButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (unihanInput.value)
            {
                let match = unihanInput.value.match (unihanRegex);
                if (match)
                {
                    let num;
                    if (match[1])
                    {
                        num = match[1].codePointAt (0);
                    }
                    else if (match[2])
                    {
                        num = parseInt (match[2], 16);
                    }
                    let hex = num.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    currentCodePoint = `U+${hex}`;
                    unihanInput.value = currentCodePoint;
                    unihanInput.dispatchEvent (new Event ('input'));
                    displayData (currentCodePoint);
                }
            }
            else
            {
                currentCodePoint = null;
                displayData (currentCodePoint);
            }
        }
    );
    //
    randomButton.addEventListener
    (
        'click',
        (event) =>
        {
            unihanInput.value = randomElement (unihanData.coreSet);
            unihanInput.dispatchEvent (new Event ('input'));
            lookupButton.dispatchEvent (new Event ('click'));
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
        unihanInput: unihanInput.value,
        typefaceLanguage: currentTypefaceLanguage,
        showCategories: showCategories,
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
