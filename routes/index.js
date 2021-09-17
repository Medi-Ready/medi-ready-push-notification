const express = require("express");
const schedule = require("node-schedule");

const router = express.Router();

const { ONE_DAY, ONE_HOUR } = require("../constant");
const schedulePushNotification = require("../utils/notification");

router.get("/", function (req, res, next) {
  res.json({ message: "success" });
});

router.post("/notification", (req, res, next) => {
  const { notificationToken, duration, alarmTime, doseTimes } = req.body;

  try {
    if (notificationToken && duration && alarmTime && doseTimes) {
      const doseTime = Object.keys(doseTimes);

      const startDate = new Date(Date.now());
      const endDate = new Date(startDate.getTime() + duration * ONE_DAY + 9 * ONE_HOUR);

      doseTime.forEach((time) => {
        const hour = String(alarmTime[time].split(":")[0]).padStart(2, "0");
        const minute = String(alarmTime[time].split(":")[1]).padStart(2, "0");

        schedule.scheduleJob(
          { start: startDate, end: endDate, rule: `${minute} ${hour} * * *` },
          () => schedulePushNotification(notificationToken)
        );
      });

      return res.json({ message: "success" });
    }

    next(400);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
