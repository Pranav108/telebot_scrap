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
  for (var [key, val] of usersList) console.log(key, val);
});
