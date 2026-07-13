const FLIP_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const FLIP_DURATION_MS = 320

/**
 * Snapshot viewport tops of elements marked with data-flip-id.
 */
export function captureFlipTops(container: HTMLElement | null): Map<string, number> {
  const tops = new Map<string, number>()
  if (!container) return tops

  container.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((el) => {
    const id = el.dataset.flipId
    if (id) {
      tops.set(id, el.getBoundingClientRect().top)
    }
  })
  return tops
}

/**
 * Animate surviving flip-marked elements from their previous tops to current layout (FLIP).
 * New elements (no previous top) are left alone for enter animations.
 */
export function playFlip(
  container: HTMLElement | null,
  previousTops: Map<string, number>
): void {
  if (!container || previousTops.size === 0) return

  container.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((el) => {
    const id = el.dataset.flipId
    if (!id) return

    const prevTop = previousTops.get(id)
    if (prevTop == null) return

    const newTop = el.getBoundingClientRect().top
    const deltaY = prevTop - newTop
    if (Math.abs(deltaY) < 1) return

    el.style.transition = 'none'
    el.style.transform = `translateY(${deltaY}px)`
    void el.offsetHeight

    el.style.transition = `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING}`
    el.style.transform = 'translateY(0)'

    const cleanup = (event: TransitionEvent) => {
      if (event.propertyName !== 'transform') return
      el.style.transition = ''
      el.style.transform = ''
      el.removeEventListener('transitionend', cleanup)
    }
    el.addEventListener('transitionend', cleanup)
  })
}
