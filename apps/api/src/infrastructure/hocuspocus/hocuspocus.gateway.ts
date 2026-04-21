import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { Hocuspocus } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { NoteRepository } from '../../domain/notes/note.repository';
import { SupabasePersistenceService } from '../persistence/supabase-persistence.service';

/**
 * HocuspocusGateway integrates the Hocuspocus collaborative editing server
 * as a NestJS service. It intercepts HTTP upgrade requests from the NestJS
 * HTTP server and hands off WebSocket connections to Hocuspocus.
 *
 * Call `attachToServer(httpServer)` from main.ts after app.init().
 */
@Injectable()
export class HocuspocusGateway implements OnModuleInit {
  private readonly logger = new Logger(HocuspocusGateway.name);
  private hocuspocus!: Hocuspocus;
  private wss!: WebSocketServer;

  constructor(
    @Inject(NoteRepository) private readonly noteRepository: NoteRepository,
    @Inject(SupabasePersistenceService) private readonly persistence: SupabasePersistenceService,
  ) { }

  onModuleInit(): void {
    this.wss = new WebSocketServer({ noServer: true });

    this.hocuspocus = new Hocuspocus({
      name: 'OmniNote Server',
      debounce: 2000,
      onAuthenticate: async ({ token, documentName }) => {
        if (!token) {
          throw new Error('Unauthorized');
        }
        const user = await this.persistence.verifyToken(token);
        if (!user) {
          throw new Error('Unauthorized');
        }

        const hasAccess = await this.persistence.checkPermission(documentName, user.id, 'read');
        if (!hasAccess) {
          throw new Error('Unauthorized: You do not have access to this note');
        }

        return {
          user: {
            id: user.id
          }
        };
      },
      extensions: [
        new Database({
          fetch: async ({ documentName, context }) => {
            return this.noteRepository.fetch(documentName, context.user.id);
          },
          store: async ({ documentName, document, context }) => {
            await this.noteRepository.store(documentName, document, context.user.id);
          },
        }),
      ],
    });

    this.logger.log('Hocuspocus initialized ✅');
  }

  /**
   * Attach WebSocket upgrade handler to the underlying HTTP server.
   * Must be called after app.init() in main.ts.
   */
  attachUpgradeHandler(
    httpServer: import('http').Server,
  ): void {
    httpServer.on(
      'upgrade',
      (request: IncomingMessage, socket: Socket, head: Buffer) => {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.hocuspocus.handleConnection(ws, request);
        });
      },
    );
    this.logger.log('WebSocket upgrade handler attached ✅');
  }
}
