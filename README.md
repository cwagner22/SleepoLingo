# SleepoLingo

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

- Easily study language vocabulary flashcards using the Anki system (cards that you have difficulties to remember will appear more often)
- Funny images will make it even easier to remember the cards
- Vocabulary split into multiple categories, each with its own lesson notes
- Many cards contain a word to learn and a longer sentence as an example
- **Study cards during the day and listen of them at night**. When going to sleep launch the bedtime feature! Each card of the current lesson will automatically be played in a loop. Add some soothing music ahd you will fall asleep while remembering the vocabulary you learnt. A great way to fall asleep while learning without effort.
- Press on a word to listen to the text-to-speech audio
- Press the info button to see a transliteration/translation of each individual word of a sentence
- Import languages lessons directly from a spreadsheet
- Standard compliant React Native App Utilizing [Ignite](https://github.com/infinitered/ignite)

## :fire: Preview

![Demo](https://media.giphy.com/media/MSUkFnL8o4sxUtGIth/giphy.gif)
![Screenshot](https://i.imgur.com/FocBtQ5.png?1)

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`

**Step 4:** In `App/Realm` rename `default-demo.realm` to `default.realm`.

## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS

- for iOS
  - run `react-native run-ios`
- for Android

  - Run Genymotion
  - run `react-native run-android`

## Code

- This app uses Prettier

## Shipping

- To generate the sreenshots:

```bash
fastlane screenshots
```

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard. Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [ghooks](https://github.com/gtramontina/ghooks). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard. [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).
