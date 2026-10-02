import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Reactive moods. "poke" is handled separately as a squash animation (not a mood).
export type WojakMood =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'confused'
  | 'excited'
  | 'loading'
  | 'error'
  | 'login_success'
  | 'logout'
  | 'add_to_cart'
  | 'cancel_order'
  | 'empty_cart'
  | 'first_visit'
  | 'language_switch'

export interface ChatMessage {
  id: string
  role: 'user' | 'wojak'
  text: string
}

interface WojakState {
  visible: boolean
  mood: WojakMood
  poke: number
  chatOpen: boolean
  messages: ChatMessage[]
  typing: boolean
}

const initialState: WojakState = {
  visible: localStorage.getItem('hash.wojak.visible') !== 'false',
  mood: 'idle',
  poke: 0,
  chatOpen: false,
  messages: [],
  typing: false,
}

let nextMessageId = 0

const wojakSlice = createSlice({
  name: 'wojak',
  initialState,
  reducers: {
    setMood(state, action: PayloadAction<WojakMood>) {
      state.mood = action.payload
    },
    triggerPoke(state) {
      state.poke += 1
    },
    setVisible(state, action: PayloadAction<boolean>) {
      state.visible = action.payload
    },
    toggleVisible(state) {
      state.visible = !state.visible
    },
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload
    },
    addMessage(state, action: PayloadAction<{ role: 'user' | 'wojak'; text: string }>) {
      state.messages.push({ id: String(nextMessageId++), ...action.payload })
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.typing = action.payload
    },
  },
})

export const {
  setMood,
  triggerPoke,
  setVisible,
  toggleVisible,
  setChatOpen,
  addMessage,
  setTyping,
} = wojakSlice.actions
export default wojakSlice.reducer
