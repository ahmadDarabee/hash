import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useRive } from '@rive-app/react-canvas'

// Minimal runtime surface we use. Kept local so the wrapper stays resilient
// to minor version differences in the Rive runtime types.
interface RiveInput {
  name: string
  type: string
  value?: boolean | number
  fire?: () => void
}

interface RiveRuntime {
  stateMachineInputs: (name: string) => RiveInput[] | undefined
}

interface RiveCharacterProps {
  src: string
  stateMachine: string
  mood: string
  pokeToken: number
  className?: string
  fallback: ReactNode
}

export function RiveCharacter({
  src,
  stateMachine,
  mood,
  pokeToken,
  className,
  fallback,
}: RiveCharacterProps) {
  const [failed, setFailed] = useState(false)
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    onLoadError: () => setFailed(true),
  })
  const prevPoke = useRef(pokeToken)

  // Set the boolean input matching the current mood; reset the others.
  useEffect(() => {
    if (!rive) return
    const runtime = rive as unknown as RiveRuntime
    try {
      const inputs = runtime.stateMachineInputs(stateMachine) ?? []
      for (const input of inputs) {
        if (input.type === 'Boolean' && typeof input.value === 'boolean') {
          input.value = input.name === mood
        }
      }
    } catch {
      // Ignore until the .riv asset with matching inputs is wired up.
    }
  }, [rive, mood, stateMachine])

  // Fire the "poke" trigger whenever pokeToken changes.
  useEffect(() => {
    if (!rive || pokeToken === prevPoke.current) return
    prevPoke.current = pokeToken
    const runtime = rive as unknown as RiveRuntime
    try {
      const inputs = runtime.stateMachineInputs(stateMachine) ?? []
      inputs.find((input) => input.name === 'poke')?.fire?.()
    } catch {
      // Ignore until the .riv asset with a "poke" trigger is wired up.
    }
  }, [rive, pokeToken, stateMachine])

  if (failed) {
    return <>{fallback}</>
  }

  return (
    <div className={className}>
      <RiveComponent />
    </div>
  )
}
