import { useState } from "react"

type Props = {
  power: boolean
  onChange: (power: boolean) => Promise<boolean>
}

export default function PowerToggle({ power, onChange }: Props) {
  const [failed, setFailed] = useState(false)

  async function togglePower() {
    setFailed(false)
    const updated = await onChange(!power)
    setFailed(!updated)
  }

  return (
    <div>
      <div className="control-row">
        <div>
          <p className="t-label">LED 전원</p>
          <p className="t-caption muted">{power ? "켜짐" : "꺼짐"}</p>
        </div>
        <button
          className="power-switch"
          type="button"
          role="switch"
          aria-checked={power}
          aria-label="LED 전원"
          onClick={() => void togglePower()}
        >
          <span className="switch-handle" />
        </button>
      </div>
      {failed && (
        <p className="t-caption power-error">전원 변경 실패, 다시 시도</p>
      )}
    </div>
  )
}
