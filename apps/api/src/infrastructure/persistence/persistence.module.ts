import { Module } from '@nestjs/common';
import { NoteRepository } from '../../domain/notes/note.repository';
import { SupabaseNotesRepository } from './supabase-notes.repository';

/**
 * PersistenceModule wires the abstract NoteRepository token
 * to its concrete Supabase implementation.
 * Import this module anywhere you need data access.
 */
@Module({
  providers: [
    {
      provide: NoteRepository,
      useClass: SupabaseNotesRepository,
    },
  ],
  exports: [NoteRepository],
})
export class PersistenceModule {}
