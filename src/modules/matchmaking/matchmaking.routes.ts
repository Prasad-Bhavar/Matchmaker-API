const express = require("express");
const router = express.Router();
const controller = require("./matchmaking.controller");

// 1. GET  /matchmaking/:profileId/matches
//    Pure logic — no AI. Returns scored + ranked matches.

// 2. POST /matchmaking/:profileId/insights
//    AI — generates score explanation + compatibility insight for a match.
//    Body: { candidateProfileId: number }

// 3. POST /matchmaking/:profileId/email-intro
//    AI — generates personalised email intro to send to the customer.
//    Body: { candidateProfileId: number }

router.get("/:profileId/matches", (req: any, res: any) =>
  controller.getMatches(req, res),
);
router.post("/:profileId/insights", (req: any, res: any) =>
  controller.getInsight(req, res),
);
router.post("/:profileId/email-intro", (req: any, res: any) =>
  controller.getEmailIntro(req, res),
);

module.exports = router;
