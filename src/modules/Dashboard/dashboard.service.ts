const repo = require("./dashboard.repo");

class DashboardService {
  async getOverview() {
    const profiles = await repo.getAllProfiles();

    const totalProfiles = profiles.length;

    const verifiedProfiles = profiles.filter(
      (p: any) => p.verificationStatus === "Verified",
    ).length;

    const pendingVerification = profiles.filter(
      (p: any) => p.verificationStatus !== "Verified",
    ).length;

    const activeProfiles = profiles.filter(
      (p: any) => p.statusTag === "Active",
    ).length;

    const completedProfiles = profiles.filter(
      (p: any) => (p.profileCompletion ?? 0) >= 90,
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newProfilesThisMonth = profiles.filter((p: any) => {
      if (!p.profileCreatedAt) return false;

      const createdAt = new Date(p.profileCreatedAt);

      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;

    const male = profiles.filter((p: any) => p.gender === "Male").length;

    const female = profiles.filter((p: any) => p.gender === "Female").length;

    const ageDistribution = {
      age18to25: 0,
      age26to30: 0,
      age31to35: 0,
      age36plus: 0,
    };

    profiles.forEach((p: any) => {
      const age = Number(p.age);

      if (age >= 18 && age <= 25) ageDistribution.age18to25++;
      else if (age >= 26 && age <= 30) ageDistribution.age26to30++;
      else if (age >= 31 && age <= 35) ageDistribution.age31to35++;
      else if (age >= 36) ageDistribution.age36plus++;
    });

    const religionMap: Record<string, number> = {};

    profiles.forEach((p: any) => {
      if (!p.religion) return;

      religionMap[p.religion] = (religionMap[p.religion] || 0) + 1;
    });

    const religionDistribution = Object.entries(religionMap)
      .map(([religion, count]) => ({
        religion,
        count,
      }))
      .sort((a: any, b: any) => b.count - a.count);

    const profileCompletion = {
      excellent: 0,
      good: 0,
      poor: 0,
    };

    profiles.forEach((p: any) => {
      const completion = Number(p.profileCompletion) || 0;

      if (completion >= 90) profileCompletion.excellent++;
      else if (completion >= 70) profileCompletion.good++;
      else profileCompletion.poor++;
    });

    return {
      stats: {
        totalProfiles,
        verifiedProfiles,
        pendingVerification,
        activeProfiles,
        completedProfiles,
        newProfilesThisMonth,
      },

      genderDistribution: {
        male,
        female,
      },

      ageDistribution,

      religionDistribution,

      profileCompletion,
    };
  }
}

module.exports = new DashboardService();
