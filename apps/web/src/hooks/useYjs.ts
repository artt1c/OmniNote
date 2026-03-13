import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useEffect, useState, useMemo, useRef } from 'react'
import { WS_PORT, User } from '@omninote/shared'

export const useYjs = (noteId: string, user: User) => {
  const [isOnline, setIsOnline] = useState(false)
  const [isLocalSynced, setIsLocalSynced] = useState(false)
  const ydoc = useMemo(() => new Y.Doc(), [])
  const providerRef = useRef<HocuspocusProvider | null>(null)
  const isOnlineRef = useRef(false)

  const roomName = noteId

  useEffect(() => {
    const wsProvider = new HocuspocusProvider({
      url: `ws://localhost:${WS_PORT}`,
      name: roomName,
      document: ydoc,
    })
    providerRef.current = wsProvider

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

    wsProvider.on('disconnect', () => {
      setOnline(false)
    })

    wsProvider.disconnect()

    const indexeddbProvider = new IndexeddbPersistence(roomName, ydoc)
    indexeddbProvider.on('synced', () => {
      setIsLocalSynced(true)
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        wsProvider.connect()
      }
    })

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
    }
  }, [roomName, ydoc, user])

  return { ydoc, provider: providerRef.current, isOnline, isLocalSynced }
}
