const service = require("./matchmaking.service");

class MatchmakingController {
  async getMatches(req: any, res: any) {
    try {
      const profileId = Number(req.params.profileId);
      const result = await service.getMatches(profileId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInsight(req: any, res: any) {
    try {
      const profileId = Number(req.params.profileId);
      const { candidateProfileId } = req.body;

      if (!candidateProfileId) {
        return res
          .status(400)
          .json({ message: "candidateProfileId is required" });
      }

      const result = await service.getInsight(
        profileId,
        Number(candidateProfileId),
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEmailIntro(req: any, res: any) {
    try {
      const profileId = Number(req.params.profileId);
      const { candidateProfileId } = req.body;

      if (!candidateProfileId) {
        return res
          .status(400)
          .json({ message: "candidateProfileId is required" });
      }

      const result = await service.getEmailIntro(
        profileId,
        Number(candidateProfileId),
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MatchmakingController();
