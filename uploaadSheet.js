const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { google } = require("googleapis");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let dataArray = [
  ["10001", "pranav_ps", "Pranav", "Singh", "17-dec", "20-dec"],
  ["10001", "pranav_ps", "Prayag", "Singh", "17-dec", "20-dec"],
  ["10001", "pranav_ps", "Pranav", "Singh", "17-dec", "20-dec"],
  ["10001", "pranav_ps", "Prayag", "Singh", "17-dec", "20-dec"],
];
app.get("/google-sheet", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secret-key.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create client instance for auth

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1J2X4YkqGS1WLDpwGYd20ohSVeoSSX0_xQQeRH0rdHpY";

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
    resource: { values: dataArray },
  });

  // // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "User_Master",
  });
  res.send(getRows.data);
  ///////////////////////////////////////////////////

  // const HEADERS = [
  //   "User_ID",
  //   "User_Name",
  //   "First_Name",
  //   "Last_Name",
  //   "Date_of_Joining",
  //   "Date_of_Leaving",
  // ];
  // await sheet.setHeaderRow(HEADERS);

  // await sheet.addRow(dataArray);
});

app.listen(3002, () => console.log(`appp listening at port 3002`));
