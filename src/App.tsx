import { useEffect, useState } from "react"
import ConnectionControl from "./components/ConnectionControl"
import PowerToggle from "./components/PowerToggle"
import ProductHeader from "./components/ProductHeader"
import SensorChart from "./components/SensorChart"
import SensorMoon from "./components/SensorMoon"
import {
  connectSensor,
  disconnectSensor,
  loadPower,
  setLedPower,
  type Reading,
  type Status,
} from "./lib/device"
import { MAX_POINTS } from "./product"

export default function App() {
  const [status, setStatus] = useState<Status>("disconnected")
  const [power, setPower] = useState(false)
  const [readings, setReadings] = useState<Reading[]>([])

  useEffect(() => {
    let active = true

    void loadPower().then((initialPower) => {
      if (active) setPower(initialPower)
    })

    return () => {
      active = false
      void disconnectSensor()
    }
  }, [])

  async function handleConnect() {
    await connectSensor({
      onInit: (rows) => setReadings(rows.slice(-MAX_POINTS)),
      onReading: (row) => {
        setReadings((current) => [...current, row].slice(-MAX_POINTS))
      },
      onStatus: setStatus,
    })
  }

  async function handleDisconnect() {
    await disconnectSensor()
    setStatus("disconnected")
  }

  async function handlePowerChange(nextPower: boolean) {
    setPower(nextPower)
    const updated = await setLedPower(nextPower)
    if (!updated) setPower(!nextPower)
    return updated
  }

  return (
    <main className="app-shell">
      <ProductHeader />
      <SensorMoon reading={readings.at(-1)} power={power} />

      <div className="dashboard-grid">
        <section className="controls" aria-label="조명 제어">
          <ConnectionControl
            status={status}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <PowerToggle power={power} onChange={handlePowerChange} />
        </section>
        <SensorChart readings={readings} />
      </div>
    </main>
  )
}
