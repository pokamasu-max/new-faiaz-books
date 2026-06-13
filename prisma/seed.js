const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Generates a clean academic-looking cover with the subject + program/year.
function cover(line1, line2, color) {
  const text = encodeURIComponent(`${line1}\n${line2}`);
  return `https://placehold.co/400x600/${color}/ffffff/png?text=${text}`;
}

const colors = {
  Accounting: "1b4332",
  Management: "1d3557",
  "Finance & Banking": "0a3d62",
  Marketing: "6a040f",
  Economics: "264653",
  "Political Science": "3c096c",
  Sociology: "5c4d7d",
  "Social Work": "344e41",
  Bangla: "7f1d1d",
  English: "14213d",
  History: "582f0e",
  "Islamic History": "335c67",
  "Islamic Studies": "1a4d2e",
  Philosophy: "3d348b",
  Mathematics: "0b525b",
  Physics: "212529",
  Chemistry: "4a4e69",
  Botany: "2d6a4f",
  Zoology: "774936",
};

function mk(b) {
  return {
    title: b.title,
    titleBn: b.titleBn,
    author: b.author,
    publisher: b.publisher || "",
    description: b.description,
    price: b.price,
    program: b.program,
    year: b.year,
    category: b.subject, // subject/department stored in category
    bookType: b.bookType,
    coverImage: cover(b.subject, `${b.program} ${b.year}`, colors[b.subject] || "1f2933"),
    stock: b.stock,
    rating: b.rating,
    featured: !!b.featured,
  };
}

