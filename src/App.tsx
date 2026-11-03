import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

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

const chartPoints = [
  [0, 100],
  [36, 100],
  [44, 99],
  [51, 57],
  [58, 100],
  [105, 100],
  [113, 74],
  [121, 100],
  [172, 100],
  [180, 34],
  [189, 100],
  [237, 100],
  [245, 62],
  [254, 100],
  [292, 100],
  [300, 45],
  [309, 100],
  [358, 100],
  [366, 67],
  [374, 100],
  [425, 100],
  [433, 81],
  [441, 100],
  [493, 100],
  [501, 38],
  [510, 100],
  [557, 100],
  [565, 52],
  [574, 100],
  [621, 100],
  [629, 72],
  [638, 100],
  [680, 100],
]

const linePath = chartPoints
  .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
  .join(" ")
const areaPath = `${linePath} L 680 132 L 0 132 Z`

export default function App() {
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
              시스템 상태
            </span>
            <span className="size-2 rounded-full bg-[#34a478] shadow-[0_0_0_4px_rgba(52,164,120,0.12)]" />
          </div>
          <p className="text-sm font-bold text-[#203b32]">모든 시스템 정상</p>
          <p className="mt-1 text-xs text-[#8a9692]">마지막 확인 1분 전</p>
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
            <span className="size-2 rounded-full bg-[#34a478]" />
            실시간 모니터링 중
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
              <ClockIcon className="size-4 text-[#6f7e79]" />
              2025년 5월 28일
            </div>
          </div>

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
                      PIR-01 · 회의실 A
                    </p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#b8efda] backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-[#67d5a9]" />
                    ONLINE
                  </span>
                </div>

                <div className="my-auto flex items-center gap-6 py-8">
                  <div className="relative flex size-[114px] shrink-0 items-center justify-center">
                    <span className="absolute inset-0 animate-pulse rounded-full bg-[#75d6af]/10" />
                    <span className="absolute inset-[14px] rounded-full border border-[#75d6af]/25" />
                    <div className="relative flex size-[66px] items-center justify-center rounded-full bg-[#75d6af] text-[#12382f] shadow-[0_0_34px_rgba(117,214,175,0.3)]">
                      <SensorIcon className="size-9" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-[72px] font-bold leading-none tracking-[-0.07em] sm:text-[82px]">
                        1
                      </strong>
                      <span className="text-sm font-medium text-white/50">
                        HIGH
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-[#b8efda]">
                      움직임 감지됨
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs">
                  <span className="text-white/45">마지막 업데이트</span>
                  <span className="font-medium text-white/80">
                    오늘 14:32:08
                  </span>
                </div>
              </div>
            </article>

            <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-1">
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    오늘 감지 횟수
                  </p>
                  <p className="mt-3 text-[32px] font-bold tracking-[-0.04em] text-[#1d302a]">
                    128
                    <span className="ml-1 text-sm font-medium text-[#87938f]">
                      회
                    </span>
                  </p>
                </div>
                <span className="mt-4 inline-flex rounded-full bg-[#eaf6f0] px-2.5 py-1 text-xs font-bold text-[#338060] xl:mt-0">
                  +12.5%
                </span>
              </article>
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    최근 감지
                  </p>
                  <p className="mt-3 text-[32px] font-bold tracking-[-0.04em] text-[#1d302a]">
                    2
                    <span className="ml-1 text-sm font-medium text-[#87938f]">
                      분 전
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex size-10 items-center justify-center rounded-xl bg-[#f0f4f2] text-[#527066] xl:mt-0">
                  <ClockIcon className="size-5" />
                </div>
              </article>
              <article className="rounded-[20px] border border-[#e2e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(34,56,48,0.04)] sm:col-span-1 xl:flex xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#75827d]">
                    센서 상태
                  </p>
                  <p className="mt-3 text-[22px] font-bold tracking-[-0.03em] text-[#1d302a]">
                    정상 작동
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
                  시간별 움직임 변화
                </h2>
                <p className="mt-1 text-xs text-[#8a9692]">
                  최근 24시간 동안의 PIR 센서 감지 기록
                </p>
              </div>
              <div className="rounded-xl bg-[#f3f6f5] px-3.5 py-2 text-xs font-semibold text-[#52645e]">
                최근 24시간
              </div>
            </div>

            <div className="mt-8 flex min-h-[240px]">
              <div className="flex w-10 shrink-0 flex-col justify-between pb-7 text-[10px] font-medium text-[#9aa49f]">
                <span>1.0</span>
                <span>0.5</span>
                <span>0</span>
              </div>
              <div className="min-w-0 flex-1">
                <svg
                  className="h-[205px] w-full overflow-visible"
                  viewBox="0 0 680 132"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="24시간 PIR 움직임 감지 선 그래프"
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
                    cx="501"
                    cy="38"
                    r="4.5"
                    fill="white"
                    stroke="#3f9b77"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="mt-3 flex justify-between text-[10px] font-medium text-[#9aa49f]">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 text-xs text-[#6f7d78]">
              <span className="h-0.5 w-5 bg-[#3f9b77]" />
              PIR 감지값
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
