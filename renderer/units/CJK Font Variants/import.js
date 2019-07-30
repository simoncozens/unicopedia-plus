//
const unitId = 'cjk-font-variants-unit';
//
const unit = document.getElementById (unitId);
//
const clearButton = unit.querySelector ('.clear-button');
const charactersSamples = unit.querySelector ('.characters-samples');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const writingModeSelect = unit.querySelector ('.writing-mode-select');
const eastAsianSelect = unit.querySelector ('.east-asian-select');
const sheet = unit.querySelector ('.sheet');
//
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus.js');
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const defaultPrefs =
    {
        charactersInput: "",
        writingModeSelect: "",
        eastAsianSelect: "",
        instructions: true,
        references: false,
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let headStyle = document.createElement ('style');
    document.head.appendChild (headStyle);
    //
    const defaultFontSize = 72;
    //
    const cjkBlankFont = `${defaultFontSize}px "Sans CJK JP", "Blank"`;
    //
    let canvas = document.createElement ('canvas');
    canvas.width = defaultFontSize;
    canvas.height = defaultFontSize;
    let ctx = canvas.getContext ('2d');
    ctx.font = cjkBlankFont;
    //
    function isProperlyRendered (string)
    {
        let witdh = Math.round (ctx.measureText (string).width);
        return (witdh > 0) && (witdh <= ctx.canvas.width);
    }
    //
    clearButton.addEventListener
    (
        'click',
        event =>
        {
            charactersInput.value = "";
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let charactersMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            charactersInput.value = sample.string;
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersSamples.addEventListener
    (
        'click',
        event =>
        {
            pullDownMenus.popup (event.currentTarget, charactersMenu);
        }
    );
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    loadButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    let maxLength = charactersInput.maxLength;
                    if (text.length > maxLength)
                    {
                        text = text.substring (0, maxLength);
                    }
                    charactersInput.value = text;
                    charactersInput.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    saveButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return charactersInput.value;
                }
            );
        }
    );
    //
    const languages =
    [
        { header: "Japanese", tag: 'ja', code: "JP" },
        { header: "Korean", tag: 'ko', code: "KR" },
        { header: "Simplified Chinese", tag: 'zh-Hans', code: "SC" },
        { header: "Traditional Chinese", tag: 'zh-Hant', code: "TC" },
        { header: "Hong\xA0Kong Chinese", tag: 'zh-HK', code: "HK" }
    ];
    //
    const useFooter = true;
    //
    function getTooltip (wideCharacter)
    {
        let tooltip = [ ];
        for (let character of wideCharacter)
        {
            let data = unicode.getCharacterBasicData (character);
            tooltip.push (`${data.codePoint.replace (/U\+/, "U\u034F\+")}\xA0${data.name}`); // U+034F COMBINING GRAPHEME JOINER
        }
        return "<" + tooltip.join (",\n") + ">";
    }
    //
    const blendingEffect = 'none'; // 'none', 'normal', 'multiply', 'difference'
    //
    let currentElement = null;
    //
    function showDifferences (event)
    {
        event.preventDefault ();
        currentElement = event.currentTarget;
        let languageVariants = sheet.querySelectorAll (`.cjk-data[data-index="${currentElement.dataset.index}"]`);
        for (let languageVariant of languageVariants)
        {
            let base = languageVariant.querySelector ('.cjk-data-base');
            switch (blendingEffect)
            {
                case 'none':
                    base.classList.add ('hidden');
                    break;
                case 'normal':
                    base.style.color = 'var(--color-base)';
                    break;
                case 'multiply':
                    base.style.color = 'var(--color-base)';
                    break;
                case 'difference':
                    base.style.color = 'black';
                    break;
            }
            let overlay = languageVariant.querySelector ('.cjk-data-overlay');
            overlay.lang = currentElement.lang;
            switch (blendingEffect)
            {
                case 'none':
                    break;
                case 'normal':
                    overlay.style.color = 'var(--color-overlay)';
                    overlay.style.mixBlendMode = 'normal';
                    break;
                case 'multiply':
                    overlay.style.color = 'var(--color-overlay)';
                    overlay.style.mixBlendMode = 'multiply';
                    break;
                case 'difference':
                    overlay.style.color = 'var(--color-overlay)';
                    overlay.style.mixBlendMode = 'difference';
                    break;
            }
            overlay.classList.remove ('hidden');
        }
    }
    //
    function hideDifferences (event)
    {
        if (currentElement)
        {
            let languageVariants = sheet.querySelectorAll (`.cjk-data[data-index="${currentElement.dataset.index}"]`);
            for (let languageVariant of languageVariants)
            {
                let base = languageVariant.querySelector ('.cjk-data-base');
                switch (blendingEffect)
                {
                    case 'none':
                        base.classList.remove ('hidden');
                        break;
                    case 'normal':
                    case 'multiply':
                    case 'difference':
                        base.style = null;
                        break;
                }
                let overlay = languageVariant.querySelector ('.cjk-data-overlay');
                switch (blendingEffect)
                {
                    case 'none':
                        break;
                    case 'normal':
                    case 'multiply':
                    case 'difference':
                        overlay.style = null;
                        break;
                }
                overlay.classList.add ('hidden');
            }
        }
        else
        {
            currentElement = null;
        }
    }
    //
    function createSheet (wideCharacters)
    {
        while (sheet.firstChild)
        {
            sheet.firstChild.remove ();
        }
        sheet.classList.remove ('horizontal');
        sheet.classList.remove ('vertical');
        if (wideCharacters.length > 0)
        {
            if (writingModeSelect.value === 'vertical')
            {
                // Vertical writing mode
                let table = document.createElement ('table');
                table.className= 'table';
                let headerRow = document.createElement ('tr');
                languages.forEach
                (
                    (language, index) =>
                    {
                        if (index > 0)
                        {
                            let emptyGap = document.createElement ('th');
                            emptyGap.className = 'empty-gap';
                            emptyGap.textContent = "\xA0";
                            headerRow.appendChild (emptyGap);
                        }
                        let header = document.createElement ('th');
                        header.className = 'cjk-title';
                        header.title = `Code: ${language.code}\nlang="${language.tag}"`;
                        let span = document.createElement ('span');
                        span.textContent = language.header;
                        header.appendChild (span);
                        headerRow.appendChild (header);
                    }
                );
                table.appendChild (headerRow);
                wideCharacters.forEach
                (
                    (wideCharacter, wideCharacterIndex) =>
                    {
                        let dataRow = document.createElement ('tr');
                        languages.forEach
                        (
                            (language, languageIndex) =>
                            {
                                if (languageIndex > 0)
                                {
                                    let emptyGap = document.createElement ('td');
                                    emptyGap.className = 'empty-gap';
                                    emptyGap.textContent = "\xA0";
                                    dataRow.appendChild (emptyGap);
                                }
                                let data = document.createElement ('td');
                                data.className = 'cjk-data';
                                data.title = getTooltip (wideCharacter);
                                data.lang = language.tag;
                                data.dataset.index = wideCharacterIndex;
                                data.addEventListener ('mousedown', showDifferences);
                                document.addEventListener ('mouseup', hideDifferences);
                                let base = document.createElement ('div');
                                base.className = 'cjk-data-base';
                                let baseChar = document.createElement ('span');
                                baseChar.className = 'cjk-char';
                                baseChar.textContent = wideCharacter;
                                base.appendChild (baseChar)
                                data.appendChild (base);
                                let overlay = document.createElement ('div');
                                overlay.className = 'cjk-data-overlay';
                                overlay.classList.add ('hidden');
                                let overlayChar = document.createElement ('span');
                                overlayChar.className = 'cjk-char';
                                overlayChar.textContent = wideCharacter;
                                overlay.appendChild (overlayChar)
                                data.appendChild (overlay);
                                dataRow.appendChild (data);
                            }
                        );
                        table.appendChild (dataRow);
                    }
                );
                if (useFooter)
                {
                    table.appendChild (headerRow.cloneNode (true));
                }
                sheet.appendChild (table);
                sheet.classList.add ('vertical');
            }
            else
            {
                // Horizontal writing mode
                let table = document.createElement ('table');
                table.className= 'table';
                languages.forEach
                (
                    (language, languageIndex) =>
                    {
                        if (languageIndex > 0)
                        {
                            let emptyRow = document.createElement ('tr');
                            emptyRow.className = 'empty-row';
                            let emptyData = document.createElement ('td');
                            emptyData.className = 'empty-data';
                            emptyData.textContent = "\xA0";
                            emptyRow.appendChild (emptyData);
                            table.appendChild (emptyRow);
                        }
                        let dataRow = document.createElement ('tr');
                        let emptyCol;
                        emptyCol = document.createElement ('td');
                        emptyCol.className = 'empty-col';
                        emptyCol.textContent = "\xA0";
                        dataRow.appendChild (emptyCol);
                        let header = document.createElement ('th');
                        header.className = 'cjk-title';
                        header.title = `Code: ${language.code}\nlang="${language.tag}"`;
                        let span = document.createElement ('span');
                        span.className = 'cjk-lang';
                        span.textContent = language.header;
                        header.appendChild (span);
                        dataRow.appendChild (header);
                        wideCharacters.forEach
                        (
                            (wideCharacter, wideCharacterIndex) =>
                            {
                                let data = document.createElement ('td');
                                data.className = 'cjk-data';
                                data.title = getTooltip (wideCharacter);
                                data.lang = language.tag;
                                data.dataset.index = wideCharacterIndex;
                                data.addEventListener ('mousedown', showDifferences);
                                document.addEventListener ('mouseup', hideDifferences);
                                let base = document.createElement ('div');
                                base.className = 'cjk-data-base';
                                let baseChar = document.createElement ('span');
                                baseChar.className = 'cjk-char';
                                baseChar.textContent = wideCharacter;
                                base.appendChild (baseChar)
                                data.appendChild (base);
                                let overlay = document.createElement ('div');
                                overlay.className = 'cjk-data-overlay';
                                overlay.classList.add ('hidden');
                                let overlayChar = document.createElement ('span');
                                overlayChar.className = 'cjk-char';
                                overlayChar.textContent = wideCharacter;
                                overlay.appendChild (overlayChar)
                                data.appendChild (overlay);
                                dataRow.appendChild (data);
                            }
                        );
                        if (useFooter)
                        {
                            dataRow.appendChild (header.cloneNode (true));
                        }
                        emptyCol = document.createElement ('td');
                        emptyCol.className = 'empty-col';
                        emptyCol.textContent = "\xA0";
                        dataRow.appendChild (emptyCol);
                        table.appendChild (dataRow);
                    }
                );
                sheet.appendChild (table);
                sheet.classList.add ('horizontal');
            }
        }
    }
    //
    const GraphemeSplitter = require ('grapheme-splitter');
    //
    var splitter = new GraphemeSplitter ();
    //
    function isWideGrapheme (grapheme)
    {
        let isWide = false;
        if (isProperlyRendered (grapheme))
        {
            let character = (Array.from (grapheme))[0];
            isWide =
                unicode.matchEastAsianWidth (character, [ 'F', 'W' ])
                ||
                (
                    unicode.matchEastAsianWidth (character, [ 'A' ])
                    &&
                    unicode.matchVerticalOrientation (character, [ 'U', 'Tu' ])
                );
        }
        return isWide;
    }
    //
    function wideSplit (string)
    {
        let wideCharacters = splitter.splitGraphemes (string).filter (isWideGrapheme);
        return wideCharacters;
    }
    //
    writingModeSelect.value = prefs.writingModeSelect;
    if (writingModeSelect.selectedIndex < 0) // -1: no element is selected
    {
        writingModeSelect.selectedIndex = 0;
    }
    writingModeSelect.addEventListener
    (
        'input',
        event =>
        {
            createSheet (wideSplit (charactersInput.value));
        }
    );
    //
    eastAsianSelect.value = prefs.eastAsianSelect;
    if (eastAsianSelect.selectedIndex < 0) // -1: no element is selected
    {
        eastAsianSelect.selectedIndex = 0;
    }
    eastAsianSelect.addEventListener
    (
        'input',
        event =>
        {
            headStyle.textContent = `#${unitId} .cjk-char { font-variant-east-asian: ${event.currentTarget.value}; }`;
        }
    );
    eastAsianSelect.dispatchEvent (new Event ('input'));
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            codePointsInput.value = unicode.charactersToCodePoints (characters, true);
            createSheet (wideSplit (characters));
        }
    );
    charactersInput.value = prefs.charactersInput;
    charactersInput.dispatchEvent (new Event ('input'));
    //
    codePointsInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = unicode.codePointsToCharacters (event.currentTarget.value);
            charactersInput.value = characters;
            createSheet (wideSplit (characters));
        }
    );
    codePointsInput.addEventListener
    (
        'change',
        event =>
        {
            event.currentTarget.value = unicode.charactersToCodePoints (charactersInput.value, true);
        }
    );
   //
    instructions.open = prefs.instructions;
    //
    references.open = prefs.references;
    //
    const cjkLinks = require ('./cjk-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, cjkLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        charactersInput: charactersInput.value,
        writingModeSelect: writingModeSelect.value,
        eastAsianSelect: eastAsianSelect.value,
        instructions: instructions.open,
        references: references.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
