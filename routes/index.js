const express = require("express");
const schedule = require("node-schedule");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

const router = express.Router();
dayjs.extend(utc);

const { getUTCTime } = require("../utils/getUTCHour");
const schedulePushNotification = require("../utils/notification");

router.get("/", function (req, res, next) {
  res.json({ message: "success" });
});

router.post("/notification", (req, res, next) => {
  const { notificationToken, duration, alarmTime, doseTimes } = req.body;

  try {
    if (notificationToken && duration && alarmTime && doseTimes) {
      const today = dayjs().utc();
      const startDate = today.format();
      const endDate = today.add(Number(duration), "day").format();

      const doseTime = Object.keys(doseTimes);

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
