import { Module } from '@nestjs/common';
import { NotesModule } from './presentation/notes/notes.module';
import { HocuspocusModule } from './infrastructure/hocuspocus/hocuspocus.module';
import { AuthModule } from './presentation/auth/auth.module';

@Module({
  imports: [NotesModule, HocuspocusModule, AuthModule],
})
export class AppModule {}
