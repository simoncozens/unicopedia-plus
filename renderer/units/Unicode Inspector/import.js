//
const unit = document.getElementById ('unicode-inspector-unit');
//
const charactersClear = unit.querySelector ('.characters-clear');
const charactersSamples = unit.querySelector ('.characters-samples');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const charactersData = unit.querySelector ('.characters-data');
//
const instructions = unit.querySelector ('.instructions');
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
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const numericValuesData = require ('../../lib/unicode/parsed-numeric-values-data.js');
    //
    const defaultPrefs =
    {
        charactersInput: "",
        instructions: true,
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    charactersClear.addEventListener
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
    function displayDataList (characters, charactersDataList)
    {
        while (charactersDataList.firstChild)
        {
           charactersDataList.firstChild.remove ();
        }
        let dataList = unicode.getCharactersData (characters);
        if (dataList.length > 0)
        {
            let table = document.createElement ('table');
            table.className = 'data-list';
            dataList.forEach
            (
                (data, index) =>
                {
                    if (index > 0)
                    {
                        let emptyRow = document.createElement ('tr');
                        emptyRow.className = 'empty-row';
                        let emptyCell = document.createElement ('td');
                        emptyCell.className = 'empty-cell';
                        emptyCell.setAttribute ('colspan', 3);
                        emptyRow.appendChild (emptyCell);
                        table.appendChild (emptyRow);
                    }
                    let row = document.createElement ('tr');
                    row.className = 'row';
                    let cell = document.createElement ('td');
                    cell.className = 'symbol';
                    cell.textContent = data.character;
                    row.appendChild (cell);
                    cell = document.createElement ('td');
                    cell.className = 'codes';
                    let codes =
                    [
                        { name: "Code Point", value: data.codePoint },
                        { name: "JavaScript", value: data.javaScript },
                        { name: "ECMAScript 6", value: data.ecmaScript6 },
                        { name: "URL Escape", value: data.urlEncoding },
                        { name: "HTML Entity", value: data.entity },
                        null,
                        { name: "UTF-32", value: data.utf32 },
                        { name: "UTF-16", value: data.utf16 },
                        { name: "UTF-8", value: data.utf8 }
                    ];
                    for (let code of codes)
                    {
                        if (!code)
                        {
                            let lineBreak = document.createElement ('br');
                            cell.appendChild (lineBreak);
                        }
                        else if (code.value)
                        {
                            let field = document.createElement ('div');
                            field.className = 'field';
                            let name = document.createElement ('span');
                            name.className = 'name';
                            name.textContent = code.name.replace (/ /g, "\xA0");
                            field.appendChild (name);
                            field.appendChild (document.createTextNode (": "));
                            let value = document.createElement ('span');
                            value.className = 'value';
                            value.textContent = code.value.replace (/ /g, "\xA0");
                            field.appendChild (value);
                            cell.appendChild (field);
                        }
                    }
                    row.appendChild (cell);
                    cell = document.createElement ('td');
                    cell.className = 'properties';
                    let name = data.name || "<unassigned>"; // "UNASSIGNED CHARACTER"
                    let numericType = "";
                    let numericValue = "";
                    if (data.numeric)
                    {
                        numericType = "Numeric";
                        if (data.digit)
                        {
                            numericType = "Digit";
                            if (data.decimal)
                            {
                                numericType = "Decimal";
                            }
                        }
                    }
                    else
                    {
                        numericValue = numericValuesData[data.codePoint] || "";
                    }
                    let properties =
                    [
                        { name: "Name", value: name },
                        { name: "Alias", value: data.alias },
                        { name: "Correction", value: data.correction },
                        { name: "Age", value: data.age, toolTip: data.ageDate },
                        { name: "Plane", value: data.planeName, toolTip: data.planeRange },
                        { name: "Block", value: data.blockName, toolTip: data.blockRange },
                        { name: "Script", value: data.script },
                        { name: "Script Extensions", value: data.scriptExtensions },
                        { name: "General Category", value: data.category },
                        { name: "Combining Class", value: data.combining },
                        { name: "Bidirectional Class", value: data.bidi },
                        { name: "Mirrored", value: data.mirrored },
                        { name: "Decomposition", value: data.decomposition },
                        { name: "Uppercase", value: data.uppercase },
                        { name: "Lowercase", value: data.lowercase },
                        { name: "Titlecase", value: data.titlecase },
                        { name: numericType, value: data.numeric },
                        { name: "Numeric Value", value: numericValue },
                        { name: "East Asian Width", value: data.eastAsianWidth },
                        { name: "Vertical Orientation", value: data.verticalOrientation },
                        { name: "Equivalent Unified Ideograph", value: data.equivalentUnifiedIdeograph },
                        { name: "Core Properties", value: data.coreProperties },
                        { name: "Extended Properties", value: data.extendedProperties },
                        { name: "Emoji Properties", value: data.emojiProperties }
                    ];
                    //
                    function appendText (node, text)
                    {
                        text = text.replace (/ (.)$/, "\u00A0$1");
                        let regex = /\b\w+(-\w+)+\b/;
                        let matches;
                        while (matches = text.match (regex))
                        {
                            node.appendChild (document.createTextNode (text.slice (0, matches.index)));
                            let noWrap = document.createElement ('span');
                            noWrap.style = 'white-space: nowrap;';
                            noWrap.textContent = matches[0];
                            node.appendChild (noWrap);
                            text = text.slice (matches.index + matches[0].length);
                        }
                        node.appendChild (document.createTextNode (text));
                    }
                    //
                    for (let property of properties)
                    {
                        if (property.value)
                        {
                            let field = document.createElement ('div');
                            field.className = 'field';
                            if (property.toolTip)
                            {
                                field.title = property.toolTip;
                            }
                            let name = document.createElement ('span');
                            name.className = 'name';
                            name.textContent = property.name.replace (/ /g, "\xA0");
                            field.appendChild (name);
                            field.appendChild (document.createTextNode (": "));
                            let value = document.createElement ('span');
                            value.className = 'value';
                            // appendText (value, property.value);
                            value.textContent = property.value;
                            field.appendChild (value);
                            cell.appendChild (field);
                        }
                    }
                    row.appendChild (cell);
                    table.appendChild (row);
                }
            );
            charactersDataList.appendChild (table);
        }
    }
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            codePointsInput.value = unicode.charactersToCodePoints (characters, true);
            displayDataList (Array.from (characters), charactersData);
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
            displayDataList (Array.from (characters), charactersData);
        }
    );
    codePointsInput.addEventListener
    (
        'blur',
        event =>
        {
            event.currentTarget.value = unicode.charactersToCodePoints (charactersInput.value, true);
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
                event.currentTarget.value = unicode.charactersToCodePoints (charactersInput.value, true);
            }
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
        charactersInput: charactersInput.value,
        instructions: instructions.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
