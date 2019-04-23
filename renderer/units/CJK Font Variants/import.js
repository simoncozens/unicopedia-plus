//
const unit = document.getElementById ('cjk-font-variants-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const charactersSamples = unit.querySelector ('.characters-samples');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const eastAsianSelect = unit.querySelector ('.east-asian-select');
const cjkStrings = unit.getElementsByClassName ('cjk-string');
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
    const defaultPrefs =
    {
        charactersInput: "",
        eastAsianSelect: "",
        instructions: true,
        references: false,
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
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
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.target.value;
            codePointsInput.value = unicode.charactersToCodePoints (characters);
            for (let cjkString of cjkStrings)
            {
                cjkString.value = characters;
            }
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
            for (let cjkString of cjkStrings)
            {
                cjkString.value = characters;
            }
        }
    );
    codePointsInput.addEventListener
    (
        'blur',
        event =>
        {
            event.target.value = unicode.charactersToCodePoints (charactersInput.value);
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
                event.target.value = unicode.charactersToCodePoints (charactersInput.value);
            }
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
            for (let cjkString of cjkStrings)
            {
                cjkString.style.fontVariantEastAsian = event.target.value;
            }
        }
    );
    eastAsianSelect.dispatchEvent (new Event ('input'));
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
        eastAsianSelect: eastAsianSelect.value,
        instructions: instructions.open,
        references: references.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
