import { useEffect, useState, type SVGProps } from "react"
import { supabase } from "./lib/supabase"

type IconProps = SVGProps<SVGSVGElement>

type Reading = {
  id?: number | string
  value: number
  created_at: string
}

type RealtimeStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error"

const DEVICE_ID = "lamp-01"

function parseReading(row: Record<string, unknown>): Reading | null {
  if (row.device_id !== DEVICE_ID) return null
  if (typeof row.value !== "number" || !Number.isFinite(row.value)) return null
  if (
    typeof row.created_at !== "string" ||
    !Number.isFinite(Date.parse(row.created_at))
  ) {
    return null
  }

  return {
    ...(typeof row.id === "number" || typeof row.id === "string"
      ? { id: row.id }
      : {}),
    value: row.value,
    created_at: row.created_at,
  }
}

function readingKey(reading: Reading) {
  return reading.id === undefined
    ? `${reading.created_at}:${reading.value}`
    : String(reading.id)
}

function mergeReadings(...groups: Reading[][]) {
  const unique = new Map<string, Reading>()
  groups.flat().forEach((reading) => unique.set(readingKey(reading), reading))
  return [...unique.values()].sort(
    (first, second) =>
      new Date(first.created_at).getTime() -
      new Date(second.created_at).getTime(),
  )
}

function ActivityIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 12h3l2.1-6 4.2 12 2.1-6H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function SensorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <path
        d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.3 5.3a9.5 9.5 0 0 0 0 13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M19 13.2v-2.4l-2-.6a7.8 7.8 0 0 0-.7-1.6l1-1.8-1.7-1.7-1.8 1a7.8 7.8 0 0 0-1.6-.7l-.6-2H9.2l-.6 2a7.8 7.8 0 0 0-1.6.7l-1.8-1-1.7 1.7 1 1.8a7.8 7.8 0 0 0-.7 1.6l-2 .6v2.4l2 .6c.2.6.4 1.1.7 1.6l-1 1.8 1.7 1.7 1.8-1c.5.3 1 .5 1.6.7l.6 2h2.4l.6-2c.6-.2 1.1-.4 1.6-.7l1.8 1 1.7-1.7-1-1.8c.3-.5.5-1 .7-1.6l2-.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7.5v5l3.2 1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function App() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [realtimeStatus, setRealtimeStatus] =
    useState<RealtimeStatus>("connecting")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const currentReading = readings[readings.length - 1] ?? null
  const currentValue = currentReading?.value ?? null
  const values = readings.map((reading) => reading.value)
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 1
  const range = maximum - minimum
  const chartPoints = values.map((value, index) => [
    values.length === 1 ? 680 : (index / (values.length - 1)) * 680,
    range === 0 ? 66 : 132 - ((value - minimum) / range) * 132,
  ])
  const linePath = chartPoints
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ")
  const areaPath = chartPoints.length
    ? `${linePath} L 680 132 L ${chartPoints[0][0]} 132 Z`
    : ""
  const formatValue = (value: number) =>
    new Intl.NumberFormat(undefined, { maximumSignificantDigits: 6 }).format(
      value,
    )
  const axisMaximum = range === 0 ? maximum + 1 : maximum
  const axisMinimum = range === 0 ? minimum - 1 : minimum
  const axisMiddle = (axisMaximum + axisMinimum) / 2
  const currentPoint = chartPoints[chartPoints.length - 1]
  const realtimeLabel = {
    connecting: "연결 중",
    connected: "실시간 연결",
    reconnecting: "재연결 중",
    disconnected: "연결 종료",
    error: "연결 오류",
  }[realtimeStatus]
  const lastUpdated = currentReading
    ? new Date(currentReading.created_at).toLocaleString()
    : "데이터 대기 중"

  useEffect(() => {
    const configuredClient = supabase
    if (!configuredClient) {
      setRealtimeStatus("error")
      setConnectionError(
        "Supabase 설정을 찾을 수 없습니다. 프로젝트 루트의 .env를 확인하세요.",
      )
      return
    }
    const client: NonNullable<typeof configuredClient> = configuredClient

    let active = true
    let loadedHistory = false
    let loadingHistory = false
    let pendingReadings: Reading[] = []

    async function loadHistory() {
      if (loadingHistory) return
      loadingHistory = true
      const { data, error } = await client
        .from("sensor_readings")
        .select("id, value, created_at")
        .eq("device_id", DEVICE_ID)
        .order("created_at", { ascending: false })
        .limit(100)

      if (!active) return
      if (error) {
        setConnectionError(
          `최신 센서 기록을 불러오지 못했습니다: ${error.message}`,
        )
        setRealtimeStatus("error")
        return
      }

      const history = (data ?? [])
        .map((row) => parseReading(row as Record<string, unknown>))
        .filter((reading): reading is Reading => reading !== null)
      const merged = mergeReadings(history, pendingReadings).slice(-100)
      pendingReadings = []
      loadedHistory = true
      setReadings(merged)
      setHistoryLoaded(true)
      setConnectionError(null)
    }

    const channel = client
      .channel(`sensor-readings-${DEVICE_ID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `device_id=eq.${DEVICE_ID}`,
        },
        (payload) => {
          const reading = parseReading(payload.new as Record<string, unknown>)
          if (!reading) return

          if (!loadedHistory) {
            pendingReadings = [...pendingReadings.slice(-99), reading]
            return
          }

          setReadings((current) =>
            mergeReadings(current, [reading]).slice(-100),
          )
        },
      )
      .subscribe((status, error) => {
        if (!active) return
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("connected")
          setConnectionError(null)
          void loadHistory()
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("error")
          setConnectionError(
            `Supabase Realtime 연결 실패${
              error?.message ? `: ${error.message}` : "."
            }`,
          )
        } else if (status === "CLOSED") {
          setRealtimeStatus("disconnected")
        } else {
          setRealtimeStatus("reconnecting")
        }
      })

    return () => {
      active = false
      void client.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#17231f] lg:flex">
      <aside className="hidden w-[248px] shrink-0 border-r border-[#e2e8e5] bg-white px-5 py-7 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#173f35] text-white">
            <ActivityIcon className="size-6" />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-[-0.02em]">
              SENSE FLOW
            </p>
            <p className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-[#87938f]">
              SMART MONITORING
            </p>
          </div>
        </div>

        <nav className="mt-12 space-y-2" aria-label="주요 메뉴">
          <div className="flex items-center gap-3 rounded-xl bg-[#edf5f1] px-3.5 py-3 text-sm font-semibold text-[#17493c]">
            <GridIcon className="size-5" />
            대시보드
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#6f7c78]">
            <SensorIcon className="size-5" />
            센서 관리
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#6f7c78]">
            <SettingsIcon className="size-5" />
            설정
          </div>
        </nav>

        <div className="mt-auto rounded-2xl border border-[#e3ebe7] bg-[#f8faf9] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#51605b]">
              Supabase 상태
            </span>
            <span
              className={`size-2 rounded-full ${
                realtimeStatus === "connected"
                  ? "bg-[#34a478] shadow-[0_0_0_4px_rgba(52,164,120,0.12)]"
                  : "bg-[#d19a3b]"
              }`}
            />
          </div>
          <p className="text-sm font-bold text-[#203b32]">{realtimeLabel}</p>
          <p className="mt-1 text-xs text-[#8a9692]">
            sensor_readings · {DEVICE_ID}
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-[#e2e8e5] bg-white px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#173f35] text-white">
              <ActivityIcon className="size-5" />
            </div>
            <span className="text-sm font-bold">SENSE FLOW</span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-[#77847f] lg:flex">
            <span
              className={`size-2 rounded-full ${
                realtimeStatus === "connected" ? "bg-[#34a478]" : "bg-[#d19a3b]"
              }`}
            />
            {realtimeLabel}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">관리자</p>
              <p className="text-[11px] text-[#8c9894]">시설 운영팀</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#dceae4] text-xs font-bold text-[#285647]">
              AM
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.12em] text-[#358064]">
                PIR SENSOR
              </p>
              <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#15241f] sm:text-[34px]">
                움직임 감지 대시보드
              </h1>
              <p className="mt-2 text-sm text-[#7c8984]">
                공간의 움직임을 실시간으로 모니터링합니다.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#dde4e1] bg-white px-4 py-2.5 text-sm font-semibold text-[#4f5e59] shadow-sm">
              <span
                className={`size-2 rounded-full ${
                  realtimeStatus === "connected"
                    ? "bg-[#34a478]"
                    : "bg-[#d19a3b]"
                }`}
              />
              Supabase · {realtimeLabel}
            </div>
          </div>
          {connectionError && (
            <p
              className="mb-5 rounded-xl border border-[#f1d5d2] bg-[#fff7f6] px-4 py-3 text-sm text-[#9c443d]"
              role="alert"
            >
              {connectionError}
            </p>
          )}

          <section
            className="grid gap-5 xl:grid-cols-[1.05fr_1.55fr]"
            aria-label="현재 센서 상태"
          >
            <article className="relative min-h-[350px] overflow-hidden rounded-[24px] bg-[#173f35] p-7 text-white shadow-[0_18px_50px_rgba(22,63,53,0.15)] sm:p-8">
              <div className="absolute -right-20 -top-20 size-64 rounded-full border border-white/10" />
              <div className="absolute -right-6 -top-6 size-40 rounded-full border border-white/10" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/65">
                      현재 센서값
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Supabase · sensor_readings.value
                    </p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#b8efda] backdrop-blur-sm">
                    <span
                      className={`size-1.5 rounded-full ${
                        realtimeStatus === "connected"
                          ? "bg-[#67d5a9]"
                          : "bg-white/40"
                      }`}
                    />
                    {realtimeLabel}
                  </span>
                </div>

                <div className="my-auto flex items-center gap-6 py-8">
                  <div className="relative flex size-[114px] shrink-0 items-center justify-center">
                    <span
                      className={`absolute inset-0 rounded-full bg-[#75d6af]/10 ${
                        currentReading ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="absolute inset-[14px] rounded-full border border-[#75d6af]/25" />
                    <div className="relative flex size-[66px] items-center justify-center rounded-full bg-[#75d6af] text-[#12382f] shadow-[0_0_34px_rgba(117,214,175,0.3)]">
                      <SensorIcon className="size-9" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-[72px] font-bold leading-none tracking-[-0.07em] sm:text-[82px]">
                        {currentValue === null
                          ? "—"
                          : formatValue(currentValue)}
                      </strong>
                      <span className="text-sm font-medium text-white/50">
                        {currentValue === null ? "" : "최신"}
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-[#b8efda]">
                      {currentValue === null
                        ? historyLoaded
                          ? "저장된 센서값이 없습니다"
                          : "센서값 불러오는 중"
                        : "sensor_readings 테이블 최신 값"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs">
                  <span className="text-white/45">마지막 업데이트</span>
                  <span className="font-medium text-white/80">
                    {lastUpdated}
                  </span>
                </div>
              </div>
            </article>

            <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-1">
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    그래프 데이터
                  </p>
                  <p className="mt-3 text-[32px] font-bold tracking-[-0.04em] text-[#1d302a]">
                    {readings.length}
                    <span className="ml-1 text-sm font-medium text-[#87938f]">
                      / 100개
                    </span>
                  </p>
                </div>
                <ActivityIcon className="mt-4 size-6 text-[#338060] xl:mt-0" />
              </article>
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    최신 기록 시각
                  </p>
                  <p className="mt-3 text-lg font-bold tracking-[-0.04em] text-[#1d302a]">
                    {currentReading
                      ? new Date(currentReading.created_at).toLocaleTimeString()
                      : "—"}
                  </p>
                </div>
                <div className="mt-4 flex size-10 items-center justify-center rounded-xl bg-[#f0f4f2] text-[#527066] xl:mt-0">
                  <ClockIcon className="size-5" />
                </div>
              </article>
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    실시간 구독
                  </p>
                  <p className="mt-3 text-[22px] font-bold tracking-[-0.03em] text-[#1d302a]">
                    {realtimeLabel}
                  </p>
                </div>
                <div className="mt-4 flex size-10 items-center justify-center rounded-xl bg-[#eaf6f0] text-[#338060] xl:mt-0">
                  <ActivityIcon className="size-5" />
                </div>
              </article>
            </div>
          </section>

          <section className="mt-5 rounded-[24px] border border-[#e2e8e5] bg-white p-5 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.025em] text-[#1b2e28]">
                  실시간 센서값
                </h2>
                <p className="mt-1 text-xs text-[#8a9692]">
                  Supabase sensor_readings 테이블의 최신 value 기록
                </p>
              </div>
              <div className="rounded-xl bg-[#f3f6f5] px-3.5 py-2 text-xs font-semibold text-[#52645e]">
                최근 {readings.length} / 100개
              </div>
            </div>

            <div className="mt-8 flex min-h-[240px]">
              <div className="flex w-10 shrink-0 flex-col justify-between pb-7 text-[10px] font-medium text-[#9aa49f]">
                <span>{formatValue(axisMaximum)}</span>
                <span>{formatValue(axisMiddle)}</span>
                <span>{formatValue(axisMinimum)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <svg
                  className="h-[205px] w-full overflow-visible"
                  viewBox="0 0 680 132"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Supabase sensor_readings의 최근 100개 센서값 실시간 선 그래프"
                >
                  <defs>
                    <linearGradient
                      id="activityFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4ca582"
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor="#4ca582"
                        stopOpacity="0.01"
                      />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1="0"
                    x2="680"
                    y2="0"
                    stroke="#e9eeeb"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                  <line
                    x1="0"
                    y1="66"
                    x2="680"
                    y2="66"
                    stroke="#e9eeeb"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                  <line
                    x1="0"
                    y1="132"
                    x2="680"
                    y2="132"
                    stroke="#e9eeeb"
                    strokeWidth="1"
                  />
                  <path d={areaPath} fill="url(#activityFill)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#3f9b77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={currentPoint?.[0] ?? 0}
                    cy={currentPoint?.[1] ?? 66}
                    r={currentPoint ? "4.5" : "0"}
                    fill="white"
                    stroke="#3f9b77"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="mt-3 flex justify-between text-[10px] font-medium text-[#9aa49f]">
                  <span>오래된 값</span>
                  <span>현재</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 text-xs text-[#6f7d78]">
              <span className="h-0.5 w-5 bg-[#3f9b77]" />
              sensor_readings.value
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
