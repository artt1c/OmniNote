'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Collaborator {
  name: string;
  color: string;
  avatarUrl?: string;
  clientId: number;
}

interface CollaboratorsContextType {
  collaborators: Collaborator[];
  setCollaborators: (collaborators: Collaborator[]) => void;
}

const CollaboratorsContext = createContext<CollaboratorsContextType | undefined>(undefined);

export function CollaboratorsProvider({ children }: { children: React.ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  return (
    <CollaboratorsContext.Provider value={{ collaborators, setCollaborators }}>
      {children}
    </CollaboratorsContext.Provider>
  );
}

export function useCollaborators() {
  const context = useContext(CollaboratorsContext);
  if (!context) {
    throw new Error('useCollaborators must be used within a CollaboratorsProvider');
  }
  return context;
}
