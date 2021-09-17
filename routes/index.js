const express = require("express");
const schedule = require("node-schedule");

const router = express.Router();

const { ONE_DAY, ONE_HOUR } = require("../constant");
const { getUTCTime } = require("../utils/getUTCHour");
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
        const { hour, minute } = getUTCTime(alarmTime, time);

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
