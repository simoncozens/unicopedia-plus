# <img src="icons/icon-256.png" width="64px" align="center" alt="Vade Mecum Shelf icon"> UNICODE PLUS

**Unicode Plus** is a set of Unicode & emoji utilities wrapped into one single app, built with [Electron](https://electron.atom.io).

This app works on Mac OS X, Linux and Windows operating systems.

## Utilities

The following utilities are currently available:

* [Emoji Data Finder](#emoji-data-finder)
* [Emoji Picture Book](#emoji-picture-book)
* [Emoji References](#emoji-references)
* [JavaScript Runner](#javascript-runner)
* [Unicode Data Finder](#unicode-data-finder)
* [Unicode Inspector](#unicode-inspector)
* [Unicode References](#unicode-references)

## Note

The **JavaScript Runner** developer utility is no more restricted to the *unpackaged* app configuration; it lets you execute JavaScript code, and comes with several sample scripts related to Unicode and emoji.

## Emoji Data Finder

Data (short name, keywords, code) of Unicode emoji characters extracted from a string:

<img src="screenshots/emoji-data-finder.png" width="1080px" alt="Emoji Data Finder screenshot">

## Emoji Picture Book

Lists of Unicode emoji characters, by group:

* Smileys & People
* Animals & Nature
* Food & Drink
* Travel & Places
* Activities
* Objects
* Symbols
* Flags

<img src="screenshots/emoji-picture-book.png" width="1080px" alt="Emoji Picture Book screenshot">

## Emoji References

List of reference links to emoji-related web pages:

<img src="screenshots/emoji-references.png" width="1080px" alt="Emoji References screenshot">

## JavaScript Runner

JavaScript code runner, useful for quick testing/prototyping or data processing:

<img src="screenshots/javascript-runner.png" width="1080px" alt="JavaScript Runner screenshot">

## Unicode Data Finder

Basic data of Unicode characters found by name:

<img src="screenshots/unicode-data-finder.png" width="1080px" alt="Unicode Data Finder screenshot">

## Unicode Inspector

Code point information of Unicode characters:

<img src="screenshots/unicode-inspector.png" width="1080px" alt="Unicode Inspector screenshot">

## Unicode References

List of reference links to Unicode-related web pages:

<img src="screenshots/unicode-references.png" width="1080px" alt="Unicode References screenshot">

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
