//
const unit = document.getElementById ('unihan-inspector-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
const randomButton = unit.querySelector ('.random-button');
const categoriesCheckbox = unit.querySelector ('.categories-checkbox');
const propertiesData = unit.querySelector ('.properties-data');
//
const instructions = unit.querySelector ('.instructions');
//
// Property categories (field types)
// https://www.unicode.org/reports/tr38/#N100FB
// https://www.unicode.org/cgi-bin/GetUnihanData.pl
//
// https://www.unicode.org/reports/tr38/#N1013C
// https://www.unicode.org/reports/tr38/#N101BA
// https://www.unicode.org/reports/tr38/#N10106
// https://www.unicode.org/reports/tr38/#N1024D
// https://www.unicode.org/reports/tr38/#N10130
// https://www.unicode.org/reports/tr38/#N101E4
// https://www.unicode.org/reports/tr38/#N1019C
// https://www.unicode.org/reports/tr38/#N10211
//
const categories =
[
    {
        "name": "Dictionary Indices",
        "properties":
        [
            "kCheungBauerIndex",
            "kCowles",
            "kDaeJaweon",
            "kFennIndex",
            "kGSR",
            "kHanYu",
            "kIRGDaeJaweon",
            "kIRGDaiKanwaZiten",
            "kIRGHanyuDaZidian",
            "kIRGKangXi",
            "kKangXi",
            "kKarlgren",
            "kLau",
            "kMatthews",
            "kMeyerWempe",
            "kMorohashi",
            "kNelson",
            "kSBGY"
        ]
    },
    {
        "name": "Dictionary-like Data",
        "properties":
        [
            "kCangjie",
            "kCheungBauer",
            "kCihaiT",
            "kFenn",
            "kFourCornerCode",
            "kFrequency",
            "kGradeLevel",
            "kHDZRadBreak",
            "kHKGlyph",
            "kPhonetic",
            "kTotalStrokes"
        ]
    },
    {
        "name": "IRG Sources",
        "properties":
        [
            "kIICore",
            "kIRG_GSource",
            "kIRG_HSource",
            "kIRG_JSource",
            "kIRG_KPSource",
            "kIRG_KSource",
            "kIRG_MSource",
            "kIRG_TSource",
            "kIRG_USource",
            "kIRG_VSource"
        ]
    },
    {
        "name": "Numeric Values",
        "properties":
        [
            "kAccountingNumeric",
            "kOtherNumeric",
            "kPrimaryNumeric"
        ]
    },
    {
        "name": "Other Mappings",
        "properties":
        [
            "kBigFive",
            "kCCCII",
            "kCNS1986",
            "kCNS1992",
            "kEACC",
            "kGB0",
            "kGB1",
            "kGB3",
            "kGB5",
            "kGB7",
            "kGB8",
            "kHKSCS",
            "kIBMJapan",
            "kJa",
            "kJinmeiyoKanji",
            "kJis0",
            "kJIS0213",
            "kJis1",
            "kJoyoKanji",
            "kKoreanEducationHanja",
            "kKoreanName",
            "kKPS0",
            "kKPS1",
            "kKSC0",
            "kKSC1",
            "kMainlandTelegraph",
            "kPseudoGB1",
            "kTaiwanTelegraph",
            "kTGH",
            "kXerox"
        ]
    },
    {
        "name": "Radical-Stroke Counts",   // "Radical-stroke Indices"
        "properties":
        [
            "kRSAdobe_Japan1_6",
            "kRSJapanese",
            "kRSKangXi",
            "kRSKanWa",
            "kRSKorean",
            "kRSUnicode"
        ]
    },
    {
        "name": "Readings",
        "properties":
        [
            "kCantonese",
            "kDefinition",
            "kHangul",
            "kHanyuPinlu",
            "kHanyuPinyin",
            "kJapaneseKun",
            "kJapaneseOn",
            "kKorean",
            "kMandarin",
            "kTang",
            "kVietnamese",
            "kXHC1983"
        ]
    },
    {
        "name": "Variants",
        "properties":
        [
            "kCompatibilityVariant",
            "kSemanticVariant",
            "kSimplifiedVariant",
            "kSpecializedSemanticVariant",
            "kTraditionalVariant",
            "kZVariant"
        ]
    }
];
//
let currentTypefaceLanguage;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    const radicalsData = require ('../../lib/unicode/parsed-cjk-radicals-data.js');
    //
    const variantsData = require ('./parsed-variants-data.js');
    //
    const coreUnihan = Object.keys (unihanData).filter (key => ('kIICore' in unihanData[key])); // Used for random access
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
        categoriesCheckbox: false,
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const languages =
    {
        "zh-Hans": { label: "SC", title: "Simplified Chinese typeface" }, 
        "zh-Hant": { label: "TC", title: "Traditional Chinese typeface" }, 
        "ja": { label: "JP", title: "Japanese typeface" },
        "ko":  { label: "KR", title: "Korean typeface" }
    };
    const languageKeys = Object.keys (languages);
    //
    currentTypefaceLanguage = prefs.typefaceLanguage;
    //
    let currentCodePoint = null;
    //
    function displayProperties (codePoint)
    {
        while (propertiesData.firstChild)
        {
           propertiesData.firstChild.remove ();
        }
        if (codePoint)
        {
            let properties = unihanData[codePoint];
            if (properties)
            {
                let infoContainer = document.createElement ('div');
                infoContainer.className = 'info-container';
                //
                let unihanCard = document.createElement ('div');
                unihanCard.className = 'unihan-card';
                let unihanWrapper = document.createElement ('div');
                unihanWrapper.className = 'unihan-wrapper';
                let unihanCharacter = document.createElement ('div');
                unihanCharacter.textContent = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
                unihanCharacter.className = 'unihan-character';
                unihanWrapper.appendChild (unihanCharacter);
                let unihanCodePoint= document.createElement ('div');
                unihanCodePoint.textContent = codePoint;
                unihanCodePoint.className = 'unihan-code-point';
                unihanWrapper.appendChild (unihanCodePoint);
                unihanCard.appendChild (unihanWrapper);
                let filler = document.createElement ('div');
                filler.className = 'filler';
                unihanWrapper.appendChild (filler);
                let unihanLanguage= document.createElement ('div');
                unihanLanguage.className = 'unihan-language';
                if (!languageKeys.includes (currentTypefaceLanguage))
                {
                    currentTypefaceLanguage = languageKeys[0];
                }
                unihanCharacter.lang = currentTypefaceLanguage;
                let currentLanguage = languages[currentTypefaceLanguage];
                unihanLanguage.textContent = currentLanguage.label;
                unihanLanguage.title = currentLanguage.title;
                unihanWrapper.appendChild (unihanLanguage);
                //
                unihanLanguage.addEventListener
                (
                    'click',
                    event =>
                    {
                        let index = languageKeys.indexOf (unihanCharacter.lang);
                        if (event.shiftKey)
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
                        unihanLanguage.textContent = currentLanguage.label;
                        unihanLanguage.title = currentLanguage.title;
                    }
                );
                //
                let unicodeData = unicode.getCharacterData (unihanCharacter.textContent);
                //
                let unicodeInfo = document.createElement ('div');
                unicodeInfo.className = 'unicode-info';
                let nameField = document.createElement ('div');
                nameField.className = 'unicode-field';
                nameField.textContent = `Name: ${unicodeData.name}`;
                unicodeInfo.appendChild (nameField);
                let ageField = document.createElement ('div');
                ageField.className = 'unicode-field';
                ageField.title = unicodeData.ageDate;
                ageField.textContent = `Age: ${unicodeData.age}`;
                unicodeInfo.appendChild (ageField);
                let planeField = document.createElement ('div');
                planeField.className = 'unicode-field';
                planeField.title = unicodeData.planeRange;
                planeField.textContent = `Plane: ${unicodeData.planeName}`;
                unicodeInfo.appendChild (planeField);
                let blockField = document.createElement ('div');
                blockField.className = 'unicode-field';
                blockField.title = unicodeData.blockRange;
                blockField.textContent = `Block: ${unicodeData.blockName}`;
                unicodeInfo.appendChild (blockField);
                let scriptField = document.createElement ('div');
                scriptField.className = 'unicode-field';
                scriptField.textContent = `Script: ${unicodeData.script}`;
                unicodeInfo.appendChild (scriptField);
                let categoryField = document.createElement ('div');
                categoryField.className = 'unicode-field';
                categoryField.textContent = `General\xA0Category: ${unicodeData.category}`;
                unicodeInfo.appendChild (categoryField);
                //
                let [ radical, residual ] = properties["kRSUnicode"].split ('.');
                let parsedRadical = radical.match (/^([1-9][0-9]{0,2})(\')?$/);
                let radicalCharacter = String.fromCodePoint (parseInt (radicalsData[radical].radicalCharacter, 16));
                let unifiedCharacter = String.fromCodePoint (parseInt (radicalsData[radical].unifiedCharacter, 16));
                let variants = variantsData[codePoint] || [ ];
                let variantsString = variants.map (variant => String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16))).join (" ");
                let unihanFields =
                [
                    { label: (parsedRadical[2] ? "Simplified\xA0Radical" : "Kangxi\xA0Radical"), value: `${parsedRadical[1]}\xA0${radicalCharacter} (Unified:\xA0${unifiedCharacter})` },
                    { label: "Residual\xA0Strokes", value: residual },
                    { label: "Total\xA0Strokes", value: properties["kTotalStrokes"] },
                    { label: "Definition", value: properties["kDefinition"] },
                    { label: "Yasuoka\xA0Variants", value: variantsString }
                ];
                //
                let unihanInfo = document.createElement ('div');
                unihanInfo.className = 'unihan-info';
                for (let field of unihanFields)
                {
                    if (field.value)
                    {
                        let unihanField = document.createElement ('div');
                        unihanField.className = 'unihan-field';
                        unihanField.textContent = `${field.label}: ${field.value}`;
                        unihanInfo.appendChild (unihanField);
                    }
                }
                //
                infoContainer.appendChild (unihanCard);
                infoContainer.appendChild (unicodeInfo);
                infoContainer.appendChild (unihanInfo);
                propertiesData.appendChild (infoContainer);
                //
                let table = document.createElement ('table');
                table.className = 'data-list';
                let headerRow = document.createElement ('tr');
                headerRow.className = 'header-row';
                let propertyHeader = document.createElement ('th');
                propertyHeader.className = 'property-header';
                propertyHeader.textContent = "Unihan Tag"; // "Unihan Property"
                headerRow.appendChild (propertyHeader);
                let valueHeader = document.createElement ('th');
                valueHeader.className = 'value-header';
                valueHeader.textContent = "Value";
                headerRow.appendChild (valueHeader);
                table.appendChild (headerRow);
                if (categoriesCheckbox.checked)
                {
                    for (let category of categories)
                    {
                        let categoryProperties = category.properties.filter (property => (property in properties));
                        if (categoryProperties.length > 0)
                        {
                            let categoryRow = document.createElement ('tr');
                            categoryRow.className = 'category-row';
                            let categoryName = document.createElement ('td');
                            categoryName.className = 'category-name';
                            categoryName.textContent = category.name;
                            categoryName.colSpan = 2;
                            categoryRow.appendChild (categoryName);
                            table.appendChild (categoryRow);
                            for (let property of categoryProperties)
                            {
                                let value = properties[property];
                                if (value)
                                {
                                    let propertyRow = document.createElement ('tr');
                                    let propertyCell = document.createElement ('td');
                                    propertyCell.className = 'property';
                                    propertyCell.textContent = property;
                                    propertyRow.appendChild (propertyCell);
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
                                    propertyRow.appendChild (valueCell);
                                    table.appendChild (propertyRow);
                                }
                            }
                        }
                    }
                }
                else
                {
                    let sortedKeys = Object.keys (properties).sort ((a, b) => a.localeCompare (b));
                    for (let property of sortedKeys)
                    {
                        let propertyRow = document.createElement ('tr');
                        let value = properties[property];
                        let propertyCell = document.createElement ('td');
                        propertyCell.className = 'property';
                        propertyCell.textContent = property;
                        propertyRow.appendChild (propertyCell);
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
                        propertyRow.appendChild (valueCell);
                        table.appendChild (propertyRow);
                    }
                }
                propertiesData.appendChild (table);
            }
            else
            {
                remote.shell.beep ();
            }
        }
    }
    //
    const unihanRegex = /^\s*(?:(.)|(?:[Uu]\+)?([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
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
                    displayProperties (currentCodePoint);
                }
            }
            else
            {
                currentCodePoint = null;
                displayProperties (currentCodePoint);
            }
        }
    );
    //
    randomButton.addEventListener
    (
        'click',
        (event) =>
        {
            unihanInput.value = randomElement (coreUnihan);
            lookupButton.dispatchEvent (new Event ('click'));
        }
    );
    //
    categoriesCheckbox.checked = prefs.categoriesCheckbox;
    categoriesCheckbox.addEventListener ('input', (event) => { displayProperties (currentCodePoint); });
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
        categoriesCheckbox: categoriesCheckbox.checked,
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
