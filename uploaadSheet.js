const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiData = fs.readFileSync(`sheetData.json`);
const sheetData = JSON.parse(apiData);

app.get("/add-telegram-data", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secret-key.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create client instance for auth

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1J2X4YkqGS1WLDpwGYd20ohSVeoSSX0_xQQeRH0rdHpY";
  // this is our sheet id, which is available in sheet's link

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "User_Master!A:F",
    valueInputOption: "USER_ENTERED",
    resource: { values: sheetData },
  });

  // // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "User_Master",
  });
  res.send(getRows.data);
});

app.listen(3002, () => console.log(`appp listening at port 3002`));

// url used : http://localhost:3002/add-telegram-data
