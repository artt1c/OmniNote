import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching profiles...');
  const profiles = await prisma.profile.findMany();
  console.log('Profiles:', JSON.stringify(profiles, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
