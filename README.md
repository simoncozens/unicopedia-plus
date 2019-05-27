# <img src="icons/icon-256.png" width="64px" align="center" alt="Unicopedia Plus icon"> UNICOPEDIA PLUS

**Unicopedia Plus** is a developer-oriented set of Unicode, Unihan & emoji utilities wrapped into one single app, built with [Electron](https://electronjs.org).

This app works on Mac OS X, Linux and Windows operating systems.

## Utilities

The following utilities are currently available:

- **CJK Font Variants**
- **JavaScript Runner**
- **Regex Properties**
- **Emoji Data Finder**
    - **Find by Name**
    - **Match Sequence**
    - **Filter Text**
- **Emoji Picture Book**
- **Emoji References**
- **Unicode Data Finder**
    - **Find by Name**
    - **Match Character**
    - **List by Block**
- **Unicode Inspector**
- **Unicode Normalizer**
- **Unicode References**
- **Unihan Data Finder**
    - **Find by Tag Value**
    - **Radical/Strokes**
    - **View by Grid**
- **Unihan Inspector**
- **Unihan References**

## CJK Font Variants

- The **CJK Font Variants** utility displays simultaneously any string of CJK (Chinese/Japanese/Korean) characters in five different typefaces belonging to the open-source set of [Google Noto CJK Fonts](https://www.google.com/get/noto/help/cjk/):

| Language | Code | Typeface |
|----------|------|----------|
| Japanese | JP | Noto Sans CJK JP Regular |
| Korean | KR | Noto Sans CJK KR Regular |
| Simplified Chinese | SC | Noto Sans CJK SC Regular |
| Traditional Chinese | TC | Noto Sans CJK TC Regular |
| Hong Kong Chinese | HK | Noto Sans CJK HK Regular |

- Additionally, it is possible to specify a set of logographic glyph variants for display by using the <kbd>East Asian Variant</kbd> drop-down menu.
- Font variants of the CJK characters can be visualized either vertically or horizontally. Use the <kbd>Writing Mode</kbd> drop-down menu to toggle between the two modes.
- CJK characters can be entered either directly in the "Characters" input field, or using a series of code points in hexadecimal format in the "Code Points" input field.
- It is also possible to input predefined strings of CJK characters selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu; some of them make use of the information found in the [StandardizedVariants.txt](https://www.unicode.org/Public/UNIDATA/StandardizedVariants.txt) or [IVD_Sequences.txt](https://www.unicode.org/ivd/data/2017-12-12/IVD_Sequences.txt) data files.
- As a convenience, the input fields can be emptied using the <kbd>Clear</kbd> button.
- In output, the standard Unicode code point format `U+7ADC` is used, i.e. "U+" directly followed by 4 or 5 hex digits.
- In input, more hexadecimal formats are allowed, including Unicode escape sequences, such as `\u9F8D` or `\u{20B9F}`. Moving out of the field or typing the Enter key converts all valid codes to standard Unicode code point format.

<img src="screenshots/cjk-font-variants-horizontal.png" width="1080px" alt="CJK Font Variants (Horizontal) screenshot">

<img src="screenshots/cjk-font-variants-vertical.png" width="1080px" alt="CJK Font Variants (Vertical) screenshot">

## JavaScript Runner

- The **JavaScript Runner** utility lets you execute JavaScript code, and comes with several sample scripts related to Unicode, Unihan and emoji; it is useful for quick testing/prototyping or data processing.

<img src="screenshots/javascript-runner.png" width="1080px" alt="JavaScript Runner screenshot">

## Regex Properties

- The **Regex Properties** utility displays all the **Unicode 12.1** properties available for regular expressions, used in particular in this app by the **Emoji Data Finder**, **Unicode Data Finder** and **Unihan Data Finder** utilities.
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

<img src="screenshots/regex-properties.png" width="1080px" alt="Regex Properties screenshot">

## Emoji Data Finder

### Find by Name

- The **Find by Name** feature of the **Emoji Data Finder** utility displays a list of basic data (symbol, short name, keywords, code points) of matching Unicode emoji searched by name or keyword, including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any.
- This feature deals with the 3,836 emoji defined in the **Emoji 12.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/12.0/emoji-test.txt) data file.
- The 9 *component* (5 *skin-tone* and 4 *hair-style*) emoji and the 3,010 *fully-qualified* (**RGI**) emoji are presented in a standard way, while the 817 *non-fully-qualified* emoji are shown in a distinctive muted (grayed out) style.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- Various examples of regular expressions are provided for quick copy-and-paste.
- Note: **RGI** stands for *Recommended for General Interchange*.

<img src="screenshots/emoji-data-finder-find-by-name.png" width="1080px" alt="Emoji Data Finder - Find by Name screenshot">

### Match Sequence

- The **Match Sequence** feature of the **Emoji Data Finder** utility displays a list of basic data (symbol, short name, keywords, code points) of Unicode emoji matching a character sequence, including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any.
- This feature deals with the 3,836 emoji defined in the **Emoji 12.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/12.0/emoji-test.txt) data file.
- The 9 *component* (5 *skin-tone* and 4 *hair-style*) emoji and the 3,010 *fully-qualified* (**RGI**) emoji are presented in a standard way, while the 817 *non-fully-qualified* emoji are shown in a distinctive muted (grayed out) style.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- Various examples of regular expressions are provided for quick copy-and-paste.
- Note: **RGI** stands for *Recommended for General Interchange*.

<img src="screenshots/emoji-data-finder-match-sequence.png" width="1080px" alt="Emoji Data Finder - Match Sequence screenshot">

### Filter Text

- The **Filter Text** feature of the **Emoji Data Finder** utility displays in real time a list of basic data (symbol, short name, keywords, code points) of all the Unicode emoji contained in a text string.
- Text can by directly typed or pasted from the clipboard into the main input field.
- It is also possible to input predefined sets of emoji selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu.
- As a convenience, the input field can be emptied using the <kbd>Clear</kbd> button.
- Use the <kbd>Filter&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Discard Non-Emoji` [strip out non-emoji characters]
    - `Upgrade to RGI Emoji` [restore incomplete emoji to their **RGI** form]
    - `Remove Duplicate Emoji` [delete emoji duplicates]
- This feature deals with the 3,836 emoji defined in the **Emoji 12.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/12.0/emoji-test.txt) data file.
- The 9 *component* (5 *skin-tone* and 4 *hair-style*) emoji and the 3,010 *fully-qualified* (**RGI**) emoji are presented in a standard way, while the 817 *non-fully-qualified* emoji are shown in a distinctive muted (grayed out) style.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
- Note: **RGI** stands for *Recommended for General Interchange*.

<img src="screenshots/emoji-data-finder-filter-text.png" width="1080px" alt="Emoji Data Finder - Filter Text screenshot">

## Emoji Picture Book

- The **Emoji Picture Book** utility displays lists of Unicode emoji in a color picture book fashion.
- Any group of pictures can be displayed by selecting its name in the <kbd>Category</kbd> drop-down menu, among:
    - **Smileys & Emotion**
    - **People & Body**
    - **Component**
    - **Animals & Nature**
    - **Food & Drink**
    - **Travel & Places**
    - **Activities**
    - **Objects**
    - **Symbols**
    - **Flags**
- The size of all emoji pictures (from 32 to 128&nbsp;pixels) can be adjusted by moving the dedicated slider left and right.
- The groups and subgroups of emoji are those defined in the **Emoji 12.0** version of the [emoji-test.txt](https://www.unicode.org/Public/emoji/12.0/emoji-test.txt) data file.
- Only the 9 *component* emoji and the 3,010 *fully-qualified* (**RGI**) forms of the emoji are used unless they cannot be displayed properly, depending on the emoji support level of the operating system.
- Emoji failing to be represented as proper color pictures are purely and simply discarded.
- Note: **RGI** stands for *Recommended for General Interchange*.

<img src="screenshots/emoji-picture-book.png" width="1080px" alt="Emoji Picture Book screenshot">

## Emoji References

- The **Emoji References** utility provides a list of reference links to emoji-related web pages.

<img src="screenshots/emoji-references.png" width="1080px" alt="Emoji References screenshot">

## Unicode Data Finder

### Find by Name

- The **Find by Name** feature of the **Unicode Data Finder** utility displays a list of basic data (symbol, code point, name/aliases, block) of matching Unicode characters searched by name or alias, including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any, ordered by code point value.
- It is possible to choose how many characters are shown one page at a time.
- When available, name aliases are displayed (in italics and smaller typeface) after the unique and immutable Unicode name. A correction alias is indicated by a leading reference mark `※`.
- All names and aliases are obtained from the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) and [NameAliases.txt](https://www.unicode.org/Public/UNIDATA/NameAliases.txt) data files.</li>
- The search is performed on the 277,510 assigned characters (or code points) defined in the **Unicode 12.1** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unicode-data-finder-find-by-name.png" width="1080px" alt="Unicode Data Finder - Find by Name screenshot">

### Match Character

- The **Match Character** feature of the **Unicode Data Finder** utility displays a list of basic data (symbol, code point, name/aliases, block) of Unicode characters matching a character, including through regular expressions.
- After entering a query, click on the <kbd>Search</kbd> button to display a list of all relevant matches, if any, ordered by code point value.
- Click on the <kbd>Match Decomposition</kbd> toggle button to extend the search to characters whose *decomposition mapping* matches the query string.
- It is possible to choose how many characters are shown one page at a time.
- The search is performed on the 277,510 assigned characters (or code points) defined in the **Unicode 12.1** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unicode-data-finder-match-character.png" width="1080px" alt="Unicode Data Finder - Match Character screenshot">

### List by Block

- The **List by Block** feature of the **Unicode Data Finder** utility displays in real time a list of basic data (symbol, code point, name/aliases, block) of Unicode characters belonging to the same block range.
- It is possible to choose how many characters are shown one page at a time.
- A block can be selected either by <kbd>Block Range</kbd> or by <kbd>Block Name</kbd>, as defined in the **Unicode 12.0** version of the [Blocks.txt](https://www.unicode.org/Public/UNIDATA/Blocks.txt) data file.
- It is also possible to directly enter a code point (or character) in the <kbd>Specimen</kbd> field, then click on the <kbd>Go</kbd> button to automatically select the block containing the code point, scroll its basic data into view, and highlight its hexadecimal code value.
- You can quickly reuse a previously entered code point by using the <kbd>Alt</kbd>+<kbd>↑</kbd> and <kbd>Alt</kbd>+<kbd>↓</kbd> keyboard shortcuts to navigate up and down through the history stack in the <kbd>Specimen</kbd> field.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]

<img src="screenshots/unicode-data-finder-list-by-block.png" width="1080px" alt="Unicode Data Finder - List by Block screenshot">

## Unicode Inspector

- The **Unicode Inspector** utility displays code point information in real time for each Unicode character of a text string.
- Characters can be entered either directly in the "Characters" input field, or using a series of code points in hexadecimal format in the "Code Points" input field.
- It is also possible to input predefined sets of characters selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu.
- As a convenience, the input fields can be emptied using the <kbd>Clear</kbd> button.
- In output, the standard Unicode code point format `U+0041` is used, i.e. "U+" directly followed by 4 or 5 hex digits.
- In input, more hexadecimal formats are allowed, including Unicode escape sequences, such as `\u611B` or `\u{1F49C}`. Moving out of the field or typing the Enter key converts all valid codes to standard Unicode code point format.
- Information is provided for the 277,510 assigned characters (or code points) defined in the **Unicode 12.1** version of the [UnicodeData.txt](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) data file.
- Extra information is also obtained from the following data files:
    - [Blocks.txt](https://www.unicode.org/Public/UNIDATA/Blocks.txt)
    - [DerivedAge.txt](https://www.unicode.org/Public/UNIDATA/DerivedAge.txt)
    - [DerivedCoreProperties.txt](https://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt)
    - [EastAsianWidth.txt](https://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt)
    - [EquivalentUnifiedIdeograph.txt](https://www.unicode.org/Public/UNIDATA/EquivalentUnifiedIdeograph.txt)
    - [NameAliases.txt](https://www.unicode.org/Public/UNIDATA/NameAliases.txt)
    - [PropList.txt](https://www.unicode.org/Public/UNIDATA/PropList.txt)
    - [Scripts.txt](https://www.unicode.org/Public/UNIDATA/Scripts.txt)
    - [ScriptExtensions.txt](https://www.unicode.org/Public/UNIDATA/ScriptExtensions.txt)
    - [VerticalOrientation.txt](https://www.unicode.org/Public/UNIDATA/VerticalOrientation.txt)

<img src="screenshots/unicode-inspector.png" width="1080px" alt="Unicode Inspector screenshot">

## Unicode Normalizer

- The **Unicode Normalizer** utility displays simultaneously the four normalization forms of a given string, as specified in the [UAX #15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/):

    | Form | Name | Description |
    | ---- | ---- | ----------- |
    | NFC | Normalization Form C | Canonical Decomposition, followed by Canonical Composition |
    | NFD | Normalization Form D | Canonical Decomposition |
    | NFKC | Normalization Form KC | Compatibility Decomposition, followed by Canonical Composition |
    | NFKD | Normalization Form KD | Compatibility Decomposition |

- Characters can be entered either directly in the "Characters" input field, or using a series of code points in hexadecimal format in the "Code Points" input field.
- It is also possible to input predefined strings of characters selected from the <kbd>Samples&nbsp;▾</kbd> pop-up menu.
- As a convenience, the input fields can be emptied using the <kbd>Clear</kbd> button.
- In output, the standard Unicode code point format `U+212B` is used, i.e. "U+" directly followed by 4 or 5 hex digits.
- In input, more hexadecimal formats are allowed, including Unicode escape sequences, such as `\u24B6` or `\u{1F201}`. Moving out of the field or typing the Enter key converts all valid codes to standard Unicode code point format.

<img src="screenshots/unicode-normalizer.png" width="1080px" alt="Unicode Normalizer screenshot">

## Unicode References

- The **Unicode References** utility provides a list of reference links to Unicode-related web pages.

<img src="screenshots/unicode-references.png" width="1080px" alt="Unicode References screenshot">

## Unihan Data Finder

### Find by Tag Value

- The **Find by Tag Value** feature of the **Unihan Data Finder** utility displays a list of basic data (symbol, code point, Unihan tag, value, block) of matching Unihan characters searched by tag value, including through regular expressions.
- Use the <kbd>Unihan Tag</kbd> drop-down menu to select the tag you wish to search value by.
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
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- Various examples of regular expressions are provided for quick copy-and-paste.

<img src="screenshots/unihan-data-finder-find-by-tag-value.png" width="1080px" alt="Unihan Data Finder - Find by Tag Value screenshot">

### Radical/Strokes

- The **Radical/Strokes** feature of the **Unihan Data Finder** utility displays all the Unihan characters searched by KangXi radical and additional stroke count.
- Use the <kbd>Unihan Full Set</kbd> checkbox to perform the search on the full set of 88,889 Unihan characters, or limit it to the IICore set of 9,810 CJK unified ideographs in common usage.
- Use the <kbd>Allow Extra Sources</kbd> checkbox to extend the search to all radical/strokes source tags, or use only the IRG-defined source tag common to all Unihan characters.
- Use the <kbd>Radical</kbd> and <kbd>Strokes</kbd> drop-down menus to select the KangXi radical and the additional stroke count of the Unihan characters you are looking for, then click on the <kbd>Search</kbd> button.
- If the number of additional strokes is negative, 0 is used instead. For example, the Unihan character 王 gets listed under 'Radical 96 ⽟ (Jade)' + '0 Stroke', although its additional stroke count is -1.
- Selecting `All` from the <kbd>Strokes</kbd> menu lets you display all the Unihan characters sharing the same KangXi radical, sorted by additional stroke count.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
    - `Clear Results` [clear the current list of results]
- A complete list of the 214 KangXi radicals is available for reference, showing also CJK variants as well as simplified forms.

<img src="screenshots/unihan-data-finder-radical-strokes.png" width="1080px" alt="Unihan Data Finder - Radical/Strokes screenshot">

### View by Grid

- The **View by Grid** feature of the **Unihan Data Finder** utility displays in real time a grid view of the blocks containing the 88,889 Unihan characters.
- It is possible to choose how many characters are shown one page at a time.
- A block can be selected either by <kbd>Block Name</kbd> or by <kbd>Block Range</kbd>.
- It is also possible to directly enter a Unihan character or code point in the <kbd>Specimen</kbd> field, then click on the <kbd>Go</kbd> button to automatically select the block containing the character, scroll it into view, and highlight it.
- You can quickly reuse a previously entered Unihan character by using the <kbd>Alt</kbd>+<kbd>↑</kbd> and <kbd>Alt</kbd>+<kbd>↓</kbd> keyboard shortcuts to navigate up and down through the history stack in the <kbd>Specimen</kbd> field.
- Use the <kbd>Results&nbsp;▾</kbd> pop-up menu to perform an action among:
    - `Copy Results` [copy the results as string to the clipboard]
    - `Save Results...` [save the results as string to a text file]
- A list of all the Unihan blocks is available for quick reference.

<img src="screenshots/unihan-data-finder-view-by-grid.png" width="1080px" alt="Unihan Data Finder - View by Grid screenshot">

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
- Any Unihan character can be entered in the <kbd>Unihan</kbd> input field either as a character or a code point. Click on the <kbd>Lookup</kbd> button to display the list of Unihan tags.
- In addition, the utility provides, for each Unihan character:
    - basic Unicode information: name, age, plane, block, script, script extensions, general category, decomposition, extended properties, equivalent unified ideograph;
    - basic Unihan information: radical/strokes, definition, numeric value, variant characters, IICore set.
- Previously looked up Unihan characters are kept in a history stack; use the <kbd>Alt</kbd>+<kbd>↑</kbd> and <kbd>Alt</kbd>+<kbd>↓</kbd> keyboard shortcuts to navigate through them up and down inside the input field.
- It is also possible to lookup a randomly selected Unihan character by clicking on the <kbd>Random</kbd> button; use the <kbd>Full Set</kbd> checkbox to perform the draw on the full set of 88,889 Unihan characters, or restrict it to the IICore set of 9,810 CJK unified ideographs in common usage.
- The currently looked up Unihan character is displayed at a large scale, followed by its code point; click on <kbd>◀</kbd> or <kbd>▶</kbd> to step through several different CJK typefaces, among: `JP` (Japanese), `KR` (Korean), `SC` (Simplified Chinese), `TC` (Traditional Chinese), `HK` (Hong Kong Chinese). Double-click on the two-letter language tag to toggle between these five CJK typefaces and the system default typeface.
- Use the <kbd>Categories</kbd> checkbox to toggle between: all Unihan tags ordered alphabetically, or grouped by categories.
- Notes:
    - The top Radical/Strokes fields are displaying data obtained from the only informative IRG Source: *kRSUnicode*, while the bottom ones (in grayed-out style, if any) make use of the provisional sources: *kRSKangXi*, *kRSJapanese*, *kRSKanWa*, *kRSKorean* and *kRSAdobe_Japan1_6*.
    - IICore (*International Ideographs Core*) represents a set of 9,810 important Unihan characters in everyday use throughout East Asia; it has been developed by the IRG.
    - IRG stands for *Ideographic Rapporteur Group*, a committee advising the Unicode Consortium about Asian language characters.
    - The Yasuoka Variants information is drawn from the "Variants table for Unicode" data file [UniVariants.txt](http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/ftp/CJKtable/UniVariants.Z) provided by Prof. [Kōichi Yasuoka](http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/).

<img src="screenshots/unihan-inspector.png" width="1080px" alt="Unihan Inspector screenshot">

## Unihan References

- The **Unihan References** utility provides a list of reference links to Unihan-related web pages.

<img src="screenshots/unihan-references.png" width="1080px" alt="Unihan References screenshot">

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
git clone https://github.com/tonton-pixel/unicopedia-plus
cd unicopedia-plus
npm install
npm start
```

If you don't wish to clone, you can [download the source code](https://github.com/tonton-pixel/unicopedia-plus/archive/master.zip).

Several scripts are also defined in the `package.json` file to build OS-specific bundles of the app, using the simple yet powerful [Electron Packager](https://github.com/electron-userland/electron-packager) Node module.\
For instance, running the following command will create a `Unicopedia Plus.app` version for Mac OS X:

```bash
npm run build-darwin
```

## Using

You can [download the latest release](https://github.com/tonton-pixel/unicopedia-plus/releases) for Mac OS X.

## License

The MIT License (MIT).

Copyright © 2018-2019 Michel MARIANI.
