import { useEffect, useRef, useState } from "react"
import type { Reading } from "../lib/device"
import { SENSOR_MAX } from "../product"

type Props = {
  readings: Reading[]
}

const HEIGHT = 200
const MARGIN = { left: 40, right: 8, top: 8, bottom: 20 }

export default function SensorChart({ readings }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const points = readings
    .map((reading, index) => {
      const x =
        MARGIN.left +
        (readings.length < 2
          ? plotWidth
          : (index / (readings.length - 1)) * plotWidth)
      const normalized = Math.max(0, Math.min(1, reading.value / SENSOR_MAX))
      const y = MARGIN.top + (1 - normalized) * plotHeight
      return `${x},${y}`
    })
    .join(" ")
  const currentValue = readings.at(-1)?.value
  const ticks = [SENSOR_MAX, Math.round(SENSOR_MAX / 2), 0]

  return (
    <section className="chart-section" aria-label="실시간 센서값">
      <div ref={containerRef} className="chart-container">
        {readings.length === 0 ? (
          <p className="t-body chart-empty">
            센서를 연결하면 값이 여기에 그려집니다.
          </p>
        ) : (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={`센서값 추이, 현재 ${currentValue}`}
          >
            {ticks.map((tick, index) => {
              const y = MARGIN.top + (index / (ticks.length - 1)) * plotHeight
              return (
                <g key={tick}>
                  <line
                    x1={MARGIN.left}
                    y1={y}
                    x2={width - MARGIN.right}
                    y2={y}
                    className="chart-grid-line"
                  />
                  <text
                    x={MARGIN.left - MARGIN.right}
                    y={y + 4}
                    textAnchor="end"
                  >
                    {tick.toLocaleString()}
                  </text>
                </g>
              )
            })}
            <polyline points={points} className="chart-line" />
            <text x={MARGIN.left} y={HEIGHT - 2}>
              −60s
            </text>
            <text x={width - MARGIN.right} y={HEIGHT - 2} textAnchor="end">
              지금
            </text>
          </svg>
        )}
      </div>
    </section>
  )
}
