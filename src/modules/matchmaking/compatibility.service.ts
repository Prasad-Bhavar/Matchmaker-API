class CompatibilityService {
  calculate(customer: any, candidate: any) {
    let score = 0;
    const reasons: string[] = [];

    // ── Male customer logic
    // Match with women who are younger, earn less, shorter, share child views
    if (customer.gender === "Male") {
      if (candidate.gender !== "Female") return { score: 0, reasons: [] };

      if (candidate.age < customer.age) {
        score += 20;
        reasons.push("Candidate is younger");
      }

      if (
        customer.income != null &&
        candidate.income != null &&
        candidate.income <= customer.income
      ) {
        score += 15;
        reasons.push("Income expectation aligned");
      }

      const maleHeight = parseInt(customer.height);
      const femaleHeight = parseInt(candidate.height);
      if (
        !isNaN(maleHeight) &&
        !isNaN(femaleHeight) &&
        femaleHeight < maleHeight
      ) {
        score += 15;
        reasons.push("Preferred height compatibility");
      }

      if (
        customer.wantKids &&
        candidate.wantKids &&
        customer.wantKids === candidate.wantKids
      ) {
        score += 20;
        reasons.push("Matching views on children");
      }
    }

    // ── Female customer logic
    // Thoughtful compatibility: profession, values, relocation, education
    else {
      if (candidate.gender !== "Male") return { score: 0, reasons: [] };

      if (
        customer.degree &&
        candidate.degree &&
        customer.degree === candidate.degree
      ) {
        score += 15;
        reasons.push("Similar educational background");
      }

      if (
        customer.familyValues &&
        candidate.familyValues &&
        customer.familyValues === candidate.familyValues
      ) {
        score += 15;
        reasons.push("Matching family values");
      }

      if (
        customer.openToRelocate &&
        candidate.openToRelocate &&
        customer.openToRelocate === candidate.openToRelocate
      ) {
        score += 10;
        reasons.push("Compatible relocation preference");
      }

      if (
        customer.designation &&
        candidate.designation &&
        customer.designation === candidate.designation
      ) {
        score += 20;
        reasons.push("Same profession");
      }

      // Female bonus: older or same-age partner
      if (candidate.age >= customer.age) {
        score += 10;
        reasons.push("Partner is older or same age");
      }

      // Female bonus: candidate earns equal or more
      if (
        customer.income != null &&
        candidate.income != null &&
        candidate.income >= customer.income
      ) {
        score += 10;
        reasons.push("Strong financial stability");
      }
    }

    // ── Shared factors (both genders)
    if (
      customer.religion &&
      candidate.religion &&
      customer.religion === candidate.religion
    ) {
      score += 10;
      reasons.push("Same religion");
    }

    if (
      customer.caste &&
      candidate.caste &&
      customer.caste === candidate.caste
    ) {
      score += 5;
      reasons.push("Same caste");
    }

    if (
      customer.motherTongue &&
      candidate.motherTongue &&
      customer.motherTongue === candidate.motherTongue
    ) {
      score += 5;
      reasons.push("Same mother tongue");
    }

    if (
      customer.familyValues &&
      candidate.familyValues &&
      customer.familyValues === candidate.familyValues
    ) {
      // only add if not already counted (female path adds it above)
      if (customer.gender !== "Female") {
        score += 10;
        reasons.push("Shared family values");
      }
    }

    if (customer.city && candidate.city && customer.city === candidate.city) {
      score += 5;
      reasons.push("Same city");
    }

    if (
      customer.maritalStatus &&
      candidate.maritalStatus &&
      customer.maritalStatus === candidate.maritalStatus
    ) {
      score += 5;
      reasons.push("Same marital background");
    }

    const commonHobbies =
      customer.hobbies?.filter((h: string) => candidate.hobbies?.includes(h)) ||
      [];
    score += Math.min(commonHobbies.length * 2, 10);
    if (commonHobbies.length) {
      reasons.push(
        `${commonHobbies.length} common hobbie${commonHobbies.length > 1 ? "s" : ""}`,
      );
    }

    return {
      score: Math.min(score, 100),
      reasons,
    };
  }

  getRank(score: number) {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "High Potential Match";
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Average Match";
    return "Low Compatibility";
  }
}

module.exports = new CompatibilityService();
