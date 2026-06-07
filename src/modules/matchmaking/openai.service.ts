const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

class AIService {
  async generateInsight(
    customer: any,
    candidate: any,
    score: number,
    reasons: string[],
  ): Promise<string> {
    const topReasons = reasons.slice(0, 3).join(", ");

    const prompt = `You are a matchmaking assistant. Write a single warm sentence (max 40 words) explaining why these two people are compatible. Be specific. No generic phrases.

Customer: ${customer.firstName}, ${customer.age} yrs, ${customer.city}, ${customer.religion}, ${customer.designation}.
Match: ${candidate.firstName}, ${candidate.age} yrs, ${candidate.city}, ${candidate.religion}, ${candidate.designation}.
Compatibility score: ${score}%. Key reasons: ${topReasons}.

Write only the sentence, nothing else.`;

    try {
      const result = await model.generateContent(prompt);
      console.log("Gemini insight result:", result.response.text().trim());

      return result.response.text().trim();
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      this.fallbackInsight(customer, candidate, score, reasons);
      return "This match has unique qualities that could make for a meaningful connection.";
    }
  }

  async generateEmailIntro(
    customer: any,
    candidate: any,
    score: number,
    reasons: string[],
  ): Promise<string> {
    const topReasons = reasons.slice(0, 4).join(", ");

    const customerBio = [
      customer.firstName,
      customer.age ? `${customer.age} years old` : null,
      customer.city,
      customer.designation && customer.currentCompany
        ? `${customer.designation} at ${customer.currentCompany}`
        : (customer.designation ?? null),
      customer.religion,
      customer.maritalStatus,
    ]
      .filter(Boolean)
      .join(", ");

    const candidateBio = [
      `${candidate.firstName} ${candidate.lastName}`,
      candidate.age ? `${candidate.age} years old` : null,
      candidate.city,
      candidate.designation && candidate.currentCompany
        ? `${candidate.designation} at ${candidate.currentCompany}`
        : (candidate.designation ?? null),
      candidate.religion,
      candidate.maritalStatus,
      candidate.aboutMe
        ? `About them: "${candidate.aboutMe.slice(0, 120)}"`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    const prompt = `You are a warm, professional matchmaker writing a personalised email on behalf of a premium matchmaking service.
Tone: friendly, hopeful, respectful, concise. Never use "I hope this email finds you well."

Write a short email body paragraph (3–4 sentences, max 80 words) introducing a recommended match.

Customer (recipient): ${customerBio}
Recommended Match: ${candidateBio}
Compatibility Score: ${score}%
Why they are compatible: ${topReasons}

Rules:
- Address the customer by first name: ${customer.firstName}
- Mention the match's first name naturally
- Highlight 1–2 specific compatibility reasons
- End with a warm call-to-action to review their profile
- Output ONLY the paragraph — no subject line, no greeting, no sign-off`;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err: any) {
      console.error("[Gemini] generateEmailIntro failed:", err.message);
      return this.fallbackIntro(customer, candidate, score, reasons);
    }
  }

  // Fallbacks

  private fallbackIntro(
    customer: any,
    candidate: any,
    score: number,
    reasons: string[],
  ): string {
    const top = reasons.slice(0, 2).join(" and ");
    return `${customer.firstName}, we've found someone we'd love for you to meet — ${candidate.firstName} ${candidate.lastName}, a ${candidate.age}-year-old ${candidate.designation ?? "professional"} from ${candidate.city ?? "India"}. With a compatibility score of ${score}%, they stand out for ${top}. We believe this could be a meaningful connection — take a look at their profile and let us know your thoughts.`;
  }

  private fallbackInsight(
    customer: any,
    candidate: any,
    score: number,
    reasons: string[],
  ): string {
    const top = reasons.slice(0, 2).join(" and ");
    return `${customer.firstName} and ${candidate.firstName} share ${top}, making them a ${score >= 80 ? "strong" : "promising"} match.`;
  }
}

module.exports = new AIService();
