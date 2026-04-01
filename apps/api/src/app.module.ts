import { Module } from '@nestjs/common';
import { NotesModule } from './presentation/notes/notes.module';
import { HocuspocusModule } from './infrastructure/hocuspocus/hocuspocus.module';

@Module({
  imports: [NotesModule, HocuspocusModule],
})
export class AppModule {}
