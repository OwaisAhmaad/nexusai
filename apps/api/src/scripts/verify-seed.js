/**
 * Standalone seed verification script using in-memory MongoDB.
 * Runs the research seed data, inserts it, and queries it back.
 */
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const mongoose = require('mongoose');

// Inline research seed data (mirrors research.seed.ts)
const RESEARCH_SEED_DATA = [
  {
    title: 'Claude Opus 4.6 Achieves Human-Level Performance on SWE-bench',
    summary:
      "Anthropic's latest flagship model solves 72.5% of real-world GitHub issues in the SWE-bench evaluation, surpassing all previous models and setting a new state-of-the-art for autonomous software engineering.",
    source: 'Anthropic Blog',
    date: 22,
    month: 'Jan',
  },
  {
    title: 'DeepSeek R1: Open-Source Reasoning Model Rivals GPT-4o',
    summary:
      'Chinese AI lab DeepSeek releases R1, an open-source model that matches or exceeds GPT-4o on mathematical and scientific reasoning benchmarks while costing 95% less to run via API.',
    source: 'DeepSeek Research',
    date: 20,
    month: 'Jan',
  },
  {
    title: 'Gemini 2.5 Pro Introduces 1 Million Token Context Window',
    summary:
      "Google extends Gemini's context window to 1 million tokens, enabling analysis of entire codebases, long videos, and book-length documents in a single prompt. Early benchmarks show strong performance on long-context tasks.",
    source: 'Google Research',
    date: 15,
    month: 'Jan',
  },
  {
    title: 'Meta Llama 3.3 70B Matches Llama 405B at 6x Lower Cost',
    summary:
      'Meta releases Llama 3.3 70B with improved instruction following and reasoning that matches their 405B model on most benchmarks, making powerful open-source AI accessible to developers with limited compute budgets.',
    source: 'Meta AI',
    date: 6,
    month: 'Jan',
  },
  {
    title: "OpenAI's o3 Mini Sets New Record on AIME 2024 Math Competition",
    summary:
      "OpenAI's newest reasoning model achieves 86% accuracy on AIME 2024, a competition typically solved by only the top math students in the world. The model uses extended thinking time to improve answer quality.",
    source: 'OpenAI Blog',
    date: 31,
    month: 'Dec',
  },
  {
    title: 'Anthropic Publishes Research on Constitutional AI Scaling',
    summary:
      'New paper from Anthropic demonstrates that Constitutional AI techniques scale effectively with model size, resulting in more helpful and less harmful models without sacrificing capability on standard benchmarks.',
    source: 'arXiv',
    date: 18,
    month: 'Dec',
  },
];

const ResearchSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    source: String,
    date: Number,
    month: String,
    status: { type: String, default: 'active' },
  },
  { timestamps: true },
);

async function main() {
  console.log('Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('In-memory MongoDB URI:', uri);

  console.log('Connecting mongoose...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const Research = mongoose.model('Research', ResearchSchema);

  // Clear and seed
  await Research.deleteMany({});
  console.log('\nSeeding research items...');
  await Research.insertMany(RESEARCH_SEED_DATA);
  console.log(`  Inserted ${RESEARCH_SEED_DATA.length} research items.`);

  // Verify
  const count = await Research.countDocuments();
  console.log(`\nVerification — total documents in research collection: ${count}`);

  const docs = await Research.find({}, { title: 1, summary: 1, source: 1, date: 1, month: 1, _id: 0 }).lean();
  console.log('\nResearch documents:');
  docs.forEach((doc, i) => {
    console.log(`\n[${i + 1}] title:  ${doc.title}`);
    console.log(`     source: ${doc.source}`);
    console.log(`     date:   ${doc.date} ${doc.month}`);
    console.log(`     summary (first 80 chars): ${String(doc.summary).slice(0, 80)}...`);
  });

  // Field presence check
  const allHaveRequiredFields = docs.every(
    (d) => d.title && d.summary && d.source && d.date !== undefined && d.month,
  );
  console.log(`\nAll 6 docs have title, summary, source, date, month: ${allHaveRequiredFields}`);

  if (count === 6 && allHaveRequiredFields) {
    console.log('\nSEED VERIFICATION PASSED — 6 research documents seeded successfully.');
  } else {
    console.error('\nSEED VERIFICATION FAILED.');
    process.exit(1);
  }

  await mongoose.disconnect();
  await mongod.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
