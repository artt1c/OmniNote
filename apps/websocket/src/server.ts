import { Server } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import * as Y from 'yjs';
import { WS_PORT } from '@omninote/shared';
import fs from 'fs';
import path from 'path';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { JSDOM } from 'jsdom';

const STORAGE_DIR = './storage';

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

if (typeof window === 'undefined') {
  const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');

  const globalAny = global as any;
  globalAny.window = window;
  globalAny.document = window.document;
  globalAny.Element = window.Element;
  globalAny.Node = window.Node;
  globalAny.HTMLElement = window.HTMLElement;
  globalAny.DOMParser = window.DOMParser;
  globalAny.MutationObserver = window.MutationObserver;

  Object.defineProperty(globalAny, 'navigator', {
    value: window.navigator,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

interface MarkdownStorage {
  markdown: {
    getMarkdown: () => string;
  };
}

const createServerEditor = () => {
  return new Editor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    // immediatelyRender: false,
  });
};

const server = new Server({
  port: WS_PORT,
  name: 'OmniNote Server',
  debounce: 2000,

  async onLoadDocument(data) {
    const filePath = path.join(STORAGE_DIR, `${data.documentName}.md`);
    const yjsPath = path.join(STORAGE_DIR, `${data.documentName}.yjs`);

    if (fs.existsSync(yjsPath)) {
      console.log(`📂 Loading Yjs Binary: ${data.documentName}.yjs`);
      const binary = fs.readFileSync(yjsPath);
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, binary);
      return ydoc;
    }

    if (fs.existsSync(filePath)) {
      console.log(`📂 Loading Markdown: ${data.documentName}.md`);
      const markdownContent = fs.readFileSync(filePath, 'utf-8');

      const editor = createServerEditor();
      editor.commands.setContent(markdownContent);
      const json = editor.getJSON();

      editor.destroy();

      return TiptapTransformer.toYdoc(json, 'default', [StarterKit, Markdown]);
    }

    console.log(`🆕 Creating new document: ${data.documentName}`);
    return null;
  },

  async onStoreDocument(data) {
    const filePath = path.join(STORAGE_DIR, `${data.documentName}.md`);
    const yjsPath = path.join(STORAGE_DIR, `${data.documentName}.yjs`);

    const json = TiptapTransformer.fromYdoc(data.document, 'default');
    const editor = createServerEditor();
    editor.commands.setContent(json);
    const storage = editor.storage as unknown as MarkdownStorage;
    const markdownOutput = storage.markdown.getMarkdown();

    console.log(`💾 Saving Markdown: ${data.documentName}.md`);
    fs.writeFileSync(filePath, markdownOutput);
    editor.destroy();

    console.log(`💾 Saving Yjs Binary: ${data.documentName}.yjs`);
    const binary = Y.encodeStateAsUpdate(data.document);
    fs.writeFileSync(yjsPath, Buffer.from(binary));
  },
});

server.listen().then(() => {
  console.log(`Hocuspocus server is running on port ${WS_PORT}`);
});