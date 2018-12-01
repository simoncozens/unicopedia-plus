# <img src="icons/icon-256.png" width="64px" align="center" alt="Vade Mecum Shelf icon"> UNICODE PLUS

**Unicode Plus** is a set of Unicode, Unihan & emoji utilities wrapped into one single app, built with [Electron](https://electronjs.org).

This app works on Mac OS X, Linux and Windows operating systems.

## Utilities

The following utilities are currently available:

* [CJK Font Variants](#cjk-font-variants)
* [JavaScript Runner](#javascript-runner)
* [Regex Properties](#regex-properties)
* [Emoji Data Finder](#emoji-data-finder)
    * [Find by Name](#find-by-name)
    * [Match Symbol](#match-symbol)
    * [Filter Text](#filter-text)
* [Emoji Picture Book](#emoji-picture-book)
* [Emoji References](#emoji-references)
* [Unicode Data Finder](#unicode-data-finder)
    * [Find by Name](#find-by-name-1)
    * [Match Symbol](#match-symbol-1)
    * [List by Block](#list-by-block)
* [Unicode Inspector](#unicode-inspector)
* [Unicode References](#unicode-references)
* [Unihan Data Finder](#unihan-data-finder)
    * [Find by Tag Value](#find-by-tag-value)
    * [Radical/Strokes](#radicalstrokes)
* [Unihan Inspector](#unihan-inspector)
* [Unihan References](#unihan-references)

## CJK Font Variants

- The **CJK Font Variants** utility displays simultaneously any string of CJK (Chinese/Japanese/Korean) characters in four different typefaces:
    - Japanese (JP)
    - Korean (KR)
    - Simplified Chinese (SC)
    - Traditional Chinese (TC)
- The typefaces belong to the open-source set of [Google Noto CJK Fonts](https://www.google.com/get/noto/help/cjk/):
    - Noto Sans CJK JP Regular
    - Noto Sans CJK KR Regular
    - Noto Sans CJK SC Regular
    - Noto Sans CJK TC Regular
- Additionally, it is possible to specify a set of logographic glyph variants for display by using the <kbd>East Asian Variant</kbd> drop-down menu.
- CJK characters can be entered either directly in the "Characters" input field, or using a series of code points in hexadecimal format in the "Code Points" input field.
- It is also possible to input predefined strings of CJK characters selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu; some of them make use of the information found in the [StandardizedVariants.txt](https://www.unicode.org/Public/UNIDATA/StandardizedVariants.txt) or [IVD_Sequences.txt](https://www.unicode.org/ivd/data/2017-12-12/IVD_Sequences.txt) data files.
- As a convenience, the input fields can be emptied using the <kbd>Clear</kbd> button.
- In output, the standard Unicode code point format `U+7ADC` is used, i.e. "U+" directly followed by 4 or 5 hex digits.
- In input, more hexadecimal formats are allowed, including Unicode escape sequences, such as `\u9F8D` or `\u{2A6A5}`. Moving out of the field or typing the Enter key converts all valid codes to standard Unicode code point format.

<img src="screenshots/cjk-font-variants.png" width="1080px" alt="CJK Font Variants screenshot">

## JavaScript Runner

- The **JavaScript Runner** utility lets you execute JavaScript code, and comes with several sample scripts related to Unicode, Unihan and emoji; it is useful for quick testing/prototyping or data processing.

<img src="screenshots/javascript-runner.png" width="1080px" alt="JavaScript Runner screenshot">

## Regex Properties

- The **Regex Properties** utility displays all the Unicode properties available in this app for regular expressions, used in particular by the **Emoji Data Finder**, **Unicode Data Finder** and **Unihan Data Finder** utilities.
- These properties are suitable to build Unicode-aware regular expressions in JavaScript (ECMAScript 6) using the 'u' flag.
- Unicode properties fall into four groups, which can be displayed individually using the <kbd>Category</kbd> drop-down menu:
    - **General Category** properties
    - **Binary** properties
    - **Script** properties
    - **Script Extensions** properties
- For **General Category** properties, prefixing with `General_Category=` (Canonical) or `gc=` (Alias) is optional. Use the <kbd>Optional Prefix</kbd> checkbox to control whether the prefix is included or not.
- Groupings:

    | Property | Description |
    | -------- | ----------- |
    | Cased_Letter | Uppercase_Letter \| Lowercase_Letter \| Titlecase_Letter |
    | Letter | Uppercase_Letter \| Lowercase_Letter \| Titlecase_Letter \| Modifier_Letter \| Other_Letter |
    | Mark | Nonspacing_Mark \| Spacing_Mark \| Enclosing_Mark |
    | Number | Decimal_Number \| Letter_Number \| Other_Number |
    | Punctuation | Connector_Punctuation \| Dash_Punctuation \| Open_Punctuation \| Close_Punctuation \| Initial_Punctuation \| Final_Punctuation \| Other_Punctuation |
    | Symbol | Math_Symbol \| Currency_Symbol \| Modifier_Symbol \| Other_Symbol |
    | Separator | Space_Separator \| Line_Separator \| Paragraph_Separator |
    | Other | Control \| Format \| Surrogate \| Private_Use \| Unassigned |

- `\P{…}` is the negated form of `\p{…}`. Use the <kbd>Negated</kbd> checkbox to toggle between the two forms.
- Notes:
    - `\p{Any}` is equivalent to `[\u{0}-\u{10FFFF}]`
    - `\p{ASCII}` is equivalent to `[\u{0}-\u{7F}]`
    - `\p{Assigned}` is equivalent to `\P{Unassigned}`
- Information pertaining to this list has been gathered from several sources (see References), and slightly refined through trial and error.

<img src="screenshots/regex-properties.png" width="1080px" alt="Regex Properties screenshot">

## Emoji Data Finder

### Find by Name

- The **Find by Name** feature of the **Emoji Data Finder** utility displays a list of basic data (symbol, short name, keywords, code) of matching Unicode emoji searched by name or keyword, including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any.
- *Fully-qualified* (keyboard/palette) emoji are presented in a standard way, while *non-fully-qualified* (display/process) emoji are shown in a distinctive muted (grayed out) style.
- This feature deals with the 3,570 emoji defined in the **Emoji 11.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/11.0/emoji-test.txt) data file; the 12 keycap bases and the 26 singleton Regional Indicator characters are not included.
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/emoji-data-finder-find-by-name.png" width="1080px" alt="Emoji Data Finder - Find by Name screenshot">

### Match Symbol

- The **Match Symbol** feature of the **Emoji Data Finder** utility displays a list of basic data (symbol, short name, keywords, code) of Unicode emoji matching a symbol, or a regular expression using Unicode properties.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any.
- *Fully-qualified* (keyboard/palette) emoji are presented in a standard way, while *non-fully-qualified* (display/process) emoji are shown in a distinctive muted (grayed out) style.
- This feature deals with the 3,570 emoji defined in the **Emoji 11.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/11.0/emoji-test.txt) data file; the 12 keycap bases and the 26 singleton Regional Indicator characters are not included.
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/emoji-data-finder-match-symbol.png" width="1080px" alt="Emoji Data Finder - Match Symbol screenshot">

### Filter Text

- The **Filter Text** feature of the **Emoji Data Finder** utility displays in real time a list of basic data (symbol, short name, keywords, code) of all the Unicode emoji contained in a text string.
- Text can by directly typed or pasted from the clipboard into the main input field. Click on the <kbd>Filter</kbd> button to strip out all non-emoji characters.
- It is also possible to input predefined sets of emoji selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu.
- As a convenience, the input field can be emptied using the <kbd>Clear</kbd> button.
- *Fully-qualified* (keyboard/palette) emoji are presented in a standard way, while *non-fully-qualified* (display/process) emoji are shown in a distinctive muted (grayed out) style.
- This feature deals with the 3,570 emoji defined in the **Emoji 11.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/11.0/emoji-test.txt) data file; the 12 keycap bases and the 26 singleton Regional Indicator characters are not included.

<img src="screenshots/emoji-data-finder-filter-text.png" width="1080px" alt="Emoji Data Finder - Filter Text screenshot">

## Emoji Picture Book

- The **Emoji Picture Book** utility displays lists of Unicode emoji in a picture book fashion.
- Any group of pictures can be displayed by selecting its name in the <kbd>Category</kbd> drop-down menu, among:<br>"Smileys & People", "Animals & Nature", "Food & Drink", "Travel & Places", "Activities", "Objects", "Symbols", "Flags".
- The size of all emoji pictures (from 32 to 128&nbsp;pixels) can be adjusted by moving the dedicated slider left and right.
- The groups and subgroups of emoji are those defined in the **Emoji 11.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/11.0/emoji-test.txt) data file; the 12 keycap bases and the 26 singleton Regional Indicator characters are not included.
- Only the 2789 *fully-qualified* (keyboard/palette) encodings of the emoji are used unless they cannot be displayed properly, depending on the emoji support level of the operating system.
- Emoji failing to be represented as proper pictures are purely and simply discarded.

<img src="screenshots/emoji-picture-book.png" width="1080px" alt="Emoji Picture Book screenshot">

## Emoji References

- The **Emoji References** utility provides a list of reference links to emoji-related web pages.

<img src="screenshots/emoji-references.png" width="1080px" alt="Emoji References screenshot">

## Unicode Data Finder

### Find by Name

- The **Find by Name** feature of the **Unicode Data Finder** utility displays a list of basic data (symbol, code point, name, block) of matching Unicode characters searched by name (or alias name), including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any, ordered by code point value.
- When available, name aliases are also displayed (in smaller typeface) after the unique and immutable Unicode name. A correction alias is indicated by a leading reference mark `※`.
- It is possible to choose how many characters are shown one page at a time.
- The search is performed on the 276,955 assigned characters (or code points) defined in the **Unicode 11.0** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unicode-data-finder-find-by-name.png" width="1080px" alt="Unicode Data Finder - Find by Name screenshot">

### Match Symbol

- The **Match Symbol** feature of the **Unicode Data Finder** utility displays a list of basic data (symbol, code point, name, block) of Unicode characters matching a symbol, or a regular expression using Unicode properties.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any, ordered by code point value.
- It is possible to choose how many characters are shown one page at a time.
- The search is performed on the 276,955 assigned characters (or code points) defined in the **Unicode 11.0** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unicode-data-finder-match-symbol.png" width="1080px" alt="Unicode Data Finder - Match Symbol screenshot">

### List by Block

- The **List by Block** feature of the **Unicode Data Finder** utility displays in real time a list of basic data (symbol, code point, name, block) of Unicode characters belonging to the same block range.
- It is possible to choose how many characters are shown one page at a time.
- A block can be selected either by <kbd>Block Range</kbd> or by <kbd>Block Name</kbd>, as defined in the **Unicode 11.0** version of the [Blocks.txt](https://www.unicode.org/Public/UNIDATA/Blocks.txt) data file.
- It is also possible to directly enter a code point (or character) in the <kbd>Specimen</kbd> field, then click on the <kbd>Go</kbd> button to automatically select the block containing the code point, scroll its basic data into view, and highlight its hexadecimal code value.

<img src="screenshots/unicode-data-finder-list-by-block.png" width="1080px" alt="Unicode Data Finder - List by Block screenshot">

## Unicode Inspector

- The **Unicode Inspector** utility displays code point information in real time for each Unicode character of a text string.
- Characters can be entered either directly in the "Characters" input field, or using a series of code points in hexadecimal format in the "Code Points" input field.
- It is also possible to input predefined sets of characters selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu.
- As a convenience, the input fields can be emptied using the <kbd>Clear</kbd> button.
- In output, the standard Unicode code point format `U+0041` is used, i.e. "U+" directly followed by 4 or 5 hex digits.
- In input, more hexadecimal formats are allowed, including Unicode escape sequences, such as `\u611B` or `\u{1F49C}`. Moving out of the field or typing the Enter key converts all valid codes to standard Unicode code point format.
- Information is provided for the 276,955 assigned characters (or code points) defined in the **Unicode 11.0** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Extra information is also obtained from the following data files:
    - [Blocks.txt](https://www.unicode.org/Public/UNIDATA/Blocks.txt)
    - [DerivedAge.txt](https://www.unicode.org/Public/UNIDATA/DerivedAge.txt)
    - [DerivedCoreProperties.txt](https://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt)
    - [EquivalentUnifiedIdeograph.txt](https://www.unicode.org/Public/UNIDATA/EquivalentUnifiedIdeograph.txt)
    - [NameAliases.txt](https://www.unicode.org/Public/UNIDATA/NameAliases.txt)
    - [PropList.txt](https://www.unicode.org/Public/UNIDATA/PropList.txt)
    - [Scripts.txt](https://www.unicode.org/Public/UNIDATA/Scripts.txt)
    - [ScriptExtensions.txt](https://www.unicode.org/Public/UNIDATA/ScriptExtensions.txt)

<img src="screenshots/unicode-inspector.png" width="1080px" alt="Unicode Inspector screenshot">

## Unicode References

- The **Unicode References** utility provides a list of reference links to Unicode-related web pages.

<img src="screenshots/unicode-references.png" width="1080px" alt="Unicode References screenshot">

## Unihan Data Finder

### Find by Tag Value

- The **Find by Tag Value** feature of the **Unihan Data Finder** utility displays a list of basic data (symbol, code point, Unihan tag and value(s) of matching Unihan characters searched by tag value, including through regular expressions.
- Use the <kbd>Unihan Tag</kbd> drop-down menu to select the tag you wish to search value(s) by.
- Use the <kbd>Categories</kbd> checkbox to toggle between: all Unihan tags ordered alphabetically, or grouped by categories in the drop-down menu.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any, ordered by code point value.
- It is possible to choose how many characters are shown one page at a time.
- The search is performed on the 88,889 Unihan characters (or code points) defined in  the set of data files contained in the [Unihan.zip](https://www.unicode.org/Public/UNIDATA/Unihan.zip) archive file:
    - *Unihan_DictionaryIndices.txt*
    - *Unihan_DictionaryLikeData.txt*
    - *Unihan_IRGSources.txt*
    - *Unihan_NumericValues.txt*
    - *Unihan_OtherMappings.txt*
    - *Unihan_RadicalStrokeCounts.txt*
    - *Unihan_Readings.txt*
    - *Unihan_Variants.txt*
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unihan-data-finder-find-by-tag-value.png" width="1080px" alt="Unihan Data Finder - Find by Tag Value screenshot">

### Radical/Strokes

- The **Radical/Strokes** feature of the **Unihan Data Finder** utility displays all the Unihan characters searched by KangXi radical and additional stroke count.
- Use the <kbd>Unihan Full Set</kbd> checkbox to perform the search on the full set of 88,889 Unihan characters, or limit it to the IICore set of 9,810 CJK unified ideographs in common usage.
- Use the <kbd>Allow Extra Sources</kbd> checkbox to extend the search to all radical/strokes source tags, or use only the IRG-defined source tag common to all Unihan characters.
- Use the <kbd>Radical</kbd> and <kbd>Strokes</kbd> drop-down menus to select the KangXi radical and the additional stroke count of the Unihan characters you are looking for, then click on the <kbd>Search</kbd> button.
- Selecting `All` from the <kbd>Strokes</kbd> menu lets you display all the Unihan characters sharing the same KangXi radical, sorted by additional stroke count.
- A complete list of the 214 KangXi radicals is available for reference, showing also CJK variants as well as simplified forms.

<img src="screenshots/unihan-data-finder-radical-strokes.png" width="1080px" alt="Unihan Data Finder - Radical/Strokes screenshot">

## Unihan Inspector

- The **Unihan Inspector** utility displays all available Unihan tags for each of the 88,889 Unihan characters defined in  the set of data files contained in the [Unihan.zip](https://www.unicode.org/Public/UNIDATA/Unihan.zip) archive file:
    - *Unihan_DictionaryIndices.txt*
    - *Unihan_DictionaryLikeData.txt*
    - *Unihan_IRGSources.txt*
    - *Unihan_NumericValues.txt*
    - *Unihan_OtherMappings.txt*
    - *Unihan_RadicalStrokeCounts.txt*
    - *Unihan_Readings.txt*
    - *Unihan_Variants.txt*
- In addition, the utility provides, for each Unihan character:
    - basic Unicode information: name, age, plane, block, script, general category, equivalent unified ideograph;
    - basic Unihan information: radical/strokes, definition, variant characters, IICore set.
- Any Unihan character can be entered in the input field either as a code point or a character. Click on the <kbd>Lookup</kbd> button to display the list of Unihan tags.
- It is also possible to lookup a randomly selected Unihan character belonging to the IICore set by clicking on the <kbd>Random</kbd> button.
- The currently looked up Unihan character is displayed at a large scale, followed by its code point; click on <kbd>◀</kbd> or <kbd>▶</kbd> to step through four different CJK typefaces, among: `JP` (Japanese), `KR` (Korean), `SC` (Simplified Chinese), `TC` (Traditional Chinese).
- Use the <kbd>Categories</kbd> checkbox to toggle between: all Unihan tags ordered alphabetically, or grouped by categories.
- Notes:
    - The top Radical/Strokes fields are displaying data obtained from the only informative IRG Source: *kRSUnicode*, while the bottom ones (in grayed-out style, if any) make use of the provisional sources: *kRSKangXi*, *kRSJapanese*, *kRSKanWa*, *kRSKorean* and *kRSAdobe_Japan1_6*.
    - IICore (*International Ideographs Core*) represents a set of 9,810 important Unihan characters in everyday use throughout East Asia; it has been developed by the IRG.
    - IRG stands for *Ideographic Rapporteur Group*, a committee advising the Unicode Consortium about Asian language characters.
    - The Yasuoka Variants information is drawn from the "Variants table for Unicode" data file [UniVariants.txt](http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/ftp/CJKtable/UniVariants.Z) provided by Prof. [Kōichi Yasuoka](http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/).

<img src="screenshots/unihan-inspector.png" width="1080px" alt="Unihan Inspector screenshot">

<img src="screenshots/unihan-inspector-radical.png" width="1080px" alt="Unihan Inspector - Radical screenshot">

## Unihan References

- The **Unihan References** utility provides a list of reference links to Unihan-related web pages.

<img src="screenshots/unihan-references.png" width="1080px" alt="Unihan References screenshot">

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
git clone https://github.com/tonton-pixel/unicode-plus
cd unicode-plus
npm install
npm start
```

If you don't wish to clone, you can [download the source code](https://github.com/tonton-pixel/unicode-plus/archive/master.zip).

Several scripts are also defined in the `package.json` file to build OS-specific bundles of the app, using the simple yet powerful [Electron Packager](https://github.com/electron-userland/electron-packager) Node module.\
For instance, running the following command will create a `Unicode Plus.app` version for Mac OS X:

```bash
npm run build-darwin
```

## Using

You can [download the latest release](https://github.com/tonton-pixel/unicode-plus/releases) for Mac OS X.

## License

The MIT License (MIT).

Copyright © 2018 Michel MARIANI.
