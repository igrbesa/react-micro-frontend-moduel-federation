import type { AppEventMap } from './cartEvents'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export const bus = {
  emit<EventName extends keyof AppEventMap>(
    event: EventName,
    data: AppEventMap[EventName],
  ) {
    if (!hasWindow()) return
    window.dispatchEvent(new CustomEvent(String(event), { detail: data }))
  },

  on<EventName extends keyof AppEventMap>(
    event: EventName,
    handler: (data: AppEventMap[EventName]) => void,
  ) {
    if (!hasWindow()) return () => {}

    const wrapper: EventListener = (e) => {
      const customEvent = e as CustomEvent<AppEventMap[EventName]>
      handler(customEvent.detail)
    }

    window.addEventListener(String(event), wrapper)
    return () => window.removeEventListener(String(event), wrapper)
  },
}
