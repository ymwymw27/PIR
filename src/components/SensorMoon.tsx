import type { CSSProperties } from "react"
import type { Reading } from "../lib/device"
import { SENSOR_MAX, SENSOR_MIN } from "../product"

type Props = {
  reading?: Reading
  power: boolean
}

export default function SensorMoon({ reading, power }: Props) {
  const value = reading?.value
  const level =
    value === undefined
      ? 0
      : Math.max(
          0,
          Math.min(1, (value - SENSOR_MIN) / (SENSOR_MAX - SENSOR_MIN)),
        )
  const levelPercent = Math.round(level * 100)
  const moonStyle = { "--level": level } as CSSProperties

  return (
    <section className="moon-section" aria-label="조명 상태">
      <div
        className="moon"
        style={moonStyle}
        data-power={power ? "on" : "off"}
        role="img"
        aria-label={power ? `조명 밝기 ${levelPercent}%` : "조명 꺼짐"}
      >
        <img
          src="/images/GTA-6-Logo-PNG-from-Grand-Theft-Auto-VI-Transparent.png"
          alt=""
        />
      </div>
      <p className="t-value">
        {value === undefined ? "—" : value.toLocaleString()}
      </p>
    </section>
  )
}
