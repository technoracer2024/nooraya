import { create } from 'zustand'

// ── Types ──────────────────────────────────────────────

export type SOSState = 'idle' | 'countdown' | 'active' | 'resolved'
export type CheckInState = 'idle' | 'active' | 'yellow'
export type AlertLevel = 'green' | 'yellow' | 'red'
export type TrackingState = 'idle' | 'tracking'

export interface LocationData {
  lat: number
  lng: number
  timestamp: number
}

export interface TrustedContact {
  id: string
  name: string
  phone: string
  relationship: string
  guardianCode: string
  active: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  trustedContacts: TrustedContact[]
}

export interface AlertRecord {
  id: string
  type: 'sos' | 'checkin_missed' | 'route_overdue' | 'quick_alert' | 'test'
  timestamp: number
  location: LocationData | null
  status: 'active' | 'resolved' | 'test'
  source: string
  message?: string
}

export interface RouteRecord {
  id: string
  startPoint: LocationData
  endPoint: LocationData
  points: LocationData[]
  durationMs: number
  timestamp: number
}

// ── State Interface ────────────────────────────────────

interface AppState {
  // Auth
  userProfile: UserProfile | null
  isLoggedIn: boolean
  guardianUser: UserProfile | null
  guardianContactId: string | null

  // Core
  sosState: SOSState
  location: LocationData | null
  locationHistory: LocationData[]
  contextRecordingAvailable: boolean
  latestMessage: string | null
  latestMessageTimestamp: number | null
  checkInState: CheckInState
  checkInEndTime: number | null
  alertLevel: AlertLevel

  // Tracking
  trackingState: TrackingState
  trackingStartTime: number | null
  trackingRoute: LocationData[]

  // Routes
  savedRoutes: RouteRecord[]

  // History
  alertHistory: AlertRecord[]

  // Quick Alert
  lastQuickAlert: { message: string; timestamp: number; location: LocationData | null } | null

  // Actions
  signUp: (profile: Omit<UserProfile, 'id'>) => void
  logout: () => void
  loginAsGuardian: (code: string) => boolean
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'phone'>>) => void
  addContact: (contact: Omit<TrustedContact, 'id' | 'guardianCode' | 'active'>) => void
  removeContact: (id: string) => void
  updateContactPhone: (id: string, newPhone: string) => void
  reactivateContact: (id: string) => void
  triggerSOS: (source?: string) => void
  cancelSOS: () => void
  activateSOS: () => void
  resolveSOS: () => void
  setLocation: (location: LocationData) => void
  addLocationToHistory: (location: LocationData) => void
  setContextRecording: (available: boolean) => void
  sendTapMessage: (msg: string) => void
  startCheckIn: (durationMinutes: number) => void
  missCheckIn: () => void
  resolveCheckIn: () => void
  startTracking: () => void
  stopTracking: () => void
  addTrackingPoint: (point: LocationData) => void
  sendQuickAlert: (message: string) => void
  addAlert: (alert: Omit<AlertRecord, 'id'>) => void
}

// ── Helpers ────────────────────────────────────────────

const SYNC_KEY = 'nooraya-sync-state'
const USER_KEY = 'nooraya-user-profile'
const HISTORY_KEY = 'nooraya-alert-history'
const ROUTES_KEY = 'nooraya-saved-routes'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function generateGuardianCode(userId: string, contactPhone: string): string {
  const raw = userId + contactPhone + Date.now().toString(36)
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i)
    hash |= 0
  }
  return 'NRY-' + Math.abs(hash).toString(36).toUpperCase().substring(0, 6)
}

