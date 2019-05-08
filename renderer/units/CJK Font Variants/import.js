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
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const rewritePattern = require ('regexpu-core');
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
            pullDownMenus.popup (event.target.getBoundingClientRect (), charactersMenu);
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
                [ { name: 'Text (*.txt)', extensions: [ 'txt' ] } ],
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
                    wideCharacter =>
                    {
                        let dataRow = document.createElement ('tr');
                        languages.forEach
                        (
                            (language, index) =>
                            {
                                if (index > 0)
                                {
                                    let emptyGap = document.createElement ('td');
                                    emptyGap.className = 'empty-gap';
                                    emptyGap.textContent = "\xA0";
                                    dataRow.appendChild (emptyGap);
                                }
                                let data = document.createElement ('td');
                                data.className = 'cjk-data';
                                data.lang = language.tag;
                                data.title = unicode.charactersToCodePoints (wideCharacter);
                                let span = document.createElement ('span');
                                span.textContent = wideCharacter;
                                span.className = 'cjk-char';
                                data.appendChild (span);
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
                let table = document.createElement ('table');
                table.className= 'table';
                languages.forEach
                (
                    (language, index) =>
                    {
                        if (index > 0)
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
                            wideCharacter =>
                            {
                                let data = document.createElement ('td');
                                data.className = 'cjk-data';
                                data.lang = language.tag;
                                data.title = unicode.charactersToCodePoints (wideCharacter);
                                let span = document.createElement ('span');
                                span.textContent = wideCharacter;
                                span.className = 'cjk-char';
                                data.appendChild (span);
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
    function propertyRegex (property)
    {
        const flags = 'u';
        let pattern = `\\p{${property}}`;
        pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
        return new RegExp (pattern, flags);
    }
    //
    const graphemeBaseRegex = propertyRegex ('Grapheme_Base');
    const emojiRegex = propertyRegex ('Emoji');
    const variationSelectorRegex = propertyRegex ('Variation_Selector');
    const graphemeExtendRegex = propertyRegex ('Grapheme_Extend');
    //
    function wideSplit (string)
    {
        let wideCharacters = [ ];
        let state = 'start';
        for (let character of string)
        {
            if
            (
                // Temporary hack until regexpu-core module gets updated to Unicode 12.1!
                (graphemeBaseRegex.test (character) || (character === "\u32FF"))
                &&
                (
                    unicode.matchEastAsianWidth (character, [ 'F', 'W' ])
                    ||
                    (unicode.matchEastAsianWidth (character, [ 'A' ]) && unicode.matchVerticalOrientation (character, [ 'U' ]))
                )
            )
            {
                wideCharacters.push (character);
                state = 'base';
            }
            else if (variationSelectorRegex.test (character) && unicode.matchEastAsianWidth (character, [ 'A' ]))
            {
                if (state === 'base')
                {
                    wideCharacters[wideCharacters.length - 1] += character;
                    state = 'variation';
                }
            }
            else if (graphemeExtendRegex.test (character) && unicode.matchEastAsianWidth (character, [ 'F', 'W' ]))
            {
                if ((state === 'base') || (state === 'variation') || (state === 'extended'))
                {
                    wideCharacters[wideCharacters.length - 1] += character;
                    state = 'extended';
                }
            }
            else
            {
                state = 'start';
            }
        }
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
            headStyle.textContent = `#${unitId} .cjk-char { font-variant-east-asian: ${event.target.value}; }`;
        }
    );
    eastAsianSelect.dispatchEvent (new Event ('input'));
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.target.value;
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
            let characters = unicode.codePointsToCharacters (event.target.value);
            charactersInput.value = characters;
            createSheet (wideSplit (characters));
        }
    );
    codePointsInput.addEventListener
    (
        'blur',
        event =>
        {
            event.target.value = unicode.charactersToCodePoints (charactersInput.value, true);
        }
    );
    codePointsInput.addEventListener
    (
        'keypress',
        event =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                event.target.value = unicode.charactersToCodePoints (charactersInput.value, true);
            }
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
