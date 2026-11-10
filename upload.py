import argparse
import math
import os
import sys
from pathlib import Path

import httpx
import serial
from dotenv import load_dotenv
from postgrest.exceptions import APIError
from serial.tools import list_ports
from supabase import Client, create_client

BAUD_RATE = 9600
DEVICE_ID = "lamp-01"
TABLE_NAME = "sensor_readings"


def choose_port() -> str:
    ports = sorted(list_ports.comports(), key=lambda port: port.device)
    if not ports:
        raise RuntimeError(
            "시리얼 포트를 찾을 수 없습니다. Arduino를 연결한 뒤 다시 실행하세요."
        )

    if len(ports) == 1:
        print(f"시리얼 포트: {ports[0].device} ({ports[0].description})")
        return ports[0].device

    print("사용 가능한 시리얼 포트:")
    for index, port in enumerate(ports, start=1):
        print(f"  {index}. {port.device} ({port.description})")

    while True:
        selection = input("Arduino 포트 번호를 선택하세요: ").strip()
        try:
            index = int(selection)
        except ValueError:
            print("목록에 표시된 번호를 입력하세요.")
            continue
        if 1 <= index <= len(ports):
            return ports[index - 1].device
        print("목록에 표시된 번호를 입력하세요.")


def parse_value(line: str) -> int:
    text = line.strip().split(",", maxsplit=1)[0].strip()
    try:
        numeric_value = float(text)
    except ValueError as error:
        raise ValueError("첫 번째 센서값이 숫자가 아닙니다.") from error
    if not math.isfinite(numeric_value) or not numeric_value.is_integer():
        raise ValueError("첫 번째 센서값은 유효한 정수여야 합니다.")
    return int(numeric_value)


def create_supabase_client() -> Client:
    env_path = Path(__file__).resolve().with_name(".env")
    load_dotenv(env_path)

    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_ANON_KEY")
    missing = [
        name
        for name, value in (
            ("VITE_SUPABASE_URL", url),
            ("VITE_SUPABASE_ANON_KEY", key),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(
            f"{env_path}에 다음 환경 변수를 설정하세요: {', '.join(missing)}"
        )

    return create_client(url, key)


def upload_readings(port_name: str, client: Client) -> None:
    print(f"{port_name}에 {BAUD_RATE} baud로 연결합니다. 종료하려면 Ctrl+C를 누르세요.")
    with serial.Serial(port_name, BAUD_RATE, timeout=1) as connection:
        while True:
            raw_line = connection.readline()
            if not raw_line:
                continue

            try:
                line = raw_line.decode("utf-8").strip()
                if not line:
                    continue
                value = parse_value(line)
            except (UnicodeDecodeError, ValueError) as error:
                print(f"잘못된 시리얼 데이터 무시: {error}", file=sys.stderr)
                continue

            try:
                client.table(TABLE_NAME).insert(
                    {"device_id": DEVICE_ID, "value": value}
                ).execute()
            except (APIError, httpx.HTTPError) as error:
                print(f"Supabase 저장 실패 (value={value}): {error}", file=sys.stderr)
                continue

            print(f"저장 완료: {value}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Arduino 시리얼 값을 Supabase sensor_readings 테이블에 저장합니다."
        )
    )
    parser.add_argument(
        "--port",
        help="시리얼 포트 이름 (예: /dev/cu.usbmodem1101). 생략하면 포트를 선택합니다.",
    )
    args = parser.parse_args()

    try:
        client = create_supabase_client()
        port_name = args.port or choose_port()
        upload_readings(port_name, client)
    except KeyboardInterrupt:
        print("\n업로드를 종료합니다.")
    except (RuntimeError, serial.SerialException, httpx.HTTPError) as error:
        print(f"오류: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
