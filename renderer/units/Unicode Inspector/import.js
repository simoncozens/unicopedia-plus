//
const unit = document.getElementById ('unicode-inspector-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
//
const charactersClear = unit.querySelector ('.characters-clear');
const charactersSamples = unit.querySelector ('.characters-samples');
const inputCharacters = unit.querySelector ('.input-characters');
const outputCodePoints = unit.querySelector ('.output-code-points');
const outputCharactersData = unit.querySelector ('.output-characters-data');
//
const codePointsClear = unit.querySelector ('.code-points-clear');
const codePointsSamples = unit.querySelector ('.code-points-samples');
const codePointsFilter = unit.querySelector ('.code-points-filter');
const inputCodePoints = unit.querySelector ('.input-code-points');
const outputCharacters = unit.querySelector ('.output-characters');
const outputCodePointsData = unit.querySelector ('.output-code-points-data');
//
const instructions = unit.querySelector ('.instructions');
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const defaultPrefs =
    {
        tabName: "",
        inputCharacters: "",
        inputCodePoints: "",
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    function updateTab (tabName)
    {
        let foundIndex = 0;
        tabs.forEach
        (
            (tab, index) =>
            {
                let match = (tab.parentElement.textContent === tabName);
                if (match)
                {
                    foundIndex = index;
                }
                else
                {
                    tab.checked = false;
                    tabPanes[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.target.parentElement.textContent); });
    }
    //
    charactersClear.addEventListener
    (
        'click',
        (event) =>
        {
            inputCharacters.value = "";
            inputCharacters.dispatchEvent (new Event ('input'));
            inputCharacters.focus ();
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
            inputCharacters.value = sample.string;
            inputCharacters.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), charactersMenu);
        }
    );
    //
    function displayDataList (characters, outputData)
    {
        while (outputData.firstChild)
        {
           outputData.firstChild.remove ();
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
                    { label: "ECMAScript", value: data.ecmaScript },
                    { label: "JavaScript", value: data.javaScript },
                    { label: "HTML\xA0Entity", value: data.entity },
                    { label: "URL\xA0Escape", value: data.urlEncoding },
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
                    { label: "Combining", value: data.combining },
                    { label: "Bidirectional", value: data.bidirectional },
                    { label: "Decomposition", value: data.decomposition },
                    { label: "Mirrored", value: data.mirrored },
                    { label: numericType, value: data.numeric },
                    { label: "Uppercase", value: data.uppercase },
                    { label: "Lowercase", value: data.lowercase },
                    { label: "Titlecase", value: data.titlecase },
                    { label: "Binary\xA0Properties", value: data.binaryProperties },
                    { label: "Core\xA0Properties", value: data.coreProperties }
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
            outputData.appendChild (table);
        }
    }
    //
    inputCharacters.addEventListener
    (
        'input',
        (event) =>
        {
            outputCodePoints.value = unicode.charactersToCodePoints (event.target.value);
            displayDataList (Array.from (event.target.value), outputCharactersData);
        }
    );
    inputCharacters.value = prefs.inputCharacters;
    inputCharacters.dispatchEvent (new Event ('input'));
    //
    codePointsClear.addEventListener
    (
        'click',
        (event) =>
        {
            inputCodePoints.value = "";
            inputCodePoints.dispatchEvent (new Event ('input'));
            inputCodePoints.focus ();
        }
    );
    //
    let codePointsMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            inputCodePoints.value = unicode.charactersToCodePoints (sample.string);
            inputCodePoints.dispatchEvent (new Event ('input'));
        }
    );
    //
    codePointsSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), codePointsMenu);
        }
    );
    //
    codePointsFilter.addEventListener
    (
        'click',
        (event) =>
        {
            inputCodePoints.value = unicode.charactersToCodePoints (outputCharacters.textContent);
            inputCodePoints.dispatchEvent (new Event ('input'));
        }
    );
    //
    inputCodePoints.addEventListener
    (
        'input',
        (event) =>
        {
            let characters = unicode.codePointsToCharacters (event.target.value);
            outputCharacters.textContent = characters;
            displayDataList (Array.from (characters), outputCodePointsData);
        }
    );
    inputCodePoints.value = prefs.inputCodePoints;
    inputCodePoints.dispatchEvent (new Event ('input'));
    //
    instructions.open = prefs.instructions;
};
//
module.exports.stop = function (context)
{
    function getCurrentTabName ()
    {
        let currentTabName = "";
        for (let tab of tabs)
        {
            if (tab.checked)
            {
                currentTabName = tab.parentElement.textContent;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        inputCharacters: inputCharacters.value,
        inputCodePoints: inputCodePoints.value,
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
