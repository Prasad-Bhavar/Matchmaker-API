const express = require("express");

const router = express.Router();
const matchmakingRoutes = require("../modules/matchmaking/matchmaking.routes");
const dashboardRoutes = require("../modules/Dashboard/dashboard.routes");
router.use("/matches", matchmakingRoutes);
router.use("/dashboard", dashboardRoutes);
module.exports = router;
