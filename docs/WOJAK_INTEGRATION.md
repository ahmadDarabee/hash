# Wojak integration guide

Wojak is a reactive character and a rule-based chatbot. It never plays audio.

## Reactive mode: Redux → wojakBus → Rive

App events already exist as Redux actions. A single middleware maps those
actions to Wojak moods.

```
Redux action (e.g. auth/login/fulfilled)
        │
        ▼
wojakBus (src/features/wojak/wojakBus.ts)  ← Redux middleware
        │  matches action.type, dispatches setMood(...)
        ▼
wojakSlice (src/features/wojak/wojakSlice.ts)
        │  holds: mood, poke counter, visible, chat state
        ▼
Wojak component (src/components/wojak/Wojak.tsx)
        │  passes mood + pokeToken to RiveCharacter
        ▼
RiveCharacter (src/components/wojak/RiveCharacter.tsx)
        │  sets the Rive boolean input named `mood` to true (others false)
        │  fires the `poke` trigger when pokeToken changes
        ▼
Rive state machine "Wojak" (frontend/public/rive/wojak.riv)
```

### Current reaction map (wojakBus.ts)

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

- **first_visit** — the `Wojak` component dispatches `setMood('first_visit')`
  once per browser (guarded by `hash.visited` in localStorage).
- **poke** — clicking the character dispatches `triggerPoke()`, which
  increments `poke`; `RiveCharacter` then fires the Rive `poke` trigger.
- **idle** — the Rive state machine's idle input is the default state.

### Adding a reaction

1. Add the mood to the `WojakMood` union in `wojakSlice.ts`.
2. Add a matching boolean input in the Rive state machine.
3. Add a rule in `wojakBus.ts`.
4. (Optional) add a caption under `wojak.reactions.<mood>` in both
   `src/i18n/ar.json` and `src/i18n/en.json`.

Reaction captions: `Wojak.tsx` shows a short localized line from
`wojak.reactions.<mood>` in a bubble for ~4 seconds.

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
