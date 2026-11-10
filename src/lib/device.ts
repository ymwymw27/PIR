import type { RealtimeChannel } from "@supabase/supabase-js"
import { DEVICE_ID, MAX_POINTS, SENSOR_MAX, SENSOR_MIN } from "../product"
import { db, DEMO_MODE } from "./supabase"

export type Reading = {
  value: number
  created_at: string
}
export type Status = "disconnected" | "connecting" | "connected" | "error"

type ConnectOptions = {
  onInit: (rows: Reading[]) => void
  onReading: (row: Reading) => void
  onStatus: (status: Status) => void
}

let channel: RealtimeChannel | null = null
let demoTimer: ReturnType<typeof setInterval> | null = null
let demoPower = true
let notifyStatus: ((status: Status) => void) | null = null

export async function connectSensor(opts: ConnectOptions): Promise<void> {
  await disconnectSensor()
  notifyStatus = opts.onStatus
  opts.onStatus("connecting")

  if (DEMO_MODE || !db) {
    opts.onInit([])
    opts.onStatus("connected")
    const startedAt = Date.now()

    demoTimer = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      const wave = (Math.sin(elapsed * 0.72) + 1) / 2
      const detail = Math.sin(elapsed * 2.1) * 0.06
      const normalized = Math.max(0, Math.min(1, wave + detail))

      opts.onReading({
        value: Math.round(SENSOR_MIN + normalized * (SENSOR_MAX - SENSOR_MIN)),
        created_at: new Date().toISOString(),
      })
    }, 500)
    return
  }

  const { data, error } = await db
    .from("sensor_readings")
    .select("value, created_at")
    .eq("device_id", DEVICE_ID)
    .order("created_at", { ascending: false })
    .limit(MAX_POINTS)

  if (error) {
    opts.onStatus("error")
    return
  }

  opts.onInit([...(data ?? [])].reverse() as Reading[])
  channel = db
    .channel(`sensor-readings-${DEVICE_ID}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "sensor_readings",
        filter: `device_id=eq.${DEVICE_ID}`,
      },
      (payload) => opts.onReading(payload.new as Reading),
    )
    .subscribe((subscriptionStatus) => {
      if (subscriptionStatus === "SUBSCRIBED") opts.onStatus("connected")
      if (
        subscriptionStatus === "CHANNEL_ERROR" ||
        subscriptionStatus === "TIMED_OUT"
      ) {
        opts.onStatus("error")
      }
    })
}

export async function disconnectSensor(): Promise<void> {
  if (demoTimer) {
    clearInterval(demoTimer)
    demoTimer = null
  }
  if (channel && db) {
    await db.removeChannel(channel)
    channel = null
  }
  notifyStatus?.("disconnected")
  notifyStatus = null
}

export async function setLedPower(on: boolean): Promise<boolean> {
  if (DEMO_MODE || !db) {
    demoPower = on
    return true
  }

  const { error } = await db
    .from("device_state")
    .update({ led_on: on, updated_at: new Date().toISOString() })
    .eq("device_id", DEVICE_ID)

  return !error
}

export async function loadPower(): Promise<boolean> {
  if (DEMO_MODE || !db) return demoPower

  const { data, error } = await db
    .from("device_state")
    .select("led_on")
    .eq("device_id", DEVICE_ID)
    .single()

  return error ? false : Boolean(data?.led_on)
}
