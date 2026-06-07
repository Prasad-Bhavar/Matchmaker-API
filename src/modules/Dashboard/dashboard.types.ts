export interface DashboardOverview {
  stats: {
    totalProfiles: number;
    verifiedProfiles: number;
    pendingVerification: number;
    activeProfiles: number;
    completedProfiles: number;
    newProfilesThisMonth: number;
  };

  genderDistribution: {
    male: number;
    female: number;
  };

  ageDistribution: {
    age18to25: number;
    age26to30: number;
    age31to35: number;
    age36plus: number;
  };

  religionDistribution: {
    religion: string;
    count: number;
  }[];

  profileCompletion: {
    excellent: number;
    good: number;
    poor: number;
  };
}