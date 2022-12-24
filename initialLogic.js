const fs = require("fs");

const usersList = new Map();

fs.readFile("result.json", "utf-8", (err1, data) => {
  const JsonData = JSON.parse(data);
  for (const obj of JsonData.messages) {
    if (obj.type === "service") {
      //set id for user
      usersList.set(obj.actor, {
        user_id: obj.actor_id,
        ...usersList.get(obj.actor),
      });
      if (obj.action === "join_group_by_link") {
        usersList.set(obj.actor, {
          user_id: obj.actor_id,
          date_of_joining: obj.date,
        });
      } else if (
        obj.action === "invite_members" ||
        obj.action === "create_group"
      ) {
        obj.members.forEach((userName) => {
          usersList.set(userName, {
            date_of_joining: obj.date,
            ...usersList.get(userName),
          });
        });
      } else if (obj.action === "remove_members") {
        obj.members.forEach((userName) => {
          usersList.set(userName, {
            date_of_leaving: obj.date,
            ...usersList.get(userName),
          });
        });
      }
    } else if (obj.type === "message")
      usersList.set(obj.from, {
        user_id: obj.from_id,
        ...usersList.get(obj.from),
      });
    else console.log("other object Type Found!!");
  }
  console.log("Users List : ");
  const sheetData = [];

  let primary_id = 1;
  for (var [key, val] of usersList) {
    const tempArrr = [++primary_id];
    tempArrr.push(val.user_id || "");
    tempArrr.push(key);
    const temp = key.split(" ");
    const first_name = temp.shift();
    const last_name = temp.join(" ");
    tempArrr.push(first_name || "");
    tempArrr.push(last_name || "");
    tempArrr.push(val.date_of_joining || "");
    tempArrr.push(val.date_of_leaving || "");
    sheetData.push(tempArrr);
  }

  fs.writeFile("sheetData.json", JSON.stringify(sheetData), "utf-8", (err) => {
    if (err) throw err;
    console.log("file written successFully!");
  });
});
