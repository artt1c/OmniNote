import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useEffect, useState, useMemo, useRef } from 'react'
import { User } from '@omninote/shared'
import { useAuth } from './useAuth'
import { putLocalNote } from '@/lib/indexeddb-notes'

import { useRouter } from 'next/navigation'

export const useYjs = (noteId: string, user: User) => {
  const { isAuthenticated, token, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)
  const [isLocalSynced, setIsLocalSynced] = useState(false)
  const ydoc = useMemo(() => new Y.Doc(), [])
  const providerRef = useRef<HocuspocusProvider | null>(null)
  const isOnlineRef = useRef(false)

  const roomName = noteId

  useEffect(() => {
    // Don't initialize until we know auth status
    if (isAuthLoading) return

    // Always initialize IndexedDB persistence — it's the source of truth
    const indexeddbProvider = new IndexeddbPersistence(roomName, ydoc)

    let hasAttemptedConnect = false;

    indexeddbProvider.on('synced', () => {
      setIsLocalSynced(true)

      // Update note title in the IndexedDB metadata store when Yjs metadata syncs
      const metadata = ydoc.getMap('metadata')
      const title = metadata.get('title') as string | undefined
      if (title) {
        putLocalNote({ id: noteId, title, updatedAt: new Date().toISOString() }).catch(() => {})
      }

      // Only connect to WebSocket if user is authenticated
      if (!hasAttemptedConnect && isAuthenticated && typeof navigator !== 'undefined' && navigator.onLine) {
        hasAttemptedConnect = true;
        providerRef.current?.connect()
      }
    })

    // Only setup HocuspocusProvider for authenticated users
    if (isAuthenticated && token) {
      const wsProvider = new HocuspocusProvider({
        url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
        name: roomName,
        document: ydoc,
        token,
        onAuthenticationFailed: () => {
          console.error('Authentication failed: you do not have access to this note')
          router.push('/')
        }
      })
      providerRef.current = wsProvider

      // Start disconnected — connect only after IndexedDB loads
      wsProvider.disconnect()

      const setOnline = (value: boolean) => {
        if (isOnlineRef.current !== value) {
          isOnlineRef.current = value
          setIsOnline(value)
        }
      }

      wsProvider.on('connect', () => {
        wsProvider.setAwarenessField('user', user)
        setOnline(true)
      })
      wsProvider.on('disconnect', () => setOnline(false))

      const handleOnline = () => wsProvider.connect()
      const handleOffline = () => {
        wsProvider.disconnect()
        setOnline(false)
      }
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        wsProvider.destroy()
        providerRef.current = null
        indexeddbProvider.destroy()
        setIsLocalSynced(false)
        setIsOnline(false)
      }
    }

    // Guest cleanup
    return () => {
      indexeddbProvider.destroy()
      setIsLocalSynced(false)
    }
  }, [roomName, ydoc, isAuthenticated, token, isAuthLoading, noteId, user])

  return { ydoc, provider: providerRef.current, isOnline, isLocalSynced }
}