function loadUser(): UserProfile | null {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

function saveUser(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function loadHistory(): AlertRecord[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function saveHistory(history: AlertRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function loadRoutes(): RouteRecord[] {
  try {
    const saved = localStorage.getItem(ROUTES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function saveRoutes(routes: RouteRecord[]) {
  localStorage.setItem(ROUTES_KEY, JSON.stringify(routes))
}

function loadSyncState() {
  try {
    const saved = localStorage.getItem(SYNC_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

// ── Store ──────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => {
  const syncState = (partialState: Partial<AppState>) => {
    set(partialState)
    const s = get()
    const syncData = {
      sosState: s.sosState,
      location: s.location,
      locationHistory: s.locationHistory,
      contextRecordingAvailable: s.contextRecordingAvailable,
      latestMessage: s.latestMessage,
      latestMessageTimestamp: s.latestMessageTimestamp,
      checkInState: s.checkInState,
      checkInEndTime: s.checkInEndTime,
      alertLevel: s.alertLevel,
      trackingState: s.trackingState,
      trackingStartTime: s.trackingStartTime,
      trackingRoute: s.trackingRoute,
      lastQuickAlert: s.lastQuickAlert,
      _ts: Date.now()
    }
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncData))
  }

  const initial = loadSyncState()

  return {
    userProfile: loadUser(),
    isLoggedIn: !!loadUser(),
    guardianUser: null,
    guardianContactId: null,

    sosState: initial?.sosState || 'idle',
    location: initial?.location || null,
    locationHistory: initial?.locationHistory || [],
    contextRecordingAvailable: initial?.contextRecordingAvailable || false,
    latestMessage: initial?.latestMessage || null,
    latestMessageTimestamp: initial?.latestMessageTimestamp || null,
    checkInState: initial?.checkInState || 'idle',
    checkInEndTime: initial?.checkInEndTime || null,
    alertLevel: initial?.alertLevel || 'green',
    trackingState: initial?.trackingState || 'idle',
    trackingStartTime: initial?.trackingStartTime || null,
    trackingRoute: initial?.trackingRoute || [],
    savedRoutes: loadRoutes(),
    alertHistory: loadHistory(),
    lastQuickAlert: initial?.lastQuickAlert || null,

    signUp: (profile) => {
      const id = generateId()
      const contacts = profile.trustedContacts.map(c => ({
        ...c,
        id: c.id || generateId(),
        guardianCode: c.guardianCode || generateGuardianCode(id, c.phone),
        active: c.active !== undefined ? c.active : true,
      }))
      const user: UserProfile = { ...profile, id, trustedContacts: contacts }
      saveUser(user)
      set({ userProfile: user, isLoggedIn: true })
    },

    logout: () => {
      set({ userProfile: null, isLoggedIn: false, guardianUser: null, guardianContactId: null })
    },

    loginAsGuardian: (code: string) => {
      const user = loadUser()
      if (!user) return false
      const contact = user.trustedContacts.find(c => c.guardianCode === code && c.active)
      if (!contact) return false
      set({ guardianUser: user, guardianContactId: contact.id, isLoggedIn: true })
      return true
    },

    updateProfile: (updates) => {
      const user = get().userProfile
      if (!user) return
      const updated = { ...user, ...updates }
      saveUser(updated)
      set({ userProfile: updated })
    },

    addContact: (contact) => {
      const user = get().userProfile
      if (!user) return
      const newContact: TrustedContact = {
        ...contact,
        id: generateId(),
        guardianCode: generateGuardianCode(user.id, contact.phone),
        active: true,
      }
      const updated = { ...user, trustedContacts: [...user.trustedContacts, newContact] }
      saveUser(updated)
      set({ userProfile: updated })
    },

    removeContact: (id) => {
      const user = get().userProfile
      if (!user) return
      const updated = { ...user, trustedContacts: user.trustedContacts.filter(c => c.id !== id) }
      saveUser(updated)
      set({ userProfile: updated })
    },

    updateContactPhone: (id, newPhone) => {
      const user = get().userProfile
      if (!user) return
      const updated = {
        ...user,
        trustedContacts: user.trustedContacts.map(c =>
          c.id === id ? { ...c, phone: newPhone, guardianCode: generateGuardianCode(user.id, newPhone), active: true } : c
        )
      }
      saveUser(updated)
      set({ userProfile: updated })
    },

    reactivateContact: (id) => {
      const user = get().userProfile
      if (!user) return
      const updated = { ...user, trustedContacts: user.trustedContacts.map(c => c.id === id ? { ...c, active: true } : c) }
      saveUser(updated)
      set({ userProfile: updated })
    },

    triggerSOS: (_source = 'virtual_button') => {
      syncState({ sosState: 'countdown', alertLevel: 'red' })
    },

    cancelSOS: () => {
      syncState({ sosState: 'idle', alertLevel: 'green', latestMessage: null, latestMessageTimestamp: null, contextRecordingAvailable: false })
    },

    activateSOS: () => {
      const loc = get().location
      const alert: AlertRecord = {
        id: generateId(), type: 'sos', timestamp: Date.now(), location: loc, status: 'active', source: 'virtual_button',
      }
      const history = [...get().alertHistory, alert]
      saveHistory(history)
      syncState({ sosState: 'active', alertLevel: 'red', alertHistory: history } as Partial<AppState>)
    },

    resolveSOS: () => {
      const history = get().alertHistory.map(a => a.status === 'active' ? { ...a, status: 'resolved' as const } : a)
      saveHistory(history)
      syncState({ sosState: 'resolved', alertLevel: 'green', alertHistory: history, latestMessage: null, latestMessageTimestamp: null, contextRecordingAvailable: false } as Partial<AppState>)
    },

    setLocation: (location) => syncState({ location }),
    addLocationToHistory: (location) => {
      const hist = [...get().locationHistory, location].slice(-100)
      syncState({ locationHistory: hist })
    },

    setContextRecording: (available) => syncState({ contextRecordingAvailable: available }),
    sendTapMessage: (msg) => syncState({ latestMessage: msg, latestMessageTimestamp: Date.now() }),

    startCheckIn: (durationMinutes) => syncState({ checkInState: 'active', checkInEndTime: Date.now() + durationMinutes * 60 * 1000, alertLevel: 'green' }),
    missCheckIn: () => syncState({ checkInState: 'yellow', alertLevel: 'yellow' }),
    resolveCheckIn: () => syncState({ checkInState: 'idle', checkInEndTime: null, alertLevel: 'green' }),

    startTracking: () => syncState({ trackingState: 'tracking', trackingStartTime: Date.now(), trackingRoute: [] }),
    stopTracking: () => {
      const route = get().trackingRoute
      const startTime = get().trackingStartTime
      if (route.length >= 2 && startTime) {
        const record: RouteRecord = {
          id: generateId(), startPoint: route[0], endPoint: route[route.length - 1],
          points: route, durationMs: Date.now() - startTime, timestamp: Date.now(),
        }
        const routes = [...get().savedRoutes, record]
        saveRoutes(routes)
        set({ savedRoutes: routes })
      }
      syncState({ trackingState: 'idle', trackingStartTime: null, trackingRoute: [] })
    },
    addTrackingPoint: (point) => {
      const route = [...get().trackingRoute, point]
      syncState({ trackingRoute: route })
    },

    sendQuickAlert: (message) => {
      const loc = get().location
      const quickAlert = { message, timestamp: Date.now(), location: loc }
      const alert: AlertRecord = { id: generateId(), type: 'quick_alert', timestamp: Date.now(), location: loc, status: 'resolved', source: 'quick_alert', message }
      const history = [...get().alertHistory, alert]
      saveHistory(history)
      syncState({ lastQuickAlert: quickAlert, alertHistory: history } as Partial<AppState>)
    },

    addAlert: (alert) => {
      const record = { ...alert, id: generateId() }
      const history = [...get().alertHistory, record]
      saveHistory(history)
      set({ alertHistory: history })
    },
  }
})

// ── Cross-tab sync ─────────────────────────────────────

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === SYNC_KEY && e.newValue) {
      try {
        const p = JSON.parse(e.newValue)
        useStore.setState({
          sosState: p.sosState, location: p.location, locationHistory: p.locationHistory,
          contextRecordingAvailable: p.contextRecordingAvailable, latestMessage: p.latestMessage,
          latestMessageTimestamp: p.latestMessageTimestamp, checkInState: p.checkInState,
          checkInEndTime: p.checkInEndTime, alertLevel: p.alertLevel, trackingState: p.trackingState,
          trackingStartTime: p.trackingStartTime, trackingRoute: p.trackingRoute, lastQuickAlert: p.lastQuickAlert,
        })
      } catch { /* ignore */ }
    }
    if (e.key === USER_KEY && e.newValue) {
      try { useStore.setState({ userProfile: JSON.parse(e.newValue) }) } catch { /* ignore */ }
    }
    if (e.key === HISTORY_KEY && e.newValue) {
      try { useStore.setState({ alertHistory: JSON.parse(e.newValue) }) } catch { /* ignore */ }
    }
  })
}
