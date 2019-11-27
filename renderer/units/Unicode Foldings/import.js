//
const unit = document.getElementById ('unicode-foldings-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const charactersSamples = unit.querySelector ('.characters-samples');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const useLocaleCheckbox = unit.querySelector ('.use-locale');
const localeSelect = unit.querySelector ('.locale-select');
const charactersStrings = unit.getElementsByClassName ('characters-string');
const codePointsStrings = unit.getElementsByClassName ('code-points-string');
//
const instructions = unit.querySelector ('.instructions');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { app } = require ('electron').remote;
    let defaultLocale = app.getLocale ();
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus.js');
    const { toCase } = require ('../../lib/foldings.js');
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const locales =
    {
        "ab": "Abkhazian",
        "aa": "Afar",
        "af": "Afrikaans",
        "ak": "Akan",
        "sq": "Albanian",
        "am": "Amharic",
        "ar": "Arabic",
        "an": "Aragonese",
        "hy": "Armenian",
        "as": "Assamese",
        "av": "Avaric",
        "ae": "Avestan",
        "ay": "Aymara",
        "az": "Azerbaijani",
        "bm": "Bambara",
        "ba": "Bashkir",
        "eu": "Basque",
        "be": "Belarusian",
        "bn": "Bengali",
        "bh": "Bihari",
        "bi": "Bislama",
        "bs": "Bosnian",
        "br": "Breton",
        "bg": "Bulgarian",
        "my": "Burmese",
        "ca": "Catalan",
        "ch": "Chamorro",
        "ce": "Chechen",
        "ny": "Chichewa",
        "zh": "Chinese",
        "cv": "Chuvash",
        "kw": "Cornish",
        "co": "Corsican",
        "cr": "Cree",
        "hr": "Croatian",
        "cs": "Czech",
        "da": "Danish",
        "dv": "Divehi",
        "nl": "Dutch",
        "dz": "Dzongkha",
        "en": "English",
        "eo": "Esperanto",
        "et": "Estonian",
        "ee": "Ewe",
        "fo": "Faroese",
        "fj": "Fijian",
        "fi": "Finnish",
        "fr": "French",
        "ff": "Fulah",
        "gl": "Galician",
        "lg": "Ganda",
        "ka": "Georgian",
        "de": "German",
        "el": "Greek",
        "gn": "Guarani",
        "gu": "Gujarati",
        "ht": "Haitian",
        "ha": "Hausa",
        "he": "Hebrew",
        "hz": "Herero",
        "hi": "Hindi",
        "ho": "Hiri Motu",
        "hu": "Hungarian",
        "is": "Icelandic",
        "io": "Ido",
        "ig": "Igbo",
        "id": "Indonesian",
        "ia": "Interlingua",
        "ie": "Interlingue",
        "iu": "Inuktitut",
        "ik": "Inupiaq",
        "ga": "Irish",
        "it": "Italian",
        "ja": "Japanese",
        "jv": "Javanese",
        "kl": "Kalaallisut",
        "kn": "Kannada",
        "kr": "Kanuri",
        "ks": "Kashmiri",
        "kk": "Kazakh",
        "km": "Khmer",
        "ki": "Kikuyu",
        "rw": "Kinyarwanda",
        "ky": "Kirghiz",
        "rn": "Kirundi",
        "kv": "Komi",
        "kg": "Kongo",
        "ko": "Korean",
        "ku": "Kurdish",
        "kj": "Kwanyama",
        "lo": "Lao",
        "la": "Latin",
        "lv": "Latvian",
        "li": "Limburgish",
        "ln": "Lingala",
        "lt": "Lithuanian",
        "lu": "Luba",
        "lb": "Luxembourgish",
        "mk": "Macedonian",
        "mg": "Malagasy",
        "ms": "Malay",
        "ml": "Malayalam",
        "mt": "Maltese",
        "gv": "Manx",
        "mi": "Māori",
        "mr": "Marathi",
        "mh": "Marshallese",
        "mo": "Moldavian",
        "mn": "Mongolian",
        "na": "Nauru",
        "nv": "Navajo",
        "ng": "Ndonga",
        "ne": "Nepali",
        "nd": "North Ndebele",
        "se": "Northern Sami",
        "no": "Norwegian",
        "nb": "Norwegian Bokmål",
        "nn": "Norwegian Nynorsk",
        "oc": "Occitan",
        "oj": "Ojibwa",
        "cu": "Old Church Slavonic",
        "or": "Oriya",
        "om": "Oromo",
        "os": "Ossetian",
        "pi": "Pāli",
        "pa": "Panjabi",
        "ps": "Pashto",
        "fa": "Persian",
        "pl": "Polish",
        "pt": "Portuguese",
        "qu": "Quechua",
        "rc": "Reunionese",
        "ro": "Romanian",
        "rm": "Romansh",
        "ru": "Russian",
        "sm": "Samoan",
        "sg": "Sango",
        "sa": "Sanskrit",
        "sc": "Sardinian",
        "gd": "Scottish Gaelic",
        "sr": "Serbian",
        "sh": "Serbo-Croatian",
        "sn": "Shona",
        "ii": "Sichuan Yi",
        "sd": "Sindhi",
        "si": "Sinhalese",
        "sk": "Slovak",
        "sl": "Slovenian",
        "so": "Somali",
        "st": "Sotho",
        "nr": "South Ndebele",
        "es": "Spanish",
        "su": "Sundanese",
        "sw": "Swahili",
        "ss": "Swati",
        "sv": "Swedish",
        "tl": "Tagalog",
        "ty": "Tahitian",
        "tg": "Tajik",
        "ta": "Tamil",
        "tt": "Tatar",
        "te": "Telugu",
        "th": "Thai",
        "bo": "Tibetan",
        "ti": "Tigrinya",
        "to": "Tonga",
        "ts": "Tsonga",
        "tn": "Tswana",
        "tr": "Turkish",
        "tk": "Turkmen",
        "tw": "Twi",
        "ug": "Uighur",
        "uk": "Ukrainian",
        "ur": "Urdu",
        "uz": "Uzbek",
        "ve": "Venda",
        "vi": "Viêt Namese",
        "vo": "Volapük",
        "wa": "Walloon",
        "cy": "Welsh",
        "fy": "Western Frisian",
        "wo": "Wolof",
        "xh": "Xhosa",
        "yi": "Yiddish",
        "yo": "Yoruba",
        "za": "Zhuang",
        "zu": "Zulu"
    };
    //
    let option;
    option = document.createElement ('option');
    option.textContent = `Default (${locales[defaultLocale] || defaultLocale})`;
    option.value = "";
    option.title = `'${defaultLocale}'`;
    localeSelect.appendChild (option);
    option = document.createElement ('option');
    option.textContent = "―";
    option.disabled = true;
    localeSelect.appendChild (option);
    for (let locale in locales)
    {
        let option = document.createElement ('option');
        option.textContent = locales[locale];
        option.value = locale;
        option.title = `'${locale}'`;
        localeSelect.appendChild (option);
    }
    //
    const defaultPrefs =
    {
        charactersInput: "",
        useLocaleCheckbox: false,
        localeSelect: "",
        instructions: true,
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
    useLocaleCheckbox.checked = prefs.useLocaleCheckbox;
    useLocaleCheckbox.addEventListener
    (
        'input',
        event =>
        {
            localeSelect.disabled = !event.currentTarget.checked;
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    localeSelect.value = prefs.localeSelect;
    if (localeSelect.selectedIndex < 0) // -1: no element is selected
    {
        localeSelect.selectedIndex = 0;
    }
    localeSelect.disabled = !useLocaleCheckbox.checked;
    localeSelect.addEventListener
    (
        'input',
        event =>
        {
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            codePointsInput.value = unicode.charactersToCodePoints (characters, true);
            for (let index = 0; index < charactersStrings.length; index++)
            {
                let charactersString = charactersStrings[index];
                let codePointsString = codePointsStrings[index];
                charactersString.textContent = toCase (characters, charactersString.dataset.case, useLocaleCheckbox.checked ? localeSelect.value : undefined);
                codePointsString.textContent = unicode.charactersToCodePoints (charactersString.textContent);
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
            let characters = unicode.codePointsToCharacters (event.currentTarget.value);
            charactersInput.value = characters;
            for (let index = 0; index < charactersStrings.length; index++)
            {
                let charactersString = charactersStrings[index];
                let codePointsString = codePointsStrings[index];
                charactersString.textContent = toCase (characters, charactersString.dataset.case, useLocaleCheckbox.checked ? localeSelect.value : undefined);
                codePointsString.textContent = unicode.charactersToCodePoints (charactersString.textContent);
            }
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
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        charactersInput: charactersInput.value,
        useLocaleCheckbox: useLocaleCheckbox.checked,
        localeSelect: localeSelect.value,
        instructions: instructions.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
