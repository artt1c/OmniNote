import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { NotesService } from '../../application/notes/notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [PersistenceModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
