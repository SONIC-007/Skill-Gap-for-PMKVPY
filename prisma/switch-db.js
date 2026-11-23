const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = (process.argv[2] || '').toLowerCase();

const root = path.join(__dirname, '..');
const prismaDir = __dirname;
const envFile = path.join(root, '.env');

if (!['mongo', 'mongodb', 'sqlite', 'postgres', 'postgresql'].includes(target)) {
  console.log('Usage: node prisma/switch-db.js [mongo|sqlite|postgres]');
  process.exit(1);
}

let sourceSchema = '';
let defaultUrl = '';

if (target === 'mongo' || target === 'mongodb') {
  sourceSchema = path.join(prismaDir, 'schema.mongo.prisma');
  defaultUrl = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/pmkvy?retryWrites=true&w=majority';
} else if (target === 'sqlite') {
  sourceSchema = path.join(prismaDir, 'schema.sqlite.prisma');
  defaultUrl = 'file:./dev.db';
} else {
  sourceSchema = path.join(prismaDir, 'schema.postgresql.prisma');
  defaultUrl = 'postgresql://user:password@localhost:5432/pmkvy?schema=public';
}

if (!fs.existsSync(sourceSchema)) {
  console.error(`Source schema file not found: ${sourceSchema}`);
  process.exit(1);
}

// 1. Copy schema
const targetSchema = path.join(prismaDir, 'schema.prisma');
fs.copyFileSync(sourceSchema, targetSchema);
console.log(`✓ Copied ${path.basename(sourceSchema)} -> schema.prisma`);

// 2. Check .env
if (fs.existsSync(envFile)) {
  let envContent = fs.readFileSync(envFile, 'utf8');
  if (target === 'sqlite') {
    envContent = envContent.replace(/DATABASE_URL=".*"/g, `DATABASE_URL="${defaultUrl}"`);
    fs.writeFileSync(envFile, envContent);
    console.log(`✓ Updated .env DATABASE_URL to "${defaultUrl}"`);
  } else if (target === 'mongo' || target === 'mongodb') {
    if (envContent.includes('file:./dev.db')) {
      console.log(`\n👉 NEXT STEP FOR MONGODB:`);
      console.log(`Please set your MongoDB URI in .env:`);
      console.log(`DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/pmkvy?retryWrites=true&w=majority"`);
      console.log(`(or for local MongoDB: DATABASE_URL="mongodb://localhost:27017/pmkvy")\n`);
    }
  }
}

// 3. Generate Prisma client
try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { cwd: root, stdio: 'inherit' });
  console.log(`✓ Successfully switched database to ${target.toUpperCase()}!`);
} catch (e) {
  console.error('Failed to generate Prisma client:', e.message);
}
