export function formatPrice(amount: number): string {
  return "৳" + amount.toLocaleString("en-BD", { maximumFractionDigits: 0 });
}

// National University academic taxonomy
export const PROGRAMS = ["Honours", "Degree", "Masters"] as const;

export const YEARS_BY_PROGRAM: Record<string, string[]> = {
  Honours: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  Degree: ["1st Year", "2nd Year", "3rd Year"],
  Masters: ["Preliminary", "Final"],
};

export const ALL_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Preliminary",
  "Final",
] as const;

// Subjects / departments (stored in Book.category)
export const SUBJECTS = [
  "Accounting",
  "Management",
  "Finance & Banking",
  "Marketing",
  "Economics",
  "Political Science",
  "Sociology",
  "Social Work",
  "Bangla",
  "English",
  "History",
  "Islamic History",
  "Islamic Studies",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
] as const;

export const BOOK_TYPES = [
  "Textbook",
  "Guide",
  "Suggestion",
  "Notes",
] as const;

// Bangla labels for academic terms
export const BN_PROGRAM: Record<string, string> = {
  Honours: "অনার্স",
  Degree: "ডিগ্রি (পাস)",
  Masters: "মাস্টার্স",
};

export const BN_YEAR: Record<string, string> = {
  "1st Year": "১ম বর্ষ",
  "2nd Year": "২য় বর্ষ",
  "3rd Year": "৩য় বর্ষ",
  "4th Year": "৪র্থ বর্ষ",
  Preliminary: "প্রিলিমিনারি",
  Final: "ফাইনাল",
};

export const BN_TYPE: Record<string, string> = {
  Textbook: "মূল বই",
  Guide: "গাইড",
  Suggestion: "সাজেশন",
  Notes: "হ্যান্ডনোট",
};

export const BN_SUBJECT: Record<string, string> = {
  Accounting: "হিসাববিজ্ঞান",
  Management: "ব্যবস্থাপনা",
  "Finance & Banking": "ফিন্যান্স ও ব্যাংকিং",
  Marketing: "মার্কেটিং",
  Economics: "অর্থনীতি",
  "Political Science": "রাষ্ট্রবিজ্ঞান",
  Sociology: "সমাজবিজ্ঞান",
  "Social Work": "সমাজকর্ম",
  Bangla: "বাংলা",
  English: "ইংরেজি",
  History: "ইতিহাস",
  "Islamic History": "ইসলামের ইতিহাস",
  "Islamic Studies": "ইসলামিক স্টাডিজ",
  Philosophy: "দর্শন",
  Mathematics: "গণিত",
  Physics: "পদার্থবিজ্ঞান",
  Chemistry: "রসায়ন",
  Botany: "উদ্ভিদবিজ্ঞান",
  Zoology: "প্রাণিবিজ্ঞান",
};
