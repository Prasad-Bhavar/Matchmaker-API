const express = require("express");

const router = express.Router();

const controller = require("./dashboard.controller");

router.get("/overview", (req: any, res: any) =>
  controller.getOverview(req, res),
);

module.exports = router;
