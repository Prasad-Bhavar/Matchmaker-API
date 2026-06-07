const service = require("./dashboard.service");

class DashboardController {
  async getOverview(req: any, res: any) {
    try {
      const result = await service.getOverview();

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