const books = [
  // ---------- Honours 1st Year ----------
  mk({
    title: "Principles of Accounting",
    titleBn: "হিসাববিজ্ঞানের মূলনীতি",
    author: "Dr. M. A. Mannan",
    publisher: "Lecture Publication",
    description:
      "National University Honours 1st Year main textbook for Accounting. Covers the full NU syllabus with examples and accounting equations.",
    price: 380,
    program: "Honours",
    year: "1st Year",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 40,
    rating: 4.6,
    featured: true,
  }),
  mk({
    title: "Lecture Guide — Accounting",
    titleBn: "লেকচার গাইড — হিসাববিজ্ঞান",
    author: "Lecture Editorial Panel",
    publisher: "Lecture Publication",
    description:
      "Complete guide for Honours 1st Year Accounting with board questions, model answers and exam suggestions.",
    price: 520,
    program: "Honours",
    year: "1st Year",
    subject: "Accounting",
    bookType: "Guide",
    stock: 55,
    rating: 4.5,
    featured: true,
  }),
  mk({
    title: "Principles of Management",
    titleBn: "ব্যবস্থাপনার মূলনীতি",
    author: "Prof. Aminul Islam",
    publisher: "Hasan Book House",
    description:
      "Honours 1st Year Management textbook following the National University syllabus.",
    price: 350,
    program: "Honours",
    year: "1st Year",
    subject: "Management",
    bookType: "Textbook",
    stock: 38,
    rating: 4.4,
    featured: true,
  }),
  mk({
    title: "Introduction to Political Science",
    titleBn: "রাষ্ট্রবিজ্ঞান পরিচিতি",
    author: "Dr. Nazmul Karim",
    publisher: "Royal Publication",
    description:
      "Foundational Political Science text for Honours 1st Year. Concepts of state, sovereignty, law and government.",
    price: 320,
    program: "Honours",
    year: "1st Year",
    subject: "Political Science",
    bookType: "Textbook",
    stock: 30,
    rating: 4.3,
    featured: false,
  }),
  mk({
    title: "History of Bangla Literature",
    titleBn: "বাংলা সাহিত্যের ইতিহাস",
    author: "Dr. Sukumar Sen",
    publisher: "Panjeree Publications",
    description:
      "Honours 1st Year Bangla — a detailed history of Bangla literature from medieval to modern periods.",
    price: 410,
    program: "Honours",
    year: "1st Year",
    subject: "Bangla",
    bookType: "Textbook",
    stock: 26,
    rating: 4.7,
    featured: true,
  }),
  mk({
    title: "English Prose & Composition",
    titleBn: "ইংরেজি গদ্য ও রচনা",
    author: "Panjeree Editorial Board",
    publisher: "Panjeree Publications",
    description:
      "Honours 1st Year compulsory English — prose, grammar, paragraph and composition for NU students.",
    price: 360,
    program: "Honours",
    year: "1st Year",
    subject: "English",
    bookType: "Textbook",
    stock: 44,
    rating: 4.2,
    featured: false,
  }),

  // ---------- Honours 2nd Year ----------
  mk({
    title: "Intermediate Accounting",
    titleBn: "মধ্যবর্তী হিসাববিজ্ঞান",
    author: "Dr. M. A. Mannan",
    publisher: "Lecture Publication",
    description:
      "Honours 2nd Year Accounting textbook covering partnership, branch and departmental accounts.",
    price: 430,
    program: "Honours",
    year: "2nd Year",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 33,
    rating: 4.5,
    featured: false,
  }),
  mk({
    title: "Microeconomics",
    titleBn: "ব্যষ্টিক অর্থনীতি",
    author: "Prof. R. Ahmed",
    publisher: "Gazi Publishers",
    description:
      "Honours 2nd Year Economics — demand, supply, consumer behaviour and market structures per NU syllabus.",
    price: 390,
    program: "Honours",
    year: "2nd Year",
    subject: "Economics",
    bookType: "Textbook",
    stock: 28,
    rating: 4.4,
    featured: true,
  }),
  mk({
    title: "Newton Guide — Marketing",
    titleBn: "নিউটন গাইড — মার্কেটিং",
    author: "Newton Editorial Panel",
    publisher: "Newton Publication",
    description:
      "Honours 2nd Year Marketing guide with chapter summaries, previous board questions and suggestions.",
    price: 480,
    program: "Honours",
    year: "2nd Year",
    subject: "Marketing",
    bookType: "Guide",
    stock: 36,
    rating: 4.3,
    featured: false,
  }),
  mk({
    title: "Sociology: Principles & Perspectives",
    titleBn: "সমাজবিজ্ঞান: নীতি ও দৃষ্টিভঙ্গি",
    author: "Dr. Anwara Begum",
    publisher: "Royal Publication",
    description:
      "Honours 2nd Year Sociology textbook covering social institutions, change and theory.",
    price: 340,
    program: "Honours",
    year: "2nd Year",
    subject: "Sociology",
    bookType: "Textbook",
    stock: 22,
    rating: 4.1,
    featured: false,
  }),

  // ---------- Honours 3rd Year ----------
  mk({
    title: "Cost Accounting",
    titleBn: "ব্যয় হিসাববিজ্ঞান",
    author: "Dr. Shahidullah",
    publisher: "Hasan Book House",
    description:
      "Honours 3rd Year Accounting — costing methods, overheads, marginal and standard costing.",
    price: 460,
    program: "Honours",
    year: "3rd Year",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 20,
    rating: 4.5,
    featured: false,
  }),
  mk({
    title: "Suggestion & Question Bank — Management",
    titleBn: "সাজেশন ও প্রশ্নব্যাংক — ব্যবস্থাপনা",
    author: "Disha Editorial Panel",
    publisher: "Disha Publication",
    description:
      "Honours 3rd Year Management exam suggestion with last 10 years' solved questions.",
    price: 220,
    program: "Honours",
    year: "3rd Year",
    subject: "Management",
    bookType: "Suggestion",
    stock: 70,
    rating: 4.2,
    featured: true,
  }),
  mk({
    title: "Financial Management",
    titleBn: "আর্থিক ব্যবস্থাপনা",
    author: "Prof. Kamrul Hasan",
    publisher: "Gazi Publishers",
    description:
      "Honours 3rd Year Finance & Banking textbook — capital budgeting, working capital and valuation.",
    price: 470,
    program: "Honours",
    year: "3rd Year",
    subject: "Finance & Banking",
    bookType: "Textbook",
    stock: 24,
    rating: 4.6,
    featured: false,
  }),

  // ---------- Honours 4th Year ----------
  mk({
    title: "Auditing & Assurance",
    titleBn: "নিরীক্ষা ও আশ্বাস",
    author: "Dr. M. A. Mannan",
    publisher: "Lecture Publication",
    description:
      "Honours 4th Year Accounting textbook on auditing principles, standards and practice.",
    price: 480,
    program: "Honours",
    year: "4th Year",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 18,
    rating: 4.4,
    featured: false,
  }),
  mk({
    title: "Handnote — Bangladesh Economy",
    titleBn: "হ্যান্ডনোট — বাংলাদেশের অর্থনীতি",
    author: "Nilkhet Note Series",
    publisher: "Local",
    description:
      "Short handwritten-style notes for Honours 4th Year Economics — quick revision before exams.",
    price: 120,
    program: "Honours",
    year: "4th Year",
    subject: "Economics",
    bookType: "Notes",
    stock: 90,
    rating: 4.0,
    featured: false,
  }),

  // ---------- Degree (Pass) ----------
  mk({
    title: "Degree Accounting (BBS)",
    titleBn: "ডিগ্রি হিসাববিজ্ঞান (বিবিএস)",
    author: "Prof. Aminul Islam",
    publisher: "Royal Publication",
    description:
      "Degree Pass (BBS) 1st Year Accounting textbook following the National University syllabus.",
    price: 300,
    program: "Degree",
    year: "1st Year",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 35,
    rating: 4.2,
    featured: true,
  }),
  mk({
    title: "Degree Guide — Bangla",
    titleBn: "ডিগ্রি গাইড — বাংলা",
    author: "Lecture Editorial Panel",
    publisher: "Lecture Publication",
    description:
      "Degree Pass Bangla guide with model questions, suggestions and answer hints.",
    price: 260,
    program: "Degree",
    year: "2nd Year",
    subject: "Bangla",
    bookType: "Guide",
    stock: 48,
    rating: 4.1,
    featured: false,
  }),
  mk({
    title: "Degree Political Science",
    titleBn: "ডিগ্রি রাষ্ট্রবিজ্ঞান",
    author: "Dr. Nazmul Karim",
    publisher: "Gazi Publishers",
    description:
      "Degree Pass 3rd Year Political Science textbook covering Bangladesh government and politics.",
    price: 310,
    program: "Degree",
    year: "3rd Year",
    subject: "Political Science",
    bookType: "Textbook",
    stock: 21,
    rating: 4.0,
    featured: false,
  }),

  // ---------- Masters ----------
  mk({
    title: "Advanced Management Accounting",
    titleBn: "উচ্চতর ব্যবস্থাপনা হিসাববিজ্ঞান",
    author: "Dr. Shahidullah",
    publisher: "Hasan Book House",
    description:
      "Masters (Preliminary) Accounting textbook for National University — advanced costing and control.",
    price: 540,
    program: "Masters",
    year: "Preliminary",
    subject: "Accounting",
    bookType: "Textbook",
    stock: 16,
    rating: 4.5,
    featured: false,
  }),
  mk({
    title: "Research Methodology",
    titleBn: "গবেষণা পদ্ধতি",
    author: "Prof. Kamrul Hasan",
    publisher: "Panjeree Publications",
    description:
      "Masters Final research methodology text — design, sampling, data analysis and report writing.",
    price: 500,
    program: "Masters",
    year: "Final",
    subject: "Sociology",
    bookType: "Textbook",
    stock: 14,
    rating: 4.6,
    featured: true,
  }),
  mk({
    title: "Masters Suggestion — Economics",
    titleBn: "মাস্টার্স সাজেশন — অর্থনীতি",
    author: "Disha Editorial Panel",
    publisher: "Disha Publication",
    description:
      "Masters Final Economics final suggestion with solved previous-year questions.",
    price: 240,
    program: "Masters",
    year: "Final",
    subject: "Economics",
    bookType: "Suggestion",
    stock: 50,
    rating: 4.2,
    featured: false,
  }),
];

async function main() {
  console.log("Seeding National University catalogue...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@newfaiazbooks.com" },
    update: {},
    create: {
      name: "Faiaz Admin",
      email: "admin@newfaiazbooks.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "customer@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  for (const b of books) {
    await prisma.book.create({ data: b });
  }

  console.log(`Seeded ${books.length} NU books, 1 admin and 1 student.`);
  console.log("Admin:   admin@newfaiazbooks.com / admin123");
  console.log("Student: customer@example.com / user123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
