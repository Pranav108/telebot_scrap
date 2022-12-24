const fs = require("fs");

const dateMap = new Map();

fs.readFile("result.json", "utf-8", (err1, data) => {
  const JsonData = JSON.parse(data);
  for (let items of JsonData.messages) {
    var currentDate = new Date(items.date_unixtime * 1000);
    var dateString = currentDate.toLocaleDateString();
    if (dateMap.has(dateString)) {
      const mapArray = dateMap.get(dateString);
      if (items.type == "message") {
        if (items.hasOwnProperty("poll")) {
          // its a pole, a problem
          mapArray[3] += items.poll.total_voters;
        } else {
          // its a message
          mapArray[0].add(items.from_id); // activeUser
          mapArray[2]++;
          if (
            Array.isArray(items.text) &&
            items.text[0].text == "/startclassic@on9wordchainbot"
          )
            mapArray[5]++;
        }
      }
      if (items.type == "service") {
        // console.log(items.members.length);
        if (items.action == "invite_members")
          mapArray[1] += items.members.length;
        else if (items.action == "join_group_by_link") mapArray[1]++;
      }
      dateMap.set(dateString, [...mapArray]);
    }
    // map don't have date
    else dateMap.set(dateString, [new Set(), 0, 0, 0, 0, 0]);
  }

  const sheetData = [];
  for (var [key, val] of dateMap) {
    // console.log(val);
    const tempArrr = [];
    tempArrr.push(key); //Date
    tempArrr.push(val[0].size); //No_of_ActiveUsers
    tempArrr.push(val[1]); //No_of_NewUsers
    tempArrr.push(val[2]); //No_of_Messages
    tempArrr.push(val[3]); //Quiz_Participation
    tempArrr.push(val[4]); //Word_of_the_Day_Participation
    tempArrr.push(val[5]); //JumbledWord_TimesInitiated
    sheetData.push(tempArrr);
  }
  fs.writeFile(
    "telegramMaster.json",
    JSON.stringify(sheetData),
    "utf-8",
    (err) => {
      if (err) throw err;
      console.log("file written successFully!");
    }
  );
});
