const { google } = require("googleapis");
const keys = require("./keys.json");
const midi = require("midi");

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_ID = "snip";

let patterns = [];

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  scopes
);

client.authorize((e) => {
  if (e) {
    console.log(e);
    return;
  }
  console.log("Connected!");
});

async function getRecords() {
  const googleSheetApi = google.sheets({ version: "v4", auth: client });
  const readOptions = {
    spreadsheetId: SHEET_ID,
    // prettier-ignore
    ranges: [
      "snip!A1:G16",
      "snip!A1:G16", 
      "snip!A1:G16"
    ],
  };

  let response = await googleSheetApi.spreadsheets.values.batchGet(readOptions);
  patterns = response.data.valueRanges.map((range) => [
    ...(range.values || []),
  ]);
  console.log(patterns);
}

getRecords();

// Set up a new output.
const output = new midi.Output();

// Open the first available output port.
output.openPort(0);

const CHANNEL_NAMES = [
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
];

const MIDI_CODES = CHANNEL_NAMES.reduce(
  (acc, cur, i) => ({ ...acc, [cur]: { ON: 144 + i, OFF: 128 + i } }),
  {}
);

const play = async (note, instrument) => {
  if (instrument === 0) {
    output.sendMessage([MIDI_CODES.ONE.ON, note, 100]);
    setTimeout(() => {
      output.sendMessage([MIDI_CODES.ONE.OFF, note, 100]);
    }, 200);
  }
  if (instrument === 1) {
    output.sendMessage([MIDI_CODES.TWO.ON, note, 100]);
    setTimeout(() => {
      output.sendMessage([MIDI_CODES.TWO.OFF, note, 100]);
    }, 200);
  }
};

let index = 0;

// MIDI codes for a C Major scale
const noteMap = [50, 52, 54, 55, 57, 59, 61, 62];

setInterval(() => {
  if (patterns) {
    patterns.forEach((pattern, instrument) => {
      const row = pattern[index];
      if (row) {
        row.forEach((isPlaying, i) => {
          if (isPlaying) {
            let note = noteMap[i];
            play(note, instrument);
          }
        });
      }
    });
  }
  index = (index + 1) % 16;
}, 200);

setInterval(getRecords, 2000);

process.once("SIGUSR2", () => {
  console.log("closing port");
  output.closePort();
});
