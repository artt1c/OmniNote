import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { SupabasePersistenceService } from './src/infrastructure/persistence/supabase-persistence.service';
import { SupabaseAuthRepository } from './src/infrastructure/auth/repositories/supabase-auth.repository';

dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();
const persistence = new SupabasePersistenceService(prisma);
const repo = new SupabaseAuthRepository(persistence);

async function main() {
  const userId = 'ce782f9d-b54f-4ae3-b210-db49746a9962'; // Roman Mialo's ID from our check
  console.log('Fetching user by ID:', userId);
  const user = await repo.getUserById(userId);
  console.log('User object:', user);
  console.log('Serialized to JSON:', JSON.stringify({ user }));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
