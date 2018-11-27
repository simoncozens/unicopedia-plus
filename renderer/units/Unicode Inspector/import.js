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
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const { remote } = require ('electron');
    const { app } = remote;
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
        instructions: true,
        defaultFolderPath: app.getPath ('documents')  // 'desktop'
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
            let cell;
            let header = document.createElement ('tr');
            cell = document.createElement ('th');
            cell.className = 'data-header-centered';
            cell.textContent = "Symbol";    // "Character"
            header.appendChild (cell);
            cell = document.createElement ('th');
            cell.className = 'data-header';
            cell.textContent = "Codes";
            header.appendChild (cell);
            cell = document.createElement ('th');
            cell.className = 'data-header';
            cell.textContent = "Properties";
            header.appendChild (cell);
            table.appendChild (header);
            for (let data of dataList)
            {
                let row = document.createElement ('tr');
                cell = document.createElement ('td');
                cell.className = 'symbol';
                cell.textContent = data.character;
                row.appendChild (cell);
                cell = document.createElement ('td');
                cell.className = 'codes';
                let codes =
                [
                    { label: "Code\xA0Point", value: data.codePoint },  // "Unicode"
                    { label: "JavaScript", value: data.javaScript },
                    { label: "ECMAScript\xA06", value: data.ecmaScript6 },
                    { label: "URL\xA0Escape", value: data.urlEncoding },
                    { label: "HTML\xA0Entity", value: data.entity },
                    null,
                    { label: "UTF-32", value: data.utf32 },
                    { label: "UTF-16", value: data.utf16 },
                    { label: "UTF-8", value: data.utf8 }
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
                        field.textContent = code.label + ": " + code.value;
                        cell.appendChild (field);
                    }
                }
                row.appendChild (cell);
                cell = document.createElement ('td');
                cell.className = 'properties';
                let name = data.name || "<unassigned>"; // "UNASSIGNED CHARACTER"
                let numericType = "";
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
                let properties =
                [
                    { label: "Name", value: name },
                    { label: "Alias", value: data.alias },
                    { label: "Correction", value: data.correction },
                    { label: "Age", value: data.age, toolTip: data.ageDate },
                    { label: "Plane", value: data.planeName, toolTip: data.planeRange },
                    { label: "Block", value: data.blockName, toolTip: data.blockRange },
                    { label: "Script", value: data.script },
                    { label: "Script\xA0Extensions", value: data.scriptExtensions },
                    { label: "General\xA0Category", value: data.category },
                    { label: "Combining\xA0Class", value: data.combining },
                    { label: "Bidirectional\xA0Class", value: data.bidi },
                    { label: "Decomposition", value: data.decomposition },
                    { label: "Mirrored", value: data.mirrored },
                    { label: numericType, value: data.numeric },
                    { label: "Uppercase", value: data.uppercase },
                    { label: "Lowercase", value: data.lowercase },
                    { label: "Titlecase", value: data.titlecase },
                    { label: "Binary\xA0Properties", value: data.binaryProperties },
                    { label: "Core\xA0Properties", value: data.coreProperties },
                    { label: "Equivalent\xA0Unified\xA0Ideograph", value: data.equivalentUnifiedIdeograph }
                ];
                for (let property of properties)
                {
                    if (property.value)
                    {
                        let field = document.createElement ('div');
                        field.className = 'field';
                        field.textContent = property.label + ": " + property.value;
                        if (property.toolTip)
                        {
                            field.title = property.toolTip;
                        }
                        cell.appendChild (field);
                    }
                }
                row.appendChild (cell);
                table.appendChild (row);
            }
            charactersDataList.appendChild (table);
        }
    }
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.target.value;
            codePointsInput.value = unicode.charactersToCodePoints (characters);
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
            let characters = unicode.codePointsToCharacters (event.target.value);
            charactersInput.value = characters;
            displayDataList (Array.from (characters), charactersData);
        }
    );
    //
    codePointsInput.addEventListener
    (
        'blur',
        event =>
        {
            event.target.value = unicode.charactersToCodePoints (charactersInput.value);
        }
    );
    //
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
