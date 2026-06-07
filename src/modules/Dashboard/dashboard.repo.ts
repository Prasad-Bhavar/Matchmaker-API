const { db } = require("../../config/firebase");

class DashboardRepo {
  async getAllProfiles() {
    const snapshot = await db.collection("CustomerProfiles").get();

    return snapshot.docs.map((doc: any) => doc.data());
  }
}

module.exports = new DashboardRepo();
