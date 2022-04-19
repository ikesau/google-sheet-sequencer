# google-sheet-sequencer

A live sequencer that subscribes to a Google Sheet spreadsheet and sends out MIDI notes

## setup

First you need to [create a Google API project and download your JSON key file.](https://web.archive.org/web/20220327214758/https://flaviocopes.com/google-api-authentication/)

Once you've downloaded your key, create a Google sheet and get its ID from the URL. In `index.js`, Set the `SHEET_ID` variable to it.

In the `getRecords` function, set the ranges that you'd like to query to get notes from. (e.g. `"Sheet1!A1:G16"`)

Then run

```
npm i
npm run dev
```

A node process will start that will query your Google Sheet and output MIDI notes on the first valid channel it finds (MIDI magic courtesy of [node-midi](https://github.com/justinlatimer/node-midi)).

A simple setup could involve a Focusrite 4i4 (or equivalent MIDI-capable interface) and a Korg Minilogue set to listen to MIDI Channel 1.

## customisation

The `play` function is bad and was quickly written for my needs. See this [Listing of MIDI Status Codes](https://web.archive.org/web/20210225031154/http://www.opensound.com/pguide/midi/midi5.html) for everything you need to begin customising this code.
