import { Injectable, Inject } from '@nestjs/common';
import { INotesRepository } from '../../domain/interfaces/notes.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Infrastructure implementation of INotesRepository using Prisma.
 */
@Injectable()
export class PrismaNotesRepository implements INotesRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) { }

  /**
   * Fetches binary data (Yjs snapshots) from the Document model.
   * Prisma's Bytes type matches Buffer in Node.js.
   */
  async getBinaryData(noteId: string): Promise<Buffer | null> {
    const document = await this.prisma.noteContent.findUnique({
      where: { noteId },
    });

    return document?.data ? Buffer.from(document.data) : null;
  }

  /**
   * Upserts binary data for a note.
   */
  async saveBinaryData(noteId: string, data: Buffer): Promise<void> {
    await this.prisma.noteContent.upsert({
      where: { noteId },
      update: { data },
      create: {
        noteId,
        data
      },
    });
  }
}
