import i18n from '../../i18n'
import { wojakChat } from '../../services/endpoints'

export interface WojakChatReply {
  intent: string
  state: string
  text: string
}

// Chat service seam. v1 uses the rule-based backend; an LLM adapter can
// implement this same interface later without touching the chat UI.
export interface WojakChatService {
  reply(message: string): Promise<WojakChatReply>
}

function pickLine(key: string, fallbackKey: string, counter: Map<string, number>): string {
  const raw = i18n.t(key, { returnObjects: true, defaultValue: [] as string[] }) as unknown
  const fallbackRaw = i18n.t(fallbackKey, {
    returnObjects: true,
    defaultValue: [] as string[],
  }) as unknown

  const lines = Array.isArray(raw) && raw.length > 0 ? raw : []
  const fallback = Array.isArray(fallbackRaw) && fallbackRaw.length > 0 ? fallbackRaw : ['...']
  const source = lines.length > 0 ? lines : fallback

  const index = counter.get(key) ?? 0
  counter.set(key, index + 1)
  return source[index % source.length]
}

export class BackendWojakChatService implements WojakChatService {
  private counters = new Map<string, number>()

  async reply(message: string): Promise<WojakChatReply> {
    const result = await wojakChat(message)
    const text = pickLine(`wojak.intents.${result.intent}`, 'wojak.intents.fallback', this.counters)
    return { intent: result.intent, state: result.state, text }
  }
}
