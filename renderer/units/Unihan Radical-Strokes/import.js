//
const unit = document.getElementById ('unihan-radical-strokes-unit');
//
const rsFullSetCheckbox = unit.querySelector ('.full-set-checkbox');
const rsExtraSourcesCheckbox = unit.querySelector ('.extra-sources-checkbox');
const rsRadicalSelect = unit.querySelector ('.radical-select');
const rsStrokesSelect = unit.querySelector ('.strokes-select');
const rsSearchButton = unit.querySelector ('.search-button');
const rsResultsButton = unit.querySelector ('.results-button');
const rsHitCount = unit.querySelector ('.hit-count');
const rsTotalCount = unit.querySelector ('.total-count');
const rsSearchData = unit.querySelector ('.search-data');
const rsInstructions = unit.querySelector ('.instructions');
const rsRadicalList = unit.querySelector ('.radical-list');
const rsRadicals = unit.querySelector ('.radicals');
//
const rsParams = { };
//
let rsCurrentRadical;
let rsCurrentStrokes;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    const { fromRadical, fromStrokes, fromRadicalStrokes } = require ('../../lib/unicode/get-rs-strings.js');
    //
    let unihanCount = unihanData.fullSet.length;
    //
    const defaultPrefs =
    {
        rsFullSetCheckbox: false,
        rsExtraSourcesCheckbox: false,
        rsRadicalSelect: "",
        rsStrokesSelect: "",
        rsCompactLayout: false,
        rsInstructions: true,
        rsRadicalList: false,
        //
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    function saveResults (string)
    {
        fileDialogs.saveTextFile
        (
            "Save text file:",
            [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
            defaultFolderPath,
            (filePath) =>
            {
                defaultFolderPath = path.dirname (filePath);
                return string;
            }
        );
    }
    //
    function clearSearch (data)
    {
        while (data.firstChild)
        {
            data.firstChild.remove ();
        }
    }
    //
    rsParams.compactLayout = prefs.rsCompactLayout;
    rsParams.observer = null;
    rsParams.root = unit;
    //
    const rsDataTable = require ('./rs-data-table.js');
    //
    rsFullSetCheckbox.checked = prefs.rsFullSetCheckbox;
    //
    rsExtraSourcesCheckbox.checked = prefs.rsExtraSourcesCheckbox;
    //
    rsCurrentRadical = prefs.rsRadicalSelect;
    rsCurrentStrokes = prefs.rsStrokesSelect;
    //
    let lastStrokes = 0;
    let optionGroup = null;
    kangxiRadicals.forEach
    (
        (radical, index) =>
        {
            if (lastStrokes !== radical.strokes)
            {
                if (optionGroup)
                {
                    rsRadicalSelect.appendChild (optionGroup);
                }
                optionGroup = document.createElement ('optgroup');
                optionGroup.label = `◎\xA0\xA0${fromRadicalStrokes (radical.strokes, true).replace (" ", "\u2002")}`;
                lastStrokes = radical.strokes;
            }
            let option = document.createElement ('option');
            option.textContent = `${fromRadical (index + 1).replace (/^(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002")}`;
            option.value = index + 1;
            optionGroup.appendChild (option);
        }
    );
    rsRadicalSelect.appendChild (optionGroup);
    //
    rsRadicalSelect.value = rsCurrentRadical;
    if (rsRadicalSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsRadicalSelect.selectedIndex = 0;
    }
    rsCurrentRadical = rsRadicalSelect.value;
    //
    rsRadicalSelect.addEventListener ('input', event => { rsCurrentRadical = event.currentTarget.value; });
    //
    const minStrokes = 0;
    const maxStrokes = 62;  // 𠔻 U+2053B kRSKangXi 12.62
    //
    let allOption = document.createElement ('option');
    allOption.textContent = "All";
    allOption.value = '*';
    rsStrokesSelect.appendChild (allOption);
    let separatorOption = document.createElement ('option');
    separatorOption.textContent = "\u2015";   // Horizontal bar
    separatorOption.disabled = true;
    rsStrokesSelect.appendChild (separatorOption);
    for (let strokesIndex = minStrokes; strokesIndex <= maxStrokes; strokesIndex++)
    {
        let option = document.createElement ('option');
        option.textContent = strokesIndex;
        rsStrokesSelect.appendChild (option);
    }
    //
    rsStrokesSelect.value = rsCurrentStrokes;
    if (rsStrokesSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsStrokesSelect.selectedIndex = 0;
    }
    rsCurrentStrokes = rsStrokesSelect.value;
    //
    rsStrokesSelect.addEventListener ('input', event => { rsCurrentStrokes = event.currentTarget.value; });
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
    function getFullRSTooltip (codePoint, verbose)
    {
        let tags = unihanData.codePoints[codePoint];
        //
        let rsValues = [ ];
        let rsIRGCount = 0;
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
        rsValues = rsValues.map ((rsValue, index) => ((index < rsIRGCount) ? "●\xA0\xA0" : "○\xA0\xA0") + fromRSValue (rsValue, verbose).join (" +\xA0"));
        //
        return rsValues.join ("\n");
    }
    //
    function findCharactersByRadicalStrokes (options)
    {
        let items = [ ];
        for (let strokes = options.minStrokes; strokes <= options.maxStrokes; strokes++)
        {
            items.push ({ shortTitle: fromStrokes (strokes), longTitle: fromStrokes (strokes, true), characters: [ ] });
        }
        let codePoints = unihanData.codePoints;
        let set = options.fullSet ? unihanData.fullSet : unihanData.coreSet;
        for (let codePoint of set)
        {
            let rsValues = [ ];
            let irgSourceValues = null;
            for (let rsTag of rsTags)
            {
                let rsTagValues = codePoints[codePoint][rsTag];
                if (rsTagValues)
                {
                    if (!Array.isArray (rsTagValues))
                    {
                        rsTagValues = [ rsTagValues ];
                    }
                    if (rsTag == "kRSUnicode")
                    {
                        irgSourceValues = [...rsTagValues];
                    }
                    else if (!options.extraSources)
                    {
                        break;
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
            // Remove duplicates
            rsValues = [...new Set (rsValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            irgSourceValues = [...new Set (irgSourceValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            for (let rsValue of rsValues)
            {
                let [ tagRadical, tagResidual ] = rsValue.split (".");
                if (parseInt (tagRadical) === options.radical)
                {
                    let residualStrokes = parseInt (tagResidual);
                    if ((options.minStrokes <= residualStrokes) && (residualStrokes <= options.maxStrokes))
                    {
                        let code = codePoint.replace ("U+", "");
                        let character = { symbol: String.fromCodePoint (parseInt (code, 16)), code: code };
                        if (options.extraSources)
                        {
                            let extraSource = !irgSourceValues.includes (rsValue);
                            if (extraSource)
                            {
                                character.extraSource = extraSource;
                            }
                        }
                        character.toolTip = getFullRSTooltip (codePoint);
                        items[residualStrokes - options.minStrokes].characters.push (character);
                    }
                }
            }
        }
        return items;
    }
    //
    function updateRadicalStrokesResults (hitCount, totalCount)
    {
        rsHitCount.textContent = hitCount;
        rsTotalCount.textContent = totalCount;
        rsResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentCharactersByRadicalStrokes = [ ];
    //
    rsSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearSearch (rsSearchData);
            let findOptions =
            {
                fullSet: rsFullSetCheckbox.checked,
                extraSources: rsExtraSourcesCheckbox.checked,
                radical: parseInt (rsCurrentRadical),
                minStrokes: (rsCurrentStrokes === '*') ? minStrokes : parseInt (rsCurrentStrokes),
                maxStrokes: (rsCurrentStrokes === '*') ? maxStrokes : parseInt (rsCurrentStrokes)
            };
            let characters = [ ];
            let items = findCharactersByRadicalStrokes (findOptions);
            for (let item of items)
            {
                for (let character of item.characters)
                {
                    characters.push (character.symbol);
                }
            };
            currentCharactersByRadicalStrokes = characters;
            updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
            if (characters.length > 0)
            {
                let title = fromRadical (rsRadicalSelect.selectedIndex + 1, false, true).replace (/^(\S+)\s(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002$3\u2002");
                rsSearchData.appendChild (rsDataTable.create (title, items, rsParams));
            }
        }
    );
    //
    let rsResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByRadicalStrokes.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByRadicalStrokes.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByRadicalStrokes.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (rsSearchData);
                    currentCharactersByRadicalStrokes = [ ];
                    updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
                }
            }
        ]
    );
    //
    rsResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, rsResultsMenu);
        }
    );
    //
    updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
    //
    rsInstructions.open = prefs.rsInstructions;
    rsRadicalList.open = prefs.rsRadicalList;
    //
    let radicalsTable = require ('./radicals-table.js');
    //
    rsRadicals.appendChild (radicalsTable.create (kangxiRadicals));
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        rsFullSetCheckbox: rsFullSetCheckbox.checked,
        rsExtraSourcesCheckbox: rsExtraSourcesCheckbox.checked,
        rsRadicalSelect: rsCurrentRadical,
        rsStrokesSelect: rsCurrentStrokes,
        rsCompactLayout: rsParams.compactLayout,
        rsInstructions: rsInstructions.open,
        rsRadicalList: rsRadicalList.open,
        //
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
