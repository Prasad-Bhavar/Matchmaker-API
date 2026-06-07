const { db } = require(
  "../../config/firebase"
);

class MatchmakingRepo {
  async getProfile(profileId: number) {
    const snapshot = await db
      .collection("CustomerProfiles")
      .where("profileId", "==", profileId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();
  }

  async getAllProfiles() {
    const snapshot = await db
      .collection("CustomerProfiles")
      .get();

    return snapshot.docs.map((doc: any) =>
      doc.data()
    );
  }
}

module.exports = new MatchmakingRepo();