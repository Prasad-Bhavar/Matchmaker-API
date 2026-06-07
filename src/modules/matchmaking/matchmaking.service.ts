const repo = require("./matchmaking.repo");
const compatibility = require("./compatibility.service");
const ai = require("./openai.service");

class MatchmakingService {
  async getMatches(profileId: number) {
    const customer = await repo.getProfile(profileId);
    if (!customer) throw new Error("Customer not found");

    const allProfiles = await repo.getAllProfiles();

    const oppositeGender = customer.gender === "Male" ? "Female" : "Male";

    const matches = allProfiles
      .filter(
        (p: any) =>
          p.profileId !== customer.profileId && p.gender === oppositeGender,
      )
      .map((candidate: any) => {
        const { score, reasons } = compatibility.calculate(customer, candidate);
        return {
          profileId: candidate.profileId,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          age: candidate.age,
          gender: candidate.gender,
          city: candidate.city,
          religion: candidate.religion,
          designation: candidate.designation,
          photo: candidate.photos?.[0] ?? null,
          score,
          rank: compatibility.getRank(score),
          reasons,
        };
      })
      .filter((m: any) => m.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return {
      customer: {
        profileId: customer.profileId,
        name: `${customer.firstName} ${customer.lastName}`,
        gender: customer.gender,
        age: customer.age,
        city: customer.city,
      },
      totalMatches: matches.length,
      matches,
    };
  }

  aiService = require("./openai.service");

  async getInsight(profileId: number, candidateProfileId: number) {
    const [customer, candidate] = await Promise.all([
      repo.getProfile(profileId),
      repo.getProfile(candidateProfileId),
    ]);

    if (!customer) throw new Error("Customer not found");
    if (!candidate) throw new Error("Candidate not found");

    const { score, reasons } = compatibility.calculate(customer, candidate);

    const aiInsight = await ai.generateInsight(
      customer,
      candidate,
      score,
      reasons,
    );

    return {
      customerName: `${customer.firstName} ${customer.lastName}`,
      matchName: `${candidate.firstName} ${candidate.lastName}`,
      score,
      rank: compatibility.getRank(score),
      reasons,
      aiInsight,
    };
  }

  async getEmailIntro(profileId: number, candidateProfileId: number) {
    const [customer, candidate] = await Promise.all([
      repo.getProfile(profileId),
      repo.getProfile(candidateProfileId),
    ]);

    if (!customer) throw new Error("Customer not found");
    if (!candidate) throw new Error("Candidate not found");

    const { score, reasons } = compatibility.calculate(customer, candidate);

    const emailIntro = await ai.generateEmailIntro(
      customer,
      candidate,
      score,
      reasons,
    );

    return {
      customerName: `${customer.firstName} ${customer.lastName}`,
      matchName: `${candidate.firstName} ${candidate.lastName}`,
      score,
      rank: compatibility.getRank(score),
      reasons,
      email: `${candidate.email}`,
      emailIntro,
    };
  }
}

module.exports = new MatchmakingService();
