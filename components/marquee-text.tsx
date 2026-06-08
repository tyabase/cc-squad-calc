"use client"

import { useEffect, useRef, useState } from "react"

/**
 * 名称跑马灯：仅当文本宽度超出容器时才自动左右滚动，
 * 滚到尽头后平滑返回，循环往复。不显示滚动条。
 */
export function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    function measure() {
      const c = containerRef.current
      const t = textRef.current
      if (!c || !t) return
      const overflow = t.scrollWidth - c.clientWidth
      setDistance(overflow > 2 ? overflow : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    if (textRef.current) ro.observe(textRef.current)
    return () => ro.disconnect()
  }, [text])

  // 滚动时长随文本长度自适应，速度约 40px/秒
  const duration = distance > 0 ? Math.max(4, distance / 40) : 0

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={textRef}
        className={className}
        style={
          distance > 0
            ? {
                display: "inline-block",
                whiteSpace: "nowrap",
                willChange: "transform",
                animation: `marquee-scroll ${duration}s ease-in-out infinite alternate`,
                ["--marquee-distance" as string]: `-${distance}px`,
              }
            : { display: "inline-block", whiteSpace: "nowrap" }
        }
      >
        {text}
      </span>
    </div>
  )
}
