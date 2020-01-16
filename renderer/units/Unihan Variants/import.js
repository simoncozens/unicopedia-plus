//
const unit = document.getElementById ('unihan-variants-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
const extraVariantsCheckbox = unit.querySelector ('.extra-variants-checkbox');
const detailedRelationsCheckbox = unit.querySelector ('.detailed-relations-checkbox');
const linearCharacter = unit.querySelector ('.linear-character');
const linearVariants = unit.querySelector ('.linear-variants');
const saveSVGButton = unit.querySelector ('.save-svg-button');
const graphContainer = unit.querySelector ('.graph-container');
//
const instructions = unit.querySelector ('.instructions');
//
const unihanHistorySize = 256;   // 0: unlimited
//
let unihanHistory = [ ];
let unihanHistoryIndex = -1;
let unihanHistorySave = null;
//
let currentUnihanCharacter;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    // https://github.com/mdaines/viz.js/wiki/Usage
    // https://github.com/mdaines/viz.js/wiki/Caveats
    //
    const Viz = require ('viz.js');
    const { Module, render } = require ('viz.js/full.render.js');
    //
    let viz = new Viz ({ Module, render });
    //
    const dotTemplate = fs.readFileSync (path.join (__dirname, 'template.dot'), { encoding: 'utf8' });
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        extraVariantsCheckbox: false,
        detailedRelationsCheckbox: false,
        defaultFolderPath: context.defaultFolderPath,
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    // Unihan characters
    const unihanPattern = '(?:(?=\\p{Script=Han})(?=\\p{Other_Letter}).)';
    const unihanRegex = new RegExp (unihanPattern, 'u');
    //
    const unifiedPattern = '\\p{Unified_Ideograph}';
    const unifiedRegex = new RegExp (unifiedPattern, 'u');
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
            if (!unihanRegex.test (character))
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
    function getTooltip (character)
    {
        let data = unicode.getCharacterBasicData (character);
        let status = unifiedRegex.test (character) ? "Unified Ideograph" : "Compatibility Ideograph";
        return `Code Point: ${data.codePoint}\nAge: Unicode ${data.age} (${data.ageDate})\nStatus: ${status}`;
    }
    //
    let variantTags =
    [
        'kCompatibilityVariant',
        'kSemanticVariant',
        'kSimplifiedVariant',
        'kSpecializedSemanticVariant',
        'kTraditionalVariant',
        'kZVariant'
    ];
    //
    function getVariantRelations (character)
    {
        let relations = [ ];
        for (let codePoint of unihanData.fullSet)
        {
            let setCharacter = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
            let codePointData = unihanData.codePoints[codePoint];
            for (let variantTag of variantTags)
            {
                if (variantTag in codePointData)
                {
                    let variants = codePointData[variantTag];
                    if (!Array.isArray (variants))
                    {
                        variants = [ variants ];
                    }
                    for (let variant of variants)
                    {
                        variant = variant.split ("<")[0];
                        let variantCharacter = String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16));
                        if (setCharacter === character)
                        {
                            relations.push ({ to: variantCharacter, tag: variantTag });
                        }
                        else if (character === variantCharacter)
                        {
                            relations.push ({ from: setCharacter, tag: variantTag });
                        }
                    }
                }
            }
            if (extraVariantsCheckbox.checked)
            {
                // Yasuoka Variants
                let variants = yasuokaVariants[codePoint] || [ ];
                for (let variant of variants)
                {
                    if (variant in unihanData.codePoints)
                    {
                        let variantCharacter = String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16));
                        if (setCharacter === character)
                        {
                            relations.push ({ to: variantCharacter, tag: 'kYasuokaVariant' });
                        }
                        else if (character === variantCharacter)
                        {
                            relations.push ({ from: setCharacter, tag: 'kYasuokaVariant' });
                        }
                    }
                }
            }
        }
        return relations;
    }
    //
    let shortLabels =
    {
        'kCompatibilityVariant': " Unified ",
        'kSemanticVariant': " Semantic ",
        'kSimplifiedVariant': " Simplified ",
        'kSpecializedSemanticVariant': " Specialized ",
        'kTraditionalVariant': " Traditional ",
        'kZVariant': " Shape ",
        'kYasuokaVariant': " Yasuoka "
    };
    //
    let svgResult;
    //
    function displayData (character)
    {
        svgResult = "";
        saveSVGButton.disabled = true;
        // linearCharacter.textContent = "";
        while (linearCharacter.firstChild)
        {
            linearCharacter.firstChild.remove ();
        }
        // linearVariants.textContent = "";
        while (linearVariants.firstChild)
        {
            linearVariants.firstChild.remove ();
        }
        while (graphContainer.firstChild)
        {
            graphContainer.firstChild.remove ();
        }
        currentUnihanCharacter = character;
        if (character)
        {
            let indexOfUnihanCharacter = unihanHistory.indexOf (character);
            if (indexOfUnihanCharacter !== -1)
            {
                unihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            unihanHistory.unshift (character);
            if ((unihanHistorySize > 0) && (unihanHistory.length > unihanHistorySize))
            {
                unihanHistory.pop ();
            }
            unihanHistoryIndex = -1;
            unihanHistorySave = null;
            let symbols = document.createElement ('div');
            symbols.className = 'symbols';
            let symbol = document.createElement ('span');
            symbol.className = 'symbol';
            symbol.title = getTooltip (character);
            symbol.textContent = character;
            symbols.appendChild (symbol);
            linearCharacter.appendChild (symbols);
            let relations = getVariantRelations (character);
            // console.log (relations);
            let variants = [ ];
            for (let relation of relations)
            {
                if ("to" in relation)
                {
                    variants.push (relation["to"]);
                }
                else if ("from" in relation)
                {
                    variants.push (relation["from"]);
                }
            }
            variants = [...new Set (variants.filter (variant => variant !== character))].sort ((a, b) => a.codePointAt (0) - b.codePointAt (0));
            // console.log (variants);
            if (variants.length > 0)
            {
                let symbols = document.createElement ('div');
                symbols.className = 'symbols';
                for (let variant of variants)
                {
                    let symbol = document.createElement ('span');
                    symbol.className = 'symbol';
                    symbol.title = getTooltip (variant);
                    symbol.textContent = variant;
                    symbols.appendChild (symbol);
                }
                linearVariants.appendChild (symbols);
            }
            try
            {
                let data = `${character} [ style = bold, tooltip = ${JSON.stringify (getTooltip (character))} ];`;
                data += variants.map (variant => `${variant} [ tooltip = ${JSON.stringify (getTooltip (variant))} ];`).join ("");
                if (detailedRelationsCheckbox.checked)
                {
                    let toCharacters = { };
                    let fromCharacters = { };
                    for (let relation of relations)
                    {
                        if ("to" in relation)
                        {
                            let toCharacter = relation["to"];
                            if (!(toCharacter in toCharacters))
                            {
                                toCharacters[toCharacter] = [ ];
                            }
                            toCharacters[toCharacter].push (relation["tag"]);
                        }
                        else if ("from" in relation)
                        {
                            let fromCharacter = relation["from"];
                            if (!(fromCharacter in fromCharacters))
                            {
                                fromCharacters[fromCharacter] = [ ];
                            }
                            fromCharacters[fromCharacter].push (relation["tag"]);
                        }
                    }
                    // console.log (toCharacters, fromCharacters);
                    for (let toCharacter in toCharacters)
                    {
                        let tags = toCharacters[toCharacter];
                        for (let tag of tags)
                        {
                            if ((tag !== 'kYasuokaVariant') || (tags.length === 1))
                            {
                                data += `${character} -> ${toCharacter} [ label = ${JSON.stringify (shortLabels[tag])} ];`;
                            }
                        }
                    }
                    for (let fromCharacter in fromCharacters)
                    {
                        let tags = fromCharacters[fromCharacter];
                        for (let tag of tags)
                        {
                            if ((tag !== 'kYasuokaVariant') || (tags.length === 1))
                            {
                                data += `${fromCharacter} -> ${character} [ label = ${JSON.stringify (shortLabels[tag])} ];`;
                            }
                        }
                    }
                }
                else
                {
                    data += variants.map (variant => `${character} -- ${variant};`).join ("");
                }
                // console.log (data);
                viz.renderString
                (
                    dotTemplate
                    .replace ('{{graph}}', detailedRelationsCheckbox.checked ? 'digraph' : 'graph')
                    .replace ('{{rankdir}}', detailedRelationsCheckbox.checked ? 'LR' : 'TB')
                    .replace ('{{data}}', data),
                    { engine: 'dot', format: 'svg' }
                )
                .then
                (
                    result =>
                    {
                        svgResult = result;
                        graphContainer.innerHTML = svgResult;
                        saveSVGButton.disabled = false;
                    }
                );
            }
            catch (e)
            {
            }
        }
    }
    //
    function updateUnihanData (character)
    {
        unihanInput.value = "";
        unihanInput.dispatchEvent (new Event ('input'));
        displayData (character);
        unit.scrollTop = 0;
    }
    //
    graphContainer.addEventListener
    (
        'click',
        (event) =>
        {
            let aTag = event.target.closest ('a');
            if (aTag)
            {
                event.preventDefault ();
                let character = aTag.querySelector ('text').textContent;
                if (character != currentUnihanCharacter)
                {
                    updateUnihanData (character);
                }
            }
        }
    );
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
    extraVariantsCheckbox.checked = prefs.extraVariantsCheckbox;
    extraVariantsCheckbox.addEventListener ('click', (event) => { updateUnihanData (currentUnihanCharacter); });
    //
    detailedRelationsCheckbox.checked = prefs.detailedRelationsCheckbox;
    detailedRelationsCheckbox.addEventListener ('click', (event) => { updateUnihanData (currentUnihanCharacter); });
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    saveSVGButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save SVG file:",
                [ { name: "SVG File (*.svg)", extensions: [ 'svg' ] } ],
                path.join (defaultFolderPath, `${currentUnihanCharacter}-Variants.svg`),
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return svgResult;
                }
            );
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
        extraVariantsCheckbox: extraVariantsCheckbox.checked,
        detailedRelationsCheckbox: detailedRelationsCheckbox.checked,
        defaultFolderPath: defaultFolderPath,
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
