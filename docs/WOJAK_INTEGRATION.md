# Wojak integration guide

Wojak is a reactive character and a rule-based chatbot. It is rendered as a
simple inline SVG (no Rive, no animation runtime, no audio).

## Reactive mode: Redux → wojakBus → SVG face

App events already exist as Redux actions. A single middleware maps those
actions to Wojak moods.

```
Redux action (e.g. auth/login/fulfilled)
        │
        ▼
wojakBus (src/features/wojak/wojakBus.ts)   ← Redux middleware
        │  matches action.type, dispatches setMood(...)
        ▼
wojakSlice (src/features/wojak/wojakSlice.ts)
        │  holds: mood, poke counter, visible, chat state
        ▼
Wojak component (src/components/wojak/Wojak.tsx)
        │  passes mood + pokeToken to WojakFace
        ▼
WojakFace (src/components/wojak/WojakFace.tsx)
        │  maps mood → expression (eyes + mouth SVG shapes)
        ▼
inline <svg> face
```

### Mood → expression map (in `WojakFace.tsx`)

| Mood | Expression |
| --- | --- |
| `idle` | neutral |
| `happy`, `login_success`, `add_to_cart` | happy |
| `sad`, `logout`, `cancel_order`, `empty_cart` | sad |
| `confused` | confused |
| `error` | error (X eyes) |
| `loading` | loading (closed eyes) |
| `excited`, `first_visit`, `language_switch` | excited |

### Current reaction map (in `wojakBus.ts`)

| Action | Mood |
| --- | --- |
| `auth/login/fulfilled` | `login_success` |
| `auth/register/fulfilled` | `login_success` |
| `auth/logout/fulfilled` | `logout` |
| `cart/addItem` | `add_to_cart` |
| `cart/clearCart` | `empty_cart` |
| `i18n/setLanguage` | `language_switch` |
| any `.../rejected` | `error` |

Additional triggers:

- **first_visit** — `Wojak.tsx` dispatches `setMood('first_visit')` once per
  browser (guarded by `hash.visited` in localStorage).
- **poke** — clicking the character dispatches `triggerPoke()`, which
  increments `poke`; `WojakFace` briefly applies the `.wojak-poke` CSS squash
  animation (defined in `src/index.css`).
- **idle** — the default mood/expression.

Reaction captions: `Wojak.tsx` shows a short localized line from
`wojak.reactions.<mood>` in a bubble for ~4 seconds.

### Adding a reaction / expression

1. Add the mood to the `WojakMood` union in `wojakSlice.ts`.
2. Map it in `WojakFace.tsx`'s `EXPRESSION` table (or add a new expression and
   its eyes/mouth SVG in `EYES` / `MOUTH`).
3. Add a rule in `wojakBus.ts`.
4. (Optional) add a caption under `wojak.reactions.<mood>` in both
   `src/i18n/ar.json` and `src/i18n/en.json`.

## Chat mode

```
WojakChatPanel (user types a message)
        │
        ▼
BackendWojakChatService (src/features/wojak/WojakChatService.ts)
        │  POST /api/v1/wojak/chat  { message }
        ▼
backend /wojak/chat → WojakChat use case → RuleBasedWojakChatService
        │  rule-based intents only (no LLM yet)
        ▼
{ intent, state }
        │
        ▼
BackendWojakChatService maps intent → localized line via i18n
(wojak.intents.<intent>, with fallback to wojak.intents.fallback)
        │
        ▼
dispatch(addMessage(...)) + dispatch(setMood(state))
```

Intents: `greeting`, `help`, `product`, `sds`, `pricing`, `contact`, `fallback`.

### Swapping in an LLM later

- **Backend**: implement `WojakChatService` (in `application/ports/wojak.py`)
  with an LLM adapter and change the `get_wojak_service` provider in
  `api/deps.py`. The use case and router are unchanged.
- **Frontend**: implement the `WojakChatService` interface
  (`src/features/wojak/WojakChatService.ts`) with an LLM-backed class and
  instantiate it in `WojakChatPanel.tsx`.

## Rules

- Wojak is visible by default and hideable; the choice persists in
  `localStorage` (`hash.wojak.visible`) and Redux.
- All Wojak lines live in `src/i18n/{ar,en}.json` under `wojak.*`.
- Never joke about chemical safety, injuries, SDS warnings, or anything that
  could be read as real safety advice.
