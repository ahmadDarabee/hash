# Wojak Rive asset

Place your exported Rive file here as:

```
frontend/public/rive/wojak.riv
```

The app loads it from `/rive/wojak.riv` (see `src/components/wojak/RiveCharacter.tsx`).
Until you add the file, the component falls back to a plain "W" placeholder.

## Required Rive structure

- One **state machine** named `Wojak`.
- **Boolean inputs** (one per mood, exact names):
  `idle`, `happy`, `sad`, `confused`, `excited`, `loading`, `error`,
  `login_success`, `logout`, `add_to_cart`, `cancel_order`, `empty_cart`,
  `first_visit`, `language_switch`.
- One **trigger input** named `poke` (fired on click).

The wrapper sets the boolean input matching the current mood to `true` and all
others to `false`, and calls `fire()` on the `poke` trigger.

## Important

- **No audio.** The character must never produce voice/sound.
- Keep the art PG and safe for a chemical factory brand.
