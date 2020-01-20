# Release Notes

This project adheres to [Semantic Versioning](https://semver.org/).

## 6.2.2

- Fixed missing handling of `Save Results...` in the `Unihan Radical-Strokes` utility.

## 6.2.1

- Allowed alt-click as an alternative to shift-click in the `CJK Font Variants` utility.
- Added a hidden "save DOT source" debug feature to the `Unihan Variants` utility.
- Updated instructions.

## 6.2.0

- Added the full list of radical-strokes combinations as tooltip to each Unihan character listed in the `Unihan Radical-Strokes` utility.
- Added the detailed list of code points with Unicode names as tooltip to each emoji listed in the `Emoji Data Finder` utility.

## 6.1.0

- Added a "Save as SVG" feature to the `Unihan Variants` utility.
- Updated instructions and screenshots accordingly.

## 6.0.0

- Added a new `Unihan Variants` utility.
- Updated screenshots, instructions and `README.md` file accordingly.
- Improved horizontal centering of Unihan characters in the `View by Grid` feature of the `Unihan Data Finder` utility.
- Enabled opening of external links in SVG graphs.
- Updated `Electron` to version `7.1.9`.
- Updated `Electron Packager` to version `14.2.0`.

## 5.16.5

- Fixed opening of invalid anchors.
- Updated `Electron` to version `7.1.8`.

## 5.16.4

- Fixed app timestamp date.
- Updated copyright years.
- Updated emoji version dates.
- Updated handling of default smart zoom setting.

## 5.16.3

- Improved display of data table in the **Match Character** feature of the **Unihan Data Finder** utility, by graying out rows of variant characters, if any.
- Increased font size of Unihan input field for better legibility.
- Updated screenshot.

## 5.16.2

- Improved layout of Unihan data tables, by refactoring styling code.
- Cleaned up variable and class names in Unihan data tables code.
- Added regex example.
- Updated screenshot.
- Updated `Electron` to version `7.1.7`.

## 5.16.1

- Used constant terminology for characters and code points.
- Fixed typo.
- Simplified code.
- Added regex example.
- Updated screenshots.

## 5.16.0

- Moved the **Radical/Strokes** feature out of the **Unihan Data Finder** utility to a new **Unihan Radical-Strokes** utility.
- Added a new **Match Character** feature to the **Unihan Data Finder** utility, including a `Match Variants` option.
- Updated instructions and screenshots accordingly.
- Updated `Electron` to version `7.1.6`.

## 5.15.3

- Improved compact layout of chart of the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Improved unique names for surrogates and private use characters, making use of a pattern consistent with the Unicode name derivation rules.
- Fixed removal of menu bar in license window on Linux.
- Updated `Electron` to version `7.1.5`.

## 5.15.2

- Fixed unique names of CJK Unified Ideographs, making use of the Unicode name derivation rules.
- Updated screenshots accordingly.
- Added samples for unassigned characters to the **Unicode Inspector** utility.
- Updated `Electron` to version `7.1.4`.

## 5.15.1

- Fixed incorrect display of age information in specific cases.
- Fixed missing non-character information for plane 16 private use characters.
- Added regex example to the **Match Character** feature of the **Unicode Data Finder** utility, for the total of 137,929 Unicode characters defined in [Unicode 12.1](https://unicode.org/versions/Unicode12.1.0/).

## 5.15.0

- Added tooltips with age, script, script extensions and general category to the data table rows of the **Unicode Data Finder** utility.
- Added tooltips with age and status of Unihan characters (unified or compatibility ideograph) to the data table rows of the **Find by Tag Value** feature, and to the data table cells of the **View by Grid** feature of the **Unihan Data Finder** utility.
- Added status (unified or compatibility ideograph) to the basic Unihan information of the **Unihan Inspector** utility.
- Appended date (month & year) to the age information in all utilities.
- Fixed missing age information for plane 16 private use characters.
- Updated instructions and screenshots accordingly.

## 5.14.0

- Replaced deprecated HTML Imports with explicit reading of HTML files and dynamic templates.
- Updated `Electron` to version `7.1.3`.

## 5.13.2

- Renamed license HTML file to prevent licensing ambiguity on GitHub.
- Added appropriate `lang` attribute to CJK reference links.
- Replaced custom code with `padStart()` string function for cleaner code and better performance.
- Fixed UI init order issue and added tooltip to each option of the `Locale` drop-down menu in the **Unicode Foldings** utility.

## 5.13.1

- Used stronger contrasting colors for the diff color mode of the **CJK Font Variants** utility.
- Added new regex example for `kTotalStrokes` to the **Find by Tag Value** feature of the **Unihan Data Finder** utility.
- Updated `Electron Packager` to version `14.1.1`.

## 5.13.0

- Added diff color mode to the **CJK Font Variants** utility.
- Cleaned up table creation in the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Updated various samples.
- Updated `Electron` to version `7.1.2`.

## 5.12.1

- Added new CJK samples.
- Improved support for `Emoji 12.1`.
- Added separator lines for non compact layout in the `Radical/Strokes` feature of the `Unihan Data Finder` utility.
- Updated `Electron` to version `7.1.1`.

## 5.12.0

- Improved layout of checkboxes.
- Added support for `Emoji 12.1`.
- Added `Display Emoji Size Statistics` sample script.
- Updated `Electron` to version `7.1.0`.

## 5.11.1

- Fixed issues in `<input type="search">` fields by reverting `Electron` to version `6.1.1`.

## 5.11.0

- Improved the **Unicode Foldings** utility: added a `Locale` drop-down menu and related sample strings.
- Added a new Unicode sample script `Test Special Case Foldings` to the **JavaScript Runner** utility.
- Added an optional `Case Foldings` info field to the **Unicode Inspector** utility.
- Added Bopomofo samples to the **CJK Font Variants** utility.
- Replaced deprecated `get` functions with equivalent properties.
- Displayed custom menu bar as early as possible.
- Improved styling of disabled drop-down menus.
- Updated instructions and screenshots.
- Updated `Electron` to version `7.0.0`.

## 5.10.0

- Added a new **Unicode Foldings** utility.
- Added/updated samples, reference links and regex examples.

## 5.9.3

- Updated various samples.
- Added Unihan reference links.
- Added priority and source(s) tooltip to the IICore set field in the **Unihan Inspector** utility.
- Updated `Electron` to version `6.0.12`.

## 5.9.2

- Added unusual CJK samples to the **Unicode Inspector** utility.
- Updated screenshot accordingly.
- Used distinct background color for user text selection.
- Updated `Electron` to version `6.0.11`.

## 5.9.1

- Improved horizontal centering of CJK characters in vertical mode in the **CJK Font Variants** utility.
- Added new CJK sample string: Hiragana Named Sequences.
- Disabled unintentional user selection of table headers.
- Updated screenshots.

## 5.9.0

- Improved the results of the **Find by Tag Value** feature of the **Unihan Data Finder**: display all values, with non-matching ones grayed out.
- Updated screenshot.
- Fixed incorrect build date in About dialog.
- Updated `Electron` to version `6.0.10`.
- Updated `Electron Packager` to version `14.0.6`.

## 5.8.3

- Improved the CJK typeface widget of the **Unihan Inspector** utility.
- Improved tooltips for Unihan characters and radicals.
- Improved the presentation of regex examples in the **Match Character** feature of the **Unicode Data Finder** utility.
- Updated screenshots.

## 5.8.2

- Updated minimum size of main window to more consistent values for width and height.
- Updated instructions of the **Unihan Inspector** utility, related to the lookup of radicals.
- Added Radical hint to the **Unihan Inspector** utility.
- Updated screenshots.

## 5.8.1

- Improved info layout and dynamic links of the **Unihan Inspector** utility.
- Refactored code of the **Unihan Inspector** utility.
- Increased font size of Unihan input fields consistently.
- Fixed syntax of `--asar` option of `electron-packager` in `package.json`.
- Updated screenshots.

## 5.8.0

- Improved dynamically generated links in the **Unihan Inspector** utility, matching combinations as well.
- Added basic radical info to the **Unihan Inspector** utility when looking up radicals.
- Fixed inconsistent font in the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Increased font weight of emoji short names in the **Emoji Data Finder** utility.
- Added System Version to the system information copied to clipboard.
- Used promise-based versions of open/save file dialog functions.
- Combined `Array.from ()` with `map ()` where relevant.
- Updated `Electron` to version `6.0.7`.

## 5.7.0

- Improved the **Unihan Inspector** utility:
    - added dynamic links to Unihan characters and code points, making use of transitory buttons on hovering
    - allowed lookup of CJK and KangXi radicals in addition to Unihan characters
    - updated and reordered fields in the basic Unicode and Unihan information lists
    - allowed display of self-variants too
    - updated instructions
    - updated screenshot
- Updated `Electron` to version `6.0.5`.
- Updated `Electron Packager` to version `14.0.5`.

## 5.6.3

- Added alternate diff visualization feature (shift-click) in the **CJK Font Variants** utility.
- Updated instructions accordingly.
- Added new samples and regex examples.
- Updated `Electron` to version `6.0.4`.

## 5.6.2

- Fixed font loading issue and improved language tooltips in the **CJK Font Variants** utility.
- Prepared for a future Traditional Chinese (Macao) language font flavor.
- Added reference link to the CJK fonts repository.

## 5.6.1

- Improved CJK language names and tags for Traditional Chinese.
- Added samples (IVD sequence, Hiragana digraph, Hangul letters) to the **CJK Font Variants** utility.
- Added sample (confusables) to the **Unicode Inspector** utility.
- Updated screenshots.
- Updated documentation.

## 5.6.0

- Fixed issue when launching second instance of app on macOS.
- Updated `Electron` to version `6.0.0`, supporting Unicode 12.1 for normalization and regular expressions.
- Used `grapheme-splitter` module.
- Updated regex examples.
- Reorganized samples.
- Added font size tooltip to slider.
- Added radical code point and name as tooltip to radicals table.
- Added missing `--asar` option for `electron-packager`.

## 5.5.1

- Added code point as tooltip to each Unihan variant character in the **Unihan Inspector** utility.
- Refactored Unihan variants code.
- Updated reference links.
- Updated `Electron Packager` to version `14.0.1`.

## 5.5.0

- Added several classes of variant characters in the basic Unihan information panel of the **Unihan Inspector** utility.
- Updated instructions accordingly.
- Updated `Electron` to version `5.0.6`.

## 5.4.2

- Allowed all *enclosed ideographs* to be displayed in the **CJK Font Variants** utility, and added them as sample strings.
- Refactored code dealing with *offscreen canvas* in the **Emoji Picture Book** utility.
- Added new regex example in the **Match Sequence** feature of the **Emoji Data Finder** utility.

## 5.4.1

- Fixed layout of error message box for search input strings.
- Added new Unicode script: `Compare Whitespace Matches`.
- Added spaces sample.
- Updated `Electron` to version `5.0.5`.
- Updated `Electron Packager` to version `14.0.0`.

## 5.4.0

- Added new interactive feature to the **CJK Font Variants** utility: visual feedback on mouse click to spot differences in glyph variations.
- Fixed grapheme segmentation of input string and improved tooltips in the **CJK Font Variants** utility.
- Added line break property to the **Unicode Inspector** utility.
- Used standard bracketed comma-separated notation for sequences of code points.
- Added Unicode and ICU versions to the system information copied to clipboard.
- Fixed window icon in Linux.
- Updated samples.
- Updated screenshots.
- Updated `Electron` to version `5.0.3`.

## 5.3.0

- Added all name aliases to the **Unicode Inspector** utility, according to the *NameAliases.txt* data file.
- Used all name aliases for search and display in the **Unicode Data Finder** utility.
- Cleaned up code: used consistent string delimiters.
- Updated instructions.
- Updated screenshots.

## 5.2.0

- Replaced the `Filter` push-button with a three-action pop-up menu in the **Filter Text** feature of the **Emoji Data Finder** utility:
    - `Discard Non-Emoji`: strip out non-emoji characters
    - `Upgrade to RGI Emoji`: restore incomplete emoji to their **RGI** form
    - `Remove Duplicate Emoji`: delete emoji duplicates
- Removed systematic deletion of duplicates in emoji data list.
- Added ISO country code to the short name of emoji flags.
- Improved status tooltip in the emoji data lists.
- Updated emoji regex examples.
- Updated samples.
- Updated instructions.
- Updated `Electron` to version `5.0.2`.

## 5.1.1

- Truncated loaded file text longer than max length.
- Added tooltip to `Results` pop-up menu button.

## 5.1.0

- Replaced `Clear Results` button with `Results` pop-up menu used to perform basic actions: `Copy Results`, `Save Results...`, `Clear Results`.
- Improved pop-up menus: positioning, visual feedback.
- Added max length to text input and text area fields.
- Fixed use of proper current target in event listeners.
- Fixed layout visual glitches.
- Updated instructions.
- Updated samples.
- Cleaned up code.

## 5.0.1

- Moved duplicated Unicode regex building code to separate module function.
- Fixed potential bug in regex pattern when Whole Word option set.
- Doubled vertical root margin in IntersectionObserver instances.
- Fixed typo in sample name.
- Updated reference links.
- Updated instructions.

## 5.0.0

- Added support for **Unicode 12.1**.
- Updated the **CJK Font Variants** utility:
    - allowed more kinds of characters to get displayed,
    - added clone of language header as extra footer.
- Added the `Vertical Orientation` property to the **Unicode Inspector** utility.
- Improved the `Run Normalization Conformance Test` script.
- Updated samples and reference links.
- Refactored and cleaned up code.
- Updated all screenshots.
- Updated `Electron` to version `5.0.1`.

## 4.7.0

- Revamped the **CJK Font Variants** utility, adding a `Writing Mode` option: `Horizontal` or `Vertical`, together with a Japanese manuscript paper-like layout.
- Added `East Asian Width` and `Emoji` properties to the **Unicode Inspector** utility.
- Added preload of embedded fonts.
- Updated samples and reference links.
- Updated `Electron` to version `4.2.0`.
- Reorganized the Unicode-related data files.

## 4.6.0

- Added Compact Layout option to the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Removed pointless codes info for lone surrogates in the **Unicode Inspector** utility.
- Renamed Developer category to Common.

## 4.5.5

- Improved layout and display of data in the **Unicode Inspector** and **Unihan Inspector** utilities.
- Used better names for planes 15 and 16.
- Cleaned up code.

## 4.5.0

- Renamed `Binary Properties` to `Extended Properties`.
- Used *Snake_Case* for all listed Unicode property names, consistent with their regex counterparts.
- Optimized the *Match Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.
- Added Regex Examples for *Match Decomposition* toggled ON.
- Updated the Noto Sans CJK set of fonts to version 2.001.
- Updated CJK character samples of the **CJK Font Variants** utility.

## 4.4.0

- Extended the *Match Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.
- Sorted in lexical order `Binary Properties`, `Core Properties` and `Script Extensions` in the **Unicode Inpector** utility.  

## 4.3.0

- Added Unicode sample script: **Write Parsed Numeric Values Data to File**
- Added Unihan sample scripts: **Detect Misclassified Compatibility Ideographs** and **Write Unihan Compatibility Variants to File**
- Improved layout of emoji data table in the **Emoji Data Finder** utility
- Added numeric value field and CJK Numerals samples to the **Unicode Inspector** utility
- Reordered normalization forms in the **Unicode Normalizer** utility
- Added Unihan numeric value and compatibility variants infos to the **Unihan Inspector** utility
- Updated `Electron` to version `4.1.4`

## 4.2.0

- Enhanced the *Use Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.

## 4.1.1

- Refactored code and added instructions for the *Use Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.

## 4.1.0

- Added simple yet powerful *Use Decomposition* search option to the **Match Character** feature of the **Unicode Data Finder** utility.
- Added CJK font variant sample.
- Added normalization form samples.
- Updated emoji CLDR annotation file.
- Fixed vertical overflow of normalized strings.

## 4.0.0

- Added support for **Unicode 12.0**, including Unihan and emoji.
- Updated instructions accordingly.
- Updated **JavaScript Runner** sample scripts.
- Updated `Electron` to version `4.0.8`.
- Revamped display of MIT License.
- Cleaned up code.

## 3.1.0

- Added **Unicode Normalizer** utility.
- Added Unicode normalization-related reference links.

## 3.0.1

- Fixed `Electron Packager` high severity vulnerability warning on install.
- Filtered out non-Unihan characters in Yasuoka variants.
- Added new Unihan sample scripts.
- Reorganized reference links.
- Updated `README.md` file.
- Cleaned up code.

## 3.0.0

- Renamed application to **Unicopedia Plus**.
- Renamed two **Match Symbol** features to **Match Sequence** and **Match Character**, respectively.
- Added new command in Developer menu: `Copy System Info to Clipboard`.
- Added new sample scripts: `Run Normalization Conformance Test` and `Write Normalization Test Data to File`.
- Added Unicode age to each Unihan character tooltip in the **View by Grid** feature of the **Unihan Data Finder** utility.
