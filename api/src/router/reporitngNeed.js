const express = require("express");
const {
  reportNeed,
  getUserNeeds,
  updateNeedStatus,
} = require("../controller/needController");
const router = express.Router();

router.post("/report-need", reportNeed);

router.get("/user-needs/:userId", getUserNeeds);

router.put("/update-need-status/:needId", updateNeedStatus);

module.exports = router;
