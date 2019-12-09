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
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const numericValuesData = require ('../../lib/unicode/parsed-numeric-values-data.js');
    const compatibilityVariants = require ('../../lib/unicode/get-cjk-compatibility-variants.js');
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
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
        "ko": { label: "KR", title: "Korean typeface" },
        "zh-Hans": { label: "SC", title: "Simplified Chinese typeface" },
        "zh-Hant-TW": { label: "TC", title: "Traditional Chinese (Taiwan) typeface" },
        "zh-Hant-HK": { label: "HK", title: "Traditional Chinese (Hong Kong) typeface" },
        // "zh-Hant-MO": { label: "MO", title: "Traditional Chinese (Macao) typeface" }
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
    // Unihan characters
    const unihanPattern = '(?:(?=\\p{Script=Han})(?=\\p{Other_Letter}).)';
    //
    // Radicals
    const radicalPattern = '\\p{Radical}';
    //
    // Unihan characters and radicals
    const unihanOrRadicalPattern = `${unihanPattern}|${radicalPattern}`;
    //
    // Han script characters:
    // - CJK radicals
    // - KangXi radicals
    // - Ideographic iteration mark
    // - Ideographic number zero
    // - Hangzhou numerals
    // - Vertical ideographic iteration mark
    // - Unihan characters
    const hanPattern = '\\p{Script=Han}';
    //
    const filterPattern = unihanOrRadicalPattern;
    //
    const unifiedPattern = '\\p{Unified_Ideograph}';
    //
    const radicalRegex = new RegExp (radicalPattern, 'u');
    const filterRegex = new RegExp (filterPattern, 'u');
    const unifiedRegex = new RegExp (unifiedPattern, 'u');
    //
    function getTooltip (char)
    {
        let data = unicode.getCharacterBasicData (char);
        return `${data.codePoint.replace (/U\+/, "U\u034F\+")}\xA0${char}` + (radicalRegex.test (char) ? " (Radical)" : ""); // U+034F COMBINING GRAPHEME JOINER
    }
    function onLinkClick (event)
    {
        updateUnihanData (event.currentTarget.dataset.char);
    }
    //
    function appendTextWithLinks (node, text)
    {
        const codePointPattern = '\\bU\\+[0-9a-fA-F]{4,5}\\b';
        const regex = new RegExp (`(${codePointPattern})|(${filterPattern})`, 'gu');
        let matches = text.matchAll (regex);
        let clickables = [ ];
        for (let match of matches)
        {
            let matched = match[0];
            let index = match.index;
            let lastIndex = index + matched.length;
            let codePoint;
            let char;
            if (match[1])
            {
                codePoint = matched.toUpperCase ();
                char = String.fromCodePoint (parseInt (codePoint.replace ("U+", "") , 16));
                if (filterRegex.test (char))
                {
                    clickables.push ({ type: 'code-point', matched, index, lastIndex, codePoint, char });
                }
            }
            else if (match[2])
            {
                char = matched;
                codePoint = unicode.characterToCodePoint (char);
                clickables.push ({ type: 'char', matched, index, lastIndex, codePoint, char });
            }
        }
        for (let index = clickables.length - 2; index >= 0; index--)
        {
            let current = clickables[index];
            let next = clickables[index + 1];
            if ((current.char === next.char) && (current.type !== next.type) && (text.slice (current.lastIndex, next.index) === " "))
            {
                // Merge into current
                current.type = 'combo';
                current.matched = `${current.matched} ${next.matched}`;
                current.index = current.index;
                current.lastIndex = next.lastIndex;
                // Remove next
                clickables.splice (index + 1, 1);
            }
        }
        let lastIndex = 0;
        for (clickable of clickables)
        {
            node.appendChild (document.createTextNode (text.slice (lastIndex, clickable.index)));
            lastIndex = clickable.lastIndex;
            link = document.createElement ('span');
            link.className = 'unihan-character-link';
            if (clickable.char != currentUnihanCharacter)
            {
                link.classList.add ('clickable');
                link.dataset.char = clickable.char;
                link.addEventListener ('click', onLinkClick);
            }
            link.textContent = clickable.matched;
            link.title = getTooltip (clickable.char);
            node.appendChild (link);
        }
        node.appendChild (document.createTextNode (text.slice (lastIndex, text.length)));
    }
    //
    function appendFields (node, fieldItems)
    {
        for (let fieldItem of fieldItems)
        {
            if (!fieldItem)
            {
                let lineBreak = document.createElement ('br');
                node.appendChild (lineBreak);
            }
            else if (fieldItem.value)
            {
                let field = document.createElement ('div');
                field.className = 'field';
                if (Array.isArray (fieldItem.value))
                {
                    if (fieldItem.value.length > 0)
                    {
                        let name = document.createElement ('span');
                        name.className = 'name';
                        name.textContent = fieldItem.name.replace (/ /g, "\xA0");
                        field.appendChild (name);
                        field.appendChild (document.createTextNode (": "));
                        let value = document.createElement ('span');
                        value.className = 'value';
                        let list = document.createElement ('ul');
                        list.className = 'list';
                        fieldItem.value.forEach
                        (
                            (element, index) =>
                            {
                                let item = document.createElement ('li');
                                item.className = 'item';
                                if (Array.isArray (fieldItem.class))
                                {
                                    let itemClass = fieldItem.class[index];
                                    if (itemClass)
                                    {
                                        item.classList.add (itemClass);
                                    }
                                }
                                appendTextWithLinks (item, element);
                                list.appendChild (item);
                            }
                        );
                        value.appendChild (list);
                        field.appendChild (value);
                    }
                }
                else
                {
                    let name = document.createElement ('span');
                    name.className = 'name';
                    name.textContent = fieldItem.name.replace (/ /g, "\xA0");
                    field.appendChild (name);
                    field.appendChild (document.createTextNode (": "));
                    let value = document.createElement ('span');
                    value.className = 'value';
                    if (fieldItem.toolTip)
                    {
                        value.textContent = fieldItem.value;
                        value.title = fieldItem.toolTip;
                    }
                    else
                    {
                        appendTextWithLinks (value, fieldItem.value);
                    }
                    if (typeof fieldItem.class === 'string')
                    {
                        value.classList.add (fieldItem.class);
                    }
                    field.appendChild (value);
                }
                node.appendChild (field);
            }
        }
    }
    //
    function getIICoreTooltip (valueString)
    {
        const sources =
        {
            "G": "China",       // "CN"
            "H": "Hong Kong",   // "HK"
            "J": "Japan",       // "JP"
            "K": "South Korea", // "KR"
            "M": "Macao",       // "MO"
            "P": "North Korea", // "KP"
            "T": "Taiwan"       // "TW"
        };
        // let sourceArray = valueString.match (/[GHJKMPT]/g).map (source => `${source} (${sources[source]})`).sort ();
        let sourceArray = valueString.match (/[GHJKMPT]/g).map (source => sources[source]).sort ();
        return `Priority:\xA0${valueString.match (/[ABC]/)[0]}\nSource:\xA0${sourceArray.join (", ")}`;
    }
    //
    function displayData (character)
    {
        function displayCharacterData (character, codePoint, tags)
        {
            function getVariants (character, variantTag)
            {
                let variants = [ ];
                let codePoint = unicode.characterToCodePoint (character);
                let tags = unihanData.codePoints[codePoint];
                if (variantTag in tags)
                {
                    let variantArray = tags[variantTag];
                    if (!Array.isArray (variantArray))
                    {
                        variantArray = [ variantArray]
                    }
                    for (let variant of variantArray)
                    {
                        variant = variant.split ("<")[0];
                        variants.push (String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16)));
                    }
                }
                return variants;
            }
            //
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
            typefacePrevious.innerHTML = '<svg class="previous-icon" viewBox="0 0 10 10"><polygon points="9,0 1,5 9,10"></polygon></svg>'
            typefaceWidget.appendChild (typefacePrevious);
            let typefaceTag = document.createElement ('span');
            typefaceTag.className = 'typeface-tag';
            typefaceWidget.appendChild (typefaceTag);
            let typefaceNext = document.createElement ('span');
            typefaceNext.className = 'typeface-next';
            typefaceNext.innerHTML = '<svg class="next-icon" viewBox="0 0 10 10"><polygon points="1,0 9,5 1,10"></polygon></svg>'
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
            if (radicalRegex.test (character))
            {
                let unihanRadicalTag = document.createElement ('div');
                unihanRadicalTag.className = 'unihan-radical-tag';
                // "Radical", "[Radical]", "(Radical)", "<Radical>", "＊Radical＊", "*Radical*", "•Radical•"
                unihanRadicalTag.textContent = "(Radical)";
                unihanWrapper.appendChild (unihanRadicalTag);
            }
            //
            let unicodeData = unicode.getCharacterData (unihanCharacter.textContent);
            let age = unicodeData.age && `Unicode ${unicodeData.age} (${unicodeData.ageDate})`;
            let numericType = "";
            if (unicodeData.numeric)
            {
                numericType = "Numeric";
                if (unicodeData.digit)
                {
                    numericType = "Digit";
                    if (unicodeData.decimal)
                    {
                        numericType = "Decimal";
                    }
                }
            }
            let unicodeFields =
            [
                { name: "Name", value: unicodeData.name },
                { name: "Age", value: age },
                { name: "Plane", value: unicodeData.planeName, toolTip: unicodeData.planeRange },
                { name: "Block", value: unicodeData.blockName, toolTip: unicodeData.blockRange },
                { name: "Script", value: unicodeData.script },
                { name: "Script Extensions", value: unicodeData.scriptExtensions },
                { name: "General Category", value: unicodeData.category },
                { name: "Extended Properties", value: unicodeData.extendedProperties },
                { name: "Decomposition", value: unicodeData.decomposition },
                { name: "Equivalent Unified Ideograph", value: unicodeData.equivalentUnifiedIdeograph },
                { name: numericType, value: unicodeData.numeric }
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
                    let name = document.createElement ('span');
                    name.className = 'name';
                    name.textContent = unicodeField.name.replace (/ /g, "\xA0");
                    field.appendChild (name);
                    field.appendChild (document.createTextNode (": "));
                    let value = document.createElement ('span');
                    value.className = 'value';
                    let text = Array.isArray (unicodeField.value) ? unicodeField.value.join (", ") : unicodeField.value;
                    if (unicodeField.toolTip)
                    {
                        value.textContent = text;
                        value.title = unicodeField.toolTip;
                    }
                    else
                    {
                        appendTextWithLinks (value, text);
                    }
                    field.appendChild (value);
                    unicodeInfo.appendChild (field);
                }
            }
            //
            let unihanInfo = document.createElement ('div');
            unihanInfo.className = 'unihan-info';
            if (tags)
            {
                let iiCoreSet = ("kIICore" in tags) ? "IICore" : "Full";
                let iiCoreSetToolTip = ("kIICore" in tags) ? getIICoreTooltip (tags["kIICore"]) : "";
                let status = unifiedRegex.test (character) ? "Unified Ideograph" : "Compatibility Ideograph";
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
                let unified = [ ];
                if (unicodeData.decomposition)
                {
                     unified.push (String.fromCodePoint (parseInt (unicodeData.decomposition.replace ("U+", ""), 16)));
                }
                let compatibility = compatibilityVariants[character] || [ ];
                let semantic = getVariants (character, 'kSemanticVariant');
                let specialized = getVariants (character, 'kSpecializedSemanticVariant');
                let shape = getVariants (character, 'kZVariant');
                let simplified = getVariants (character, 'kSimplifiedVariant');
                let traditional = getVariants (character, 'kTraditionalVariant');
                let yasuoka = yasuokaVariants[character] || [ ];
                yasuoka = yasuoka.filter (variant => filterRegex.test (variant));
                let unihanFields =
                [
                    { name: "Set", value: iiCoreSet, toolTip: iiCoreSetToolTip },
                    { name: "Status", value: status },
                    { name: "Radical/Strokes", value: rsValues, class: rsClasses },
                    { name: "Definition", value: definitionValue },
                    { name: "Numeric Value", value: numericValue },
                    // null,
                    { name: "Unified Variant", value: unified.join (" ") },
                    { name: "Compatibility Variants", value: compatibility.join (" ") },
                    { name: "Semantic Variants", value: semantic.join (" ") },
                    { name: "Specialized Variants", value: specialized.join (" ") },
                    { name: "Shape Variants", value: shape.join (" ") },
                    { name: "Simplified Variants", value: simplified.join (" ") },
                    { name: "Traditional Variants", value: traditional.join (" ") },
                    { name: "Yasuoka Variants", value: yasuoka.join (" ") }
                ];
                appendFields (unihanInfo, unihanFields);
            }
            else if (radicalRegex.test (character))
            {
                let radicalIndex = -1;
                for (let kangxiIndex = 0; kangxiIndex < kangxiRadicals.length; kangxiIndex++)
                {
                    let kangxiRadical = kangxiRadicals[kangxiIndex];
                    if (kangxiRadical.radical === character)
                    {
                        radicalIndex = kangxiIndex;
                        break;
                    }
                    else if ("cjk" in kangxiRadical)
                    {
                        let ckjRadicals = kangxiRadical.cjk;
                        for (let cjkIndex = 0; cjkIndex < ckjRadicals.length; cjkIndex++)
                        {
                            let cjkRadical = ckjRadicals[cjkIndex];
                            if (cjkRadical.radical === character)
                            {
                                radicalIndex = kangxiIndex;
                                break;
                            }
                        }
                    }
                }
                let kangXiRadical;
                let unified;
                let kangxiClass;
                let cjkRadicals = [ ];
                let cjkClasses = [ ];
                if (radicalIndex >= 0)
                {
                    let kangxiRadical = kangxiRadicals[radicalIndex];
                    kangXiRadical = `${radicalIndex + 1} ${kangxiRadical.radical} (${kangxiRadical.name})`;
                    if (kangxiRadical.radical === character)
                    {
                        kangxiClass = 'kangxi-radical-current';
                        unified = kangxiRadical.unified;
                    }
                    else
                    {
                        kangxiClass = 'kangxi-radical';
                    }
                    if ("cjk" in kangxiRadical)
                    {
                        let ckjRadicals = kangxiRadical.cjk;
                        for (let cjkIndex = 0; cjkIndex < ckjRadicals.length; cjkIndex++)
                        {
                            let cjkRadical = ckjRadicals[cjkIndex];
                            cjkRadicals.push (`${radicalIndex + 1} ${cjkRadical.radical} (${cjkRadical.name})`);
                            if (cjkRadical.radical === character)
                            {
                                cjkClasses.push ('cjk-radical-current');
                                unified = cjkRadical.unified;
                            }
                            else
                            {
                                cjkClasses.push ('cjk-radical');
                            }
                        }
                    }
                }
                else
                {
                    // Only one case: ⺀ U+2E80 CJK RADICAL REPEAT
                    kangXiRadical = "<unknown>";   // "？", "?", "??", "<unknown>"
                }
                //
                let radicalFields =
                [
                    { name: "KangXi Radical", value: kangXiRadical, class: kangxiClass },
                    { name: "CJK Radicals", value: cjkRadicals, class: cjkClasses },
                    { name: "Equivalent Unified Ideograph", value: unified }
                ];
                appendFields (unihanInfo, radicalFields);
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
                                    tagCell.textContent = tag;
                                    tagCell.title = unihanData.tags[tag].name;
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
                                            appendTextWithLinks (item, element);
                                            list.appendChild (item);
                                        }
                                        valueCell.appendChild (list);
                                    }
                                    else
                                    {
                                        appendTextWithLinks (valueCell, value);
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
                        tagCell.title = unihanData.tags[tag].name;
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
                                appendTextWithLinks (item, element);
                                list.appendChild (item);
                            }
                            valueCell.appendChild (list);
                        }
                        else
                        {
                            appendTextWithLinks (valueCell, value);
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
            if (!filterRegex.test (character))
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
        unit.scrollTop = 0;
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
    function randomElement (elements)
    {
        return elements [Math.floor (Math.random () * elements.length)];
    }
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
