import { useEffect, useRef, type TextareaHTMLAttributes } from 'react'

/**
 * A textarea that grows with its content. `field-sizing: content` would do
 * this in CSS, but browser support is still patchy enough that ten lines of
 * JS is the cheaper certainty.
 */
export function AutoTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [props.value])

  return <textarea {...props} ref={ref} className={props.className ?? 'textarea'} rows={1} />
}
