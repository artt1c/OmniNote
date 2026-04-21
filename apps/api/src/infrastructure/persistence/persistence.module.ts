import { Module } from '@nestjs/common';
import { NoteRepository } from '../../domain/notes/note.repository';
import { SupabaseNotesRepository } from './supabase-notes.repository';
import { SupabasePersistenceService } from './supabase-persistence.service';

/**
 * PersistenceModule wires the abstract NoteRepository token
 * and provides the local SupabasePersistenceService.
 */
@Module({
  providers: [
    SupabasePersistenceService,
    {
      provide: NoteRepository,
      useClass: SupabaseNotesRepository,
    },
  ],
  exports: [NoteRepository, SupabasePersistenceService],
})
export class PersistenceModule {}
