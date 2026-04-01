import 'reflect-metadata';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { MODEL_SEED_DATA } from '../models/models.seed';
import { AGENT_SEED_DATA } from '../agents/agents.seed';
import { RESEARCH_SEED_DATA } from '../research/research.seed';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusai';

// --- Schemas (inline for seed script) ---
const AiModelSchema = new mongoose.Schema(
  {
    name: String, lab: String, description: String, tags: [String],
    contextWindow: Number, inputPrice: Number, outputPrice: Number,
    rating: { type: Number, default: 0 }, reviews: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false }, isFeatured: { type: Boolean, default: false },
    category: String, imageUrl: String, status: { type: String, default: 'active' },
    useCases: [String], speed: String, bestFor: String,
  },
  { timestamps: true },
);

const AgentSchema = new mongoose.Schema(
  {
    name: String, description: String, model: String,
    tags: [String], icon: String,
    type: { type: String, default: 'template' },
    status: { type: String, default: 'active' },
  },
  { timestamps: true },
);

const ResearchSchema = new mongoose.Schema(
  {
    title: String, summary: String, source: String,
    date: Number, month: String,
    status: { type: String, default: 'active' },
  },
  { timestamps: true },
);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  const AiModel = mongoose.model('AiModel', AiModelSchema);
  const Agent = mongoose.model('Agent', AgentSchema);
  const Research = mongoose.model('Research', ResearchSchema);

  // Clear existing seed data
  await AiModel.deleteMany({});
  await Agent.deleteMany({ type: 'template' });
  await Research.deleteMany({});

  console.log('Seeding models...');
  await AiModel.insertMany(MODEL_SEED_DATA);
  console.log(`  ✓ ${MODEL_SEED_DATA.length} models inserted`);

  console.log('Seeding agent templates...');
  await Agent.insertMany(AGENT_SEED_DATA);
  console.log(`  ✓ ${AGENT_SEED_DATA.length} agent templates inserted`);

  console.log('Seeding research items...');
  await Research.insertMany(RESEARCH_SEED_DATA);
  console.log(`  ✓ ${RESEARCH_SEED_DATA.length} research items inserted`);

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
