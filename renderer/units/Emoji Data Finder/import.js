//
const unit = document.getElementById ('emoji-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const nameSearchString = unit.querySelector ('.find-by-name .search-string');
const nameSearchMessage = unit.querySelector ('.find-by-name .search-message');
const nameWholeWord = unit.querySelector ('.find-by-name .whole-word');
const nameUseRegex = unit.querySelector ('.find-by-name .use-regex');
const nameSearchButton = unit.querySelector ('.find-by-name .search-button');
const nameResultsButton = unit.querySelector ('.find-by-name .results-button');
const nameHitCount = unit.querySelector ('.find-by-name .hit-count');
const nameTotalCount = unit.querySelector ('.find-by-name .total-count');
const nameEmojiDataList = unit.querySelector ('.find-by-name .emoji-data-list');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const sequenceSearchString = unit.querySelector ('.match-sequence .search-string');
const sequenceSearchMessage = unit.querySelector ('.match-sequence .search-message');
const sequenceUseRegex = unit.querySelector ('.match-sequence .use-regex');
const sequenceSearchButton = unit.querySelector ('.match-sequence .search-button');
const sequenceResultsButton = unit.querySelector ('.match-sequence .results-button');
const sequenceHitCount = unit.querySelector ('.match-sequence .hit-count');
const sequenceTotalCount = unit.querySelector ('.match-sequence .total-count');
const sequenceEmojiDataList = unit.querySelector ('.match-sequence .emoji-data-list');
const sequenceInstructions = unit.querySelector ('.match-sequence .instructions');
const sequenceRegexExamples = unit.querySelector ('.match-sequence .regex-examples');
//
const textClearButton = unit.querySelector ('.filter-text .clear-button');
const textEmojiSamples = unit.querySelector ('.filter-text .emoji-samples');
const textFilterButton = unit.querySelector ('.filter-text .filter-button');
const textInputString = unit.querySelector ('.filter-text .input-string');
const textResultsButton = unit.querySelector ('.filter-text .results-button');
const textHitCount = unit.querySelector ('.filter-text .hit-count');
const textTotalCount = unit.querySelector ('.filter-text .total-count');
const textEmojiDataList = unit.querySelector ('.filter-text .emoji-data-list');
const textInstructions = unit.querySelector ('.filter-text .instructions');
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
    const sampleMenus = require ('../../lib/sample-menus.js');
    const regexUnicode = require ('../../lib/regex-unicode.js');
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        nameSearchString: "",
        nameWholeWord: false,
        nameUseRegex: false,
        nameInstructions: true,
        nameRegexExamples: false,
        //
        sequenceSearchString: "",
        sequenceUseRegex: false,
        sequenceInstructions: true,
        sequenceRegexExamples: false,
        //
        textInputString: "",
        textInstructions: true,
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
                    tabInfos[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
        tabInfos[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.currentTarget.parentElement.textContent); });
    }
    //
    const emojiList = require ('emoji-test-list');
    const emojiKeys = Object.keys (emojiList).sort ().reverse ();
    //
    const cldrAnnotations = require ('../../lib/unicode/get-cldr-annotations.js') ("en.xml");
    //
    function getEmojiCodePoints (emoji)
    {
        return "<" + emojiList[emoji].code.replace (/\b([0-9a-fA-F]{4,})\b/g, "U\+$&").split (" ").join (", ") + ">";
    }
    //
    function getEmojiShortName (emoji)
    {
        emoji = emoji.replace (/\uFE0F/g, "");
        return (emoji in cldrAnnotations) ? cldrAnnotations[emoji].shortName : emojiList[emoji].name;
    }
    //
    function getEmojiKeywords (emoji)
    {
        emoji = emoji.replace (/\uFE0F/g, "");
        return (emoji in cldrAnnotations) ? cldrAnnotations[emoji].keywords : [ ];
    }
    //
    function findEmojiByName (regex)
    {
        let emojiByName = [ ];
        for (let emoji in emojiList)
        {
            if (getEmojiShortName (emoji).match (regex))
            {
                emojiByName.push (emoji);
            }
            else
            {
                for (let keyword of getEmojiKeywords (emoji))
                {
                    if (keyword.match (regex))
                    {
                        emojiByName.push (emoji);
                        break;
                    }
                }
            }
        }
        return emojiByName;
    }
    //
    function findEmojiBySequence (regex)
    {
        let emojiBySequence = [ ];
        for (let emoji in emojiList)
        {
            if (regex.test (emoji))
            {
                emojiBySequence.push (emoji);
            }
        }
        return emojiBySequence;
    }
    //
    const versionDates =
    {
        "1.0": "August 2015",
        "2.0": "November 2015",
        "3.0": "June 2016",
        "4.0": "November 2016",
        "5.0": "May 2017",
        "11.0": "June 2018",
        "12.0": "March 2019",
        "12.1": "October 2019"
    };
    //
    function updateDataList (characters, emojiDataList)
    {
        while (emojiDataList.firstChild)
        {
            emojiDataList.firstChild.remove ();
        }
        for (let character of characters)
        {
            let emojiTable = document.createElement ('table');
            emojiTable.className = 'emoji-table';
            let firstRow = document.createElement ('tr');
            let emojiData = document.createElement ('td');
            emojiData.className = 'emoji-data';
            emojiData.rowSpan = 2;
            let emoji = document.createElement ('div');
            emoji.className = 'emoji';
            emoji.textContent = character;
            emojiData.appendChild (emoji);
            firstRow.appendChild (emojiData);
            let namesData = document.createElement ('td');
            namesData.className = 'names-data';
            let shortName = document.createElement ('div');
            shortName.className = 'short-name';
            shortName.textContent = getEmojiShortName (character);
            namesData.appendChild (shortName);
            let keywords = document.createElement ('div');
            keywords.className = 'keywords';
            keywords.textContent = getEmojiKeywords (character).join (", ");
            namesData.appendChild (keywords);
            emojiTable.appendChild (firstRow);
            firstRow.appendChild (namesData);
            let secondRow = document.createElement ('tr');
            let codesData = document.createElement ('td');
            codesData.className = 'codes-data';
            let codes = document.createElement ('div');
            codes.className = 'codes';
            codes.textContent = getEmojiCodePoints (character);
            codesData.appendChild (codes);
            let status;
            if (emojiList[character].isComponent)
            {
                status = "Component";
            }
            else if (emojiList[character].toFullyQualified)
            {
                status = "Non Fully Qualified (Display/Process)";
            }
            else
            {
                status = "Fully Qualified (Keyboard/Palette)";
            }
            let age = emojiList[character].age;
            emojiTable.title = `Age: Emoji ${age} (${versionDates[age]})\nStatus: ${status}`;
            if (emojiList[character].toFullyQualified)
            {
                emoji.classList.add ('non-fully-qualified');
                shortName.classList.add ('non-fully-qualified');
                keywords.classList.add ('non-fully-qualified');
                codes.classList.add ('non-fully-qualified');
            }
            secondRow.appendChild (codesData);
            emojiTable.appendChild (secondRow);
            emojiDataList.appendChild (emojiTable);
        }
    }
    //
    nameWholeWord.checked = prefs.nameWholeWord;
    nameUseRegex.checked = prefs.nameUseRegex;
    //
    nameSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                nameSearchButton.click ();
            }
        }
    );
    nameSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                nameSearchMessage.classList.add ('shown');
            }
        }
    );
    nameSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                nameSearchMessage.classList.remove ('shown');
            }
        }
    );
    nameSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('error');
            nameSearchMessage.textContent = "";
            nameSearchMessage.classList.remove ('shown');
            if (nameUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.currentTarget.value, { useRegex: nameUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    nameSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
                    {
                        nameSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    nameSearchString.value = prefs.nameSearchString;
    nameSearchString.dispatchEvent (new Event ('input'));
    //
    nameUseRegex.addEventListener
    (
        'change',
        (event) => nameSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function updateNameResults (hitCount, totalCount)
    {
        nameHitCount.textContent = hitCount;
        nameTotalCount.textContent = totalCount;
        nameResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentEmojiByName = [ ];
    //
    nameSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!nameSearchString.classList.contains ('error'))
            {
                let name = nameSearchString.value;
                if (name)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (name, { wholeWord: nameWholeWord.checked, useRegex: nameUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        currentEmojiByName = findEmojiByName (regex);
                        updateNameResults (currentEmojiByName.length, emojiKeys.length);
                        updateDataList (currentEmojiByName, nameEmojiDataList);
                    }
                }
            }
            else
            {
                remote.shell.beep ();
            }
        }
    );
    //
    let nameResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentEmojiByName.length > 0)
                    {
                        remote.clipboard.writeText (currentEmojiByName.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentEmojiByName.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    currentEmojiByName = [ ];
                    updateNameResults (currentEmojiByName.length, emojiKeys.length);
                    updateDataList (currentEmojiByName, nameEmojiDataList);
                }
            }
        ]
    );
    //
    nameResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, nameResultsMenu);
        }
    );
    //
    updateNameResults (currentEmojiByName.length, emojiKeys.length);
    //
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    sequenceUseRegex.checked = prefs.sequenceUseRegex;
    //
    sequenceSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                sequenceSearchButton.click ();
            }
        }
    );
    sequenceSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                sequenceSearchMessage.classList.add ('shown');
            }
        }
    );
    sequenceSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                sequenceSearchMessage.classList.remove ('shown');
            }
        }
    );
    sequenceSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('error');
            sequenceSearchMessage.textContent = "";
            sequenceSearchMessage.classList.remove ('shown');
            if (sequenceUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.currentTarget.value, { useRegex: sequenceUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    sequenceSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
                    {
                        sequenceSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    sequenceSearchString.value = prefs.sequenceSearchString;
    sequenceSearchString.dispatchEvent (new Event ('input'));
    //
    sequenceUseRegex.addEventListener
    (
        'change',
        (event) => sequenceSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function updateSequenceResults (hitCount, totalCount)
    {
        sequenceHitCount.textContent = hitCount;
        sequenceTotalCount.textContent = totalCount;
        sequenceResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentEmojiBySequence = [ ];
    //
    sequenceSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!sequenceSearchString.classList.contains ('error'))
            {
                let sequence = sequenceSearchString.value;
                if (sequence)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (sequence, { useRegex: sequenceUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        currentEmojiBySequence = findEmojiBySequence (regex);
                        updateSequenceResults (currentEmojiBySequence.length, emojiKeys.length);
                        updateDataList (currentEmojiBySequence, sequenceEmojiDataList);
                    }
                }
            }
            else
            {
                remote.shell.beep ();
            }
        }
    );
    //
    let sequenceResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentEmojiBySequence.length > 0)
                    {
                        remote.clipboard.writeText (currentEmojiBySequence.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentEmojiBySequence.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    currentEmojiBySequence = [ ];
                    updateSequenceResults (currentEmojiBySequence.length, emojiKeys.length);
                    updateDataList (currentEmojiBySequence, sequenceEmojiDataList);
                }
            }
        ]
    );
    //
    sequenceResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, sequenceResultsMenu);
        }
    );
    //
    updateSequenceResults (currentEmojiBySequence.length, emojiKeys.length);
    //
    sequenceInstructions.open = prefs.sequenceInstructions;
    sequenceRegexExamples.open = prefs.sequenceRegexExamples;
    //
    const emojiPattern = require ('emoji-test-patterns')["Emoji_Test_All"];
    const emojiRegex = new RegExp (emojiPattern, 'gu');
    //
    textClearButton.addEventListener
    (
        'click',
        (event) =>
        {
            textInputString.value = "";
            textInputString.dispatchEvent (new Event ('input'));
            textInputString.focus ();
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let emojiMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            textInputString.value = sample.string;
            textInputString.dispatchEvent (new Event ('input'));
        }
    );
    //
    textEmojiSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, emojiMenu);
        }
    );
    //
    let textFilterMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Discard Non-Emoji", // "Strip Out Non-Emoji"
                click: () => 
                {
                    textInputString.value = (textInputString.value.match (emojiRegex) || [ ]).join ("");
                    textInputString.dispatchEvent (new Event ('input'));
                }
            },
            {
                label: "Upgrade to RGI Emoji", // "Promote to RGI Emoji", "Restore Incomplete Emoji"
                click: () => 
                {
                    textInputString.value = textInputString.value.replace
                    (
                        emojiRegex,
                        match => emojiList[match].toFullyQualified || match
                    );
                    textInputString.dispatchEvent (new Event ('input'));
                }
            },
            {
                label: "Remove Duplicate Emoji", // "Delete Emoji Duplicates"
                click: () => 
                {
                    let uniqueEmoji = { };
                    textInputString.value = textInputString.value.replace
                    (
                        emojiRegex,
                        match =>
                        {
                            let result;
                            if (match in uniqueEmoji)
                            {
                                result = "";
                            }
                            else
                            {
                                uniqueEmoji[match] = true;
                                result = match;
                            }
                            return result;
                        }
                    );
                    textInputString.dispatchEvent (new Event ('input'));
                }
            }
        ]
    );
    //
    textFilterButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, textFilterMenu);
        }
    );
    //
    function updateTextResults (hitCount, totalCount)
    {
        textHitCount.textContent = hitCount;
        textTotalCount.textContent = totalCount;
        textResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentEmojiByText = [ ];
    //
    textInputString.addEventListener
    (
        'input',
        (event) =>
        {
            textFilterButton.disabled = !(event.currentTarget.value.length > 0);
            currentEmojiByText = event.currentTarget.value.match (emojiRegex) || [ ];
            updateTextResults (currentEmojiByText.length, emojiKeys.length);
            updateDataList (currentEmojiByText, textEmojiDataList);
        }
    );
    textInputString.value = prefs.textInputString;
    textInputString.dispatchEvent (new Event ('input'));
    //
    let textResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentEmojiByText.length > 0)
                    {
                        remote.clipboard.writeText (currentEmojiByText.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentEmojiByText.join (""));
                }
            }
        ]
    );
    //
    textResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, textResultsMenu);
        }
    );
    //
    textInstructions.open = prefs.textInstructions;
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
                break;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        //
        nameSearchString: nameSearchString.value,
        nameWholeWord: nameWholeWord.checked,
        nameUseRegex: nameUseRegex.checked,
        nameInstructions: nameInstructions.open,
        nameRegexExamples: nameRegexExamples.open,
        //
        sequenceSearchString: sequenceSearchString.value,
        sequenceUseRegex: sequenceUseRegex.checked,
        sequenceInstructions: sequenceInstructions.open,
        sequenceRegexExamples: sequenceRegexExamples.open,
        //
        textInputString: textInputString.value,
        textInstructions: textInstructions.open,
        //
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
