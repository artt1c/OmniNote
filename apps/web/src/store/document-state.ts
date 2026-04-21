import { useSyncExternalStore } from 'react';

type DocumentState = {
  noteId: string | null;
  title: string;
  isOnline: boolean;
  isLocalSynced: boolean;
};

let state: DocumentState = {
  noteId: null,
  title: '',
  isOnline: false,
  isLocalSynced: false,
};

const listeners = new Set<() => void>();

export const documentStateStore = {
  getState: () => state,
  setState: (newState: Partial<DocumentState>) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useDocumentState() {
  return useSyncExternalStore(documentStateStore.subscribe, documentStateStore.getState, documentStateStore.getState);
}
