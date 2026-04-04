import React, { useState, useEffect, useRef } from "react";

/**
 * ==========================================
 * 1. CONFIG & DATA (설정 및 데이터)
 * ==========================================
 */
const DEFAULT_CONFIG = {
  ADMIN_PASSCODE: "5282",
  USER_PASSCODE: "1234",
};

const SUPPORTED_MODELS = ["125M", "125D", "125E", "125C", "310M", "350D", "368E", "368G"];

const CATEGORIES = [
  { id: "engine", name: "엔진 (ENGINE)", isReady: true },
  { id: "frame", name: "프레임 (FRAME)", isReady: true },
  { id: "electrical", name: "전장 (ELECTRICAL)", isReady: true }
];

// --- 자료실 데이터 ---
const ELECTRICAL_RESOURCES = [
  { id: "res1", title: "ZONTES 368E 스마트 리시버(PKE) 완벽 해부", type: "VIDEO", fileId: "18e92VGc4-tMHbtyWck2CxQ_onUN1LVmj" },
  { id: "res2", title: "368E 전장 회로도 및 배선 상세", type: "PDF", fileId: "1irtuLNez68hZGYsPv8_3HLAHPeWCwCkh" },
  { id: "res3", title: "스마트키 시스템의 숨겨진 세계", type: "PPTX", fileId: "1XQgsO90TKDgrmvriByQLBXcVwMY58JHt" },
  { id: "res4", title: "존테스 368E: 디지털 악수", type: "VIDEO", fileId: "1A61J-oJ9Mm5k9ut3FUfJVMIugkZry0JM" }
];

const FRAME_RESOURCES = [
  { id: "f_res1", title: "ZT 125/250/350/368E 차대 서비스 매뉴얼", type: "PDF", fileId: "1ufwR_c2YIoj4Th-6wX_GXeFKJ2qdZ11o" },
  { id: "f_res2", title: "오너스 매뉴얼 368T-E", type: "PDF", fileId: "1rFlCz0tBz5j9RWmBzUUYe2bOlXVhdRah" }
];

const ENGINE_RESOURCES = [
  { id: "e_res1", title: "368E 엔진 서비스 매뉴얼", type: "PDF", fileId: "1Yo-MdOcFp9OP28zcaSkn8GoUgoYMezqY" }
];

const FAULT_CODE_RESOURCES = [
  { id: "fc_res1", title: "전 차종 고장코드(DTC) 상세표", type: "PDF", fileId: "1g9j7n5fRvZ-zDpMWggbIdZvZW4sTxDGaqCDE7HXmZtY" }
];

// ⭐ 스캐너 전용 자료실 데이터 (선생님의 앱 내장형 가이드 포함)
const SCANNER_LIBRARY_RESOURCES = [
  { id: "lib_scan1", title: "🚨 스캐너 통신 연결 및 데이터 분석 가이드", type: "APP_GUIDE", action: "scanner_guide_internal" },
  { id: "lib_scan2", title: "진단기 스캔 데이터 분석 방법 (원문 PDF)", type: "PDF", fileId: "1QTzGcYFvrvz1gTqbygD8iqplrksTd909gmtzHfnp4Yk" },
  { id: "lib_scan3", title: "전 차종 고장코드(DTC) 상세표 (PDF)", type: "PDF", fileId: "1g9j7n5fRvZ-zDpMWggbIdZvZW4sTxDGaqCDE7HXmZtY" }
];

// ⭐ 선생님의 CSV 데이터를 바탕으로 재구성한 앱 내장형 스캐너 가이드 데이터
const SCANNER_GUIDE_DATA = {
  tab1: {
    title: "진입 및 통신",
    content: [
      {
        step: "진입 단계",
        title: "물리적 스캔 모드 진입 (강제 진입)",
        value: "SET + MODE 동시 조작",
        desc: "좌측 서브 스위치의 SET + MODE 버튼을 동시에 길게 누릅니다.",
        warning: "[★ 핵심 교육] 계기판 온도 지침 로고가 깜박이고, 온도 그래프가 사라지면 진입 성공! 이 작업 없이 스캐너만 꽂으면 통신 오류가 발생할 수 있습니다."
      },
      {
        step: "시스템 선택",
        title: "ECU (보쉬 선택)",
        value: "제조사 전용 심층 모드",
        desc: "존테스 고유 프로토콜 및 제조사 전용 심층 진단 모드입니다. 현재 데이터 기준으로 '보쉬(Bosch)'를 선택하세요. (OBDII/EOBD 선택 시 배출가스용 기본 데이터만 확인 가능)"
      },
      {
        step: "통신 선택",
        title: "MSE6.0 CAN 통신",
        value: "125cc 이상 시리즈 필수",
        desc: "125cc 이상 시리즈 스캔 시 반드시 선택해야 하는 고속 통신 모드입니다. (125cc 이하는 8.0 선택)",
        warning: "'통신 실패'가 뜬다면 십중팔구 K-Line 등 잘못된 방식을 골랐기 때문입니다."
      }
    ]
  },
  tab2: {
    title: "필수 점검 데이터",
    content: [
      {
        id: "16",
        title: "B1S1_O2_Volt (뱅크1 센서1 산소센서 전압)",
        value: "0.23 ~ 0.85 V",
        desc: "촉매 전(Upstream) 산소센서 전압입니다.",
        warning: "[★ 핵심 교육] 연료 제어를 위해 0.1V ~ 0.9V 사이를 쉴 새 없이 '파도쳐야' 정상입니다!",
        isWave: true
      },
      {
        id: "18",
        title: "B1S2_O2_Volt (뱅크1 센서2 산소센서 전압)",
        value: "0.45 V (고정)",
        desc: "촉매 후(Downstream) 산소센서 전압입니다.",
        warning: "[★ 핵심 교육] 촉매가 정상 작동하면 이 수치는 파도치지 않고 0.45V 부근에 고정되어야 합니다. 파도치면 촉매 사망!"
      },
      {
        id: "08",
        title: "MapData (흡기 매니폴드 절대 압력)",
        value: "35.25 ~ 41.25 kPa",
        desc: "엔진의 부하 상태를 파악하는 핵심 센서값입니다. (아이들링 기준)"
      },
      {
        id: "06",
        title: "EngineSpeed (엔진 회전수)",
        value: "1600 ~ 1700 RPM",
        desc: "아이들링(공회전) 시 목표 및 실제 엔진 회전수입니다."
      },
      {
        id: "09",
        title: "AdvIgnition (점화 시기 진각)",
        value: "5.25 ~ 11.25 °(도)",
        desc: "피스톤 상사점(TDC) 도달 전 점화 플러그가 터지는 타이밍입니다."
      },
      {
        id: "17",
        title: "shortTermFuelTrimB1-S1 (단기 연료 보정)",
        value: "0.00 ~ 0.78 %",
        desc: "B1S1 산소센서 값에 따라 실시간으로 변하는 연료 보정량입니다."
      }
    ]
  },
  tab3: {
    title: "메뉴 및 제어",
    content: [
      {
        title: "메인 메뉴 구조",
        items: [
          "ECU version: ECU 하드웨어/소프트웨어 버전, 차대번호 확인",
          "Read Fault Code: 현재 및 과거(History) 고장코드 확인",
          "Clear Fault Code: 고장코드 소거 (정비 완료 후 실시)",
          "Data Stream: (핵심) 실시간 센서 데이터 및 작동 상태 33개 항목 확인",
          "Active Test: 릴레이, 인젝터 등 강제 구동 테스트 (부품 불량 판별 시 유용)"
        ]
      }
    ]
  }
};

/**
 * [추적 정비 진단 로직 데이터] - 절대 수정 금지 구역
 */
const DIAGNOSTIC_LOGIC = {
  start: {
    question: "진단 방식을 선택하거나 고장 증상을 선택하세요.",
    options: [
      { text: "🚨 고장코드(DTC) 다이렉트 진단", next: "dtc_list" },
      { text: "시동 불량 (전원/스타터 문제)", next: "power_check" },
      { text: "충전 불량 (배터리 방전)", next: "coming_soon" },
      { text: "아이들링 불안정 (시동 꺼짐)", next: "coming_soon" }
    ]
  },
  dtc_list: {
    question: "스캐너에 발생한 고장코드를 선택하세요.",
    options: [
      { text: "P0107 - 흡기 압력(MAP) 센서 전압 낮음", next: "dtc_p0107" },
      { text: "P0108 - 흡기 압력(MAP) 센서 전압 높음", next: "dtc_p0108" },
      { text: "P0122 - 스로틀 위치(TPS) 센서 전압 낮음", next: "dtc_p0122" },
      { text: "P0123 - 스로틀 위치(TPS) 센서 전압 높음", next: "dtc_p0123" },
      { text: "P0112 - 흡기 온도(IAT) 센서 전압 낮음", next: "dtc_p0112" },
      { text: "P0113 - 흡기 온도(IAT) 센서 전압 높음", next: "dtc_p0113" },
      { text: "P0117 - 냉각수 온도(ECT) 센서 전압 낮음", next: "dtc_p0117" },
      { text: "P0118 - 냉각수 온도(ECT) 센서 전압 높음", next: "dtc_p0118" },
      { text: "P0201 - 연료 인젝터 피드백 없음", next: "dtc_p0201" },
      { text: "P0031 - 산소센서 히터 회로 전압 낮음", next: "dtc_p0031" },
      { text: "P0032 - 산소센서 히터 회로 전압 높음", next: "dtc_p0032" },
      { text: "P0131 - 산소센서 신호 전압 낮음", next: "dtc_p0131" },
      { text: "P0132 - 산소센서 신호 전압 높음", next: "dtc_p0132" },
      { text: "P0336 - 크랭크 위치(CKP) 센서 신호 잡음", next: "dtc_p0336" },
      { text: "P0351 - 이그니션 코일 피드백 없음", next: "dtc_p0351" },
      { text: "P0501 - 차속 센서(VSS) 신호 이상", next: "dtc_p0501" },
      { text: "P0562 - 시스템 전압 낮음", next: "dtc_p0562" },
      { text: "P0563 - 시스템 전압 높음", next: "dtc_p0563" }
    ]
  },
  dtc_p0201: {
    question: "코드 P0201 (연료 인젝터 피드백 없음)\n\n[1단계 점검] 인젝터 커넥터를 분리하고 인젝터 양단 저항을 측정하세요. (정상 기준치: 11~14Ω)\n저항값이 정상입니까?",
    options: [
      { text: "예, 정상 범위(11~14Ω) 입니다.", result: "[다음 점검 지시]\n키온(IG ON) 상태에서 인젝터 전원선(빨간선)에 12V가 인가되는지 확인하세요.\n(상세 로직 추가 예정)" },
      { text: "아니오, 저항이 안 나옵니다 (또는 단락).", result: "인젝터 내부 코일 손상이 의심됩니다.\n[조치] 연료 인젝터 어셈블리를 교환하십시오." }
    ]
  },
  dtc_p0107: { question: "[감지조건] MAP 센서 신호 전압이 0.1V 미만입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0108: { question: "[감지조건] MAP 센서 신호 전압이 4.8V 이상입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0122: { question: "[감지조건] TPS 센서 신호 전압이 0.1V 미만입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0123: { question: "[감지조건] TPS 센서 신호 전압이 4.8V 이상입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0112: { question: "[감지조건] IAT 센서 신호 전압이 0.1V 미만입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0113: { question: "[감지조건] IAT 센서 신호 전압이 4.8V 이상입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0117: { question: "[감지조건] ECT 센서 신호 전압이 0.1V 미만입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0118: { question: "[감지조건] ECT 센서 신호 전압이 4.8V 이상입니다.", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0031: { question: "[감지조건] 산소센서 히터 회로 전압 낮음", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0032: { question: "[감지조건] 산소센서 히터 회로 전압 높음", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0131: { question: "[감지조건] 산소센서 신호 전압 낮음", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0132: { question: "[감지조건] 산소센서 신호 전압 높음", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0336: { question: "[감지조건] 크랭크 위치 센서 신호 잡음/불량", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0351: { question: "[감지조건] 이그니션 코일 제어 회로 피드백 없음", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0501: { question: "[감지조건] 차속 센서 신호 이상", options: [{ text: "확인", result: "상세 점검 20고개 로직은 데이터 수집 후 업데이트됩니다." }] },
  dtc_p0562: { question: "[감지조건] 시스템 전압(배터리 전압)이 기준치보다 낮습니다.", options: [{ text: "확인", result: "배터리 충전 상태 및 레귤레이터 충전 전압을 점검하십시오." }] },
  dtc_p0563: { question: "[감지조건] 시스템 전압(배터리 전압)이 기준치보다 높습니다.", options: [{ text: "확인", result: "레귤레이터 과충전 불량 및 접지 라인을 점검하십시오." }] },

  power_check: {
    question: "적색(Wake-up) 버튼을 눌렀을 때 반응이 어떤가요?",
    options: [
      { text: "아무 반응 없음 (완전 먹통)", next: "no_power_at_all" },
      { text: "핸들락은 풀리는데 메터가 안 들어옴", next: "lock_ok_meter_off" },
      { text: "메터까지 다 들어오는데 시동만 안 걸림", next: "meter_ok_no_start" }
    ]
  },
  no_power_at_all: {
    question: "핸들락 잠금/해제음조차 들리지 않나요?",
    options: [
      { text: "예, 아무 소리도 안 납니다.", result: "PKE 기상 신호(Wake-up) 차단 의심.\n[점검] 헤드락 스위치 ➔ PKE 31번(Y/R2) 배선 +12V 유입 확인." },
      { text: "소리는 나는데 메터만 안 켜집니다.", next: "lock_ok_meter_off" }
    ]
  },
  lock_ok_meter_off: {
    question: "핸들락은 정상적으로 해제되었습니까?",
    options: [
      { text: "예, 해제되었습니다.", result: "메인전원(ACC) 출력 불량 의심.\n[점검] PKE 2, 3번 배선 출력 확인 및 세컨 퓨즈박스(B단자) 점검." },
      { text: "아니오, 해제음은 나는데 안 풀립니다.", result: "핸들락 모터 전원 혹은 기계적 고착 의심.\n[점검] PKE 14번(W/Y1) 출력 및 30번(O/B1) 피드백 신호 확인." }
    ]
  },
  meter_ok_no_start: {
    question: "브레이크를 잡았을 때 브레이크 등이 들어오나요?",
    options: [
      { text: "아니오, 브레이크 등이 안 들어옵니다.", result: "시동 허가 조건(브레이크 신호) 미충족.\n[점검] 브레이크 스위치 접점 및 PKE 34번(L/G1) 입력 확인." },
      { text: "예, 브레이크 등은 들어오는데 묵묵부답입니다.", next: "check_ecu_permission" }
    ]
  },
  check_ecu_permission: {
    question: "킬 스위치가 'RUN' 위치에 있고 계기판에 엔진 체크등이 꺼지나요?",
    options: [
      { text: "체크등이 계속 켜져 있거나 통신 에러가 뜹니다.", result: "ECU 전원 혹은 킬 스위치 라인 점검 필요.\n[점검] 우측 킬 스위치 ➔ ECU 31번(B/W) +12V 유입 확인." },
      { text: "정상인데 스타터 릴레이 소리가 안 납니다.", result: "시동 최종 승인 라인 점검.\n[점검] ECU 15번(R/G) 보조 릴레이 제어 신호 및 메인 스타터 릴레이(Y/R) 확인." }
    ]
  },
  coming_soon: {
    question: "죄송합니다.",
    options: [
      { text: "이 로직은 데이터 수집 중입니다. (업데이트 예정)", next: "start" }
    ]
  }
};

const startSequenceData = {
  steps: [
    { id: 1, title: "PKE 웨이크업 (기상)", wiring: "헤드락 스위치 ➔ PKE 31번 (Y/R2)", check: "[입력] +12V 유입 확인", tip: "적색 버튼을 누르면 PKE 시스템이 잠에서 깨어납니다.", images: ["step1.png"] },
    { id: 2, title: "스마트키 호출", wiring: "PKE 22, 23번 ➔ LF 안테나", check: "[출력] 저주파 펄스 방출", tip: "바이크가 리모컨을 찾기 위해 호출 신호를 쏩니다.", images: ["step2.png"] },
    { id: 3, title: "암호 인증", wiring: "리모컨 ➔ PKE 내부 안테나", check: "[수신] 고주파(HF) 암호 수신", tip: "PKE가 리모컨의 암호를 수신하고 인증을 완료합니다.", images: ["step2.png"] },
    { id: 4, title: "핸들락 해제 지시", wiring: "PKE 14번 ➔ 핸들락 모터 (W/Y1)", check: "[출력] +12V 전원 공급", tip: "모터가 돌면서 기계적으로 핸들락을 풉니다.", images: ["step2.png"] },
    { id: 5, title: "핸들락 해제 확인", wiring: "핸들락 내부 스위치 ➔ PKE 30번 (O/B1)", check: "[입력] +12V 피드백 유입", tip: "모터가 다 풀리면 들어오는 가장 중요한 피드백 신호입니다.", images: ["step3.png"] },
    { id: 6, title: "메인전원(ACC) 인가 및 분기", wiring: "PKE 2, 3번 ➔ 세컨 퓨즈박스", check: "[출력] +12V (B단자)", tip: "안전 확인 후 바이크 전체에 ACC 전원이 공급됩니다.", detail: "B단자에서 +12V 분기:\n1. W/B1: Engine flameout switch +전원\n2. U/Y1: ABS ECM, OBD 단자 +전원\n3. P: 패싱, 혼, 윙커, F/R 미등 +전원\n4. B1: 스피드메터, 열선, 도난경보기, USB 등 +전원", images: ["step4.png"] },
    { id: 7, title: "킬 스위치 ON (안전 확보)", wiring: "우측 킬 스위치 ➔ ECU 31번", check: "[입력] B/W 배선 +12V 변환", tip: "ECU가 깨어나고, 주행 중 핸들 잠김 방지 전원이 인가됩니다.", images: ["step5.png"] },
    { id: 8, title: "메인 릴레이 구동", wiring: "ECU 5번 (O/B) ➔ 메인 릴레이", check: "[출력] - 접지 신호 인가", tip: "릴레이 작동 시 W/B 단자에서 +12V 출력. (연료펌프, 인젝터, 캐니스터, 이그니션 코일 등에 전원 인가)", images: ["step6.png", "step7.png"] },
    { id: 9, title: "브레이크 신호 입력", wiring: "브레이크 스위치 ➔ PKE 34번 / ECU 20번 (L/G1)", check: "[입력] - 접지 신호 유입", tip: "좌/우 레버 조작 여부를 감지하며, 시동 필수 조건이 충족됩니다.", images: ["step8.png"] },
    { id: 10, title: "스타트 버튼 조작", wiring: "스타트 스위치 ➔ 메인 스타터 릴레이", check: "[입력] +12V 제어 전원 (Y/R)", tip: "스타트 버튼의 +12V 전기가 릴레이 코일로 직행하여 자력을 생성합니다.", images: ["step9.png"] },
    { id: 11, title: "시동 승인 (보조 릴레이)", wiring: "ECU 15번 ➔ 보조 릴레이", check: "[출력] - 접지 승인 신호 (R/G)", tip: "ECU가 모든 안전 조건을 검토한 후 최종적으로 마이너스(-) 신호를 보조 릴레이로 전달합니다.", images: ["step10.png"] },
    { id: 12, title: "최종 시동 폭발", wiring: "메인 스타터 릴레이 결합 ➔ 스타터 모터", check: "Engine 가동 (회전)", tip: "릴레이가 강하게 붙으며 스타터 모터가 회전하고 엔진 시동이 완료됩니다!", images: [] }
  ]
};

// 통합 검색용 데이터 베이스
const SEARCH_DATABASE = [
  { id: "s1", title: "고장 추적 진단 (AI Logic) 시작", type: "DIAGNOSTIC", action: "diagnostic", tags: ["시동불량", "전원", "먹통", "스타터", "배터리", "시동꺼짐"] },
  { id: "s2", title: "시동 시퀀스 분석 12단계", type: "SEQUENCE", action: "sequence", tags: ["시동", "시퀀스", "PKE", "릴레이", "스마트키", "적색버튼", "12v"] },
  { id: "s3", title: "368E 전체 회로도 (Wiring Diagram)", type: "DIAGRAM", action: "wiring_diagram", tags: ["회로도", "배선도", "배선", "컬러", "색상", "전장"] },
  { id: "s4", title: "스캔 분석 데이터", type: "SCAN", action: "scanner_guide_internal", tags: ["스캔", "진단기", "데이터분석", "산소센서", "map"] },
  { id: "s5", title: "고장코드(DTC) 목록", type: "CODE", action: "fault_code_library", tags: ["고장코드", "dtc", "에러", "경고등", "p0"] },
  { id: "s6", title: "프레임 매뉴얼 (차대, 조립, 토크)", type: "MANUAL", action: "frame_library", tags: ["프레임", "차대", "토크", "조립", "카울", "볼트", "메뉴얼"] },
  { id: "s7", title: "엔진 매뉴얼 (분해, 조립, 토크)", type: "MANUAL", action: "engine_library", tags: ["엔진", "분해", "토크", "조립", "메뉴얼", "타이밍"] },
  { id: "s8", title: "스캐너 통신 연결 및 강제 진입 방법", type: "SCAN", action: "scanner_guide_internal", tags: ["스캐너", "진단기", "연결", "통신", "set", "mode", "진입"] },
  { id: "p0107", title: "P0107 - 흡기 압력(MAP) 전압 낮음", type: "DTC", action: "diagnostic", tags: ["p0107", "map", "흡기", "전압"] },
  { id: "p0122", title: "P0122 - 스로틀 위치(TPS) 전압 낮음", type: "DTC", action: "diagnostic", tags: ["p0122", "tps", "스로틀", "전압"] },
  { id: "p0201", title: "P0201 - 연료 인젝터 피드백 없음", type: "DTC", action: "diagnostic", tags: ["p0201", "인젝터", "연료"] }
];


/**
 * ==========================================
 * 2. GLOBAL STYLES
 * ==========================================
 */
const styles = {
  root: {
    backgroundColor: "#000", height: "100vh", width: "100vw", margin: 0, padding: 0, color: "#fff",
    fontFamily: "'Pretendard', -apple-system, sans-serif", display: "flex", flexDirection: "column",
    position: "fixed", top: 0, left: 0, zIndex: 9999, overflow: "hidden", boxSizing: "border-box"
  },
  fullCenter: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    width: "100%", flex: 1, textAlign: "center", padding: "20px", boxSizing: "border-box",
    paddingBottom: "80px" 
  },
  menuCard: {
    width: "95%", maxWidth: "380px", padding: "24px", borderRadius: "24px", borderWidth: "1.5px", borderStyle: "solid",
    borderColor: "#222", backgroundColor: "#0a0a0a", fontWeight: "900", fontSize: "18px", cursor: "pointer",
    marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)"
  },
  backBtn: {
    color: "#f59e0b", background: "none", border: "none", fontWeight: "900", cursor: "pointer",
    fontSize: "16px", padding: "15px", display: "flex", alignItems: "center", gap: "8px",
    zIndex: 10000, position: "absolute", top: "10px", left: "10px"
  }
};

/**
 * ==========================================
 * 3. COMPONENTS
 * ==========================================
 */

const BottomSearchBar = ({ onSearchResultClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.tags.some(tag => tag.toLowerCase().includes(term))
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 12000,
      display: "flex", flexDirection: "column", alignItems: "center",
      transition: "all 0.3s ease"
    }}>
      {isFocused && searchResults.length > 0 && (
        <div style={{
          width: "95%", maxWidth: "450px", backgroundColor: "#111", borderRadius: "20px 20px 0 0",
          border: "2px solid #333", borderBottom: "none", padding: "10px",
          maxHeight: "300px", overflowY: "auto", boxShadow: "0 -10px 30px rgba(0,0,0,0.8)"
        }}>
          {searchResults.map(result => (
            <div 
              key={result.id}
              onClick={() => {
                setSearchTerm("");
                setIsFocused(false);
                onSearchResultClick(result.action);
              }}
              style={{
                padding: "15px", borderBottom: "1px solid #222", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}
            >
              <div>
                <span style={{ fontSize: "10px", color: "#f59e0b", border: "1px solid #f59e0b", padding: "2px 6px", borderRadius: "4px", marginRight: "8px" }}>{result.type}</span>
                <span style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>{result.title}</span>
              </div>
              <span style={{ color: "#555" }}>➔</span>
            </div>
          ))}
        </div>
      )}
      <div style={{
        width: "100%", backgroundColor: "#0a0a0a", padding: "15px 20px", borderTop: "2px solid #222",
        display: "flex", justifyContent: "center", boxSizing: "border-box"
      }}>
        <div style={{
          width: "100%", maxWidth: "450px", position: "relative", display: "flex", alignItems: "center"
        }}>
          <span style={{ position: "absolute", left: "15px", fontSize: "18px" }}>🔍</span>
          <input 
            type="text" 
            placeholder="증상, 고장코드(P0..), 토크 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} 
            style={{
              width: "100%", padding: "15px 15px 15px 45px", borderRadius: "15px", border: "1.5px solid #333",
              backgroundColor: "#000", color: "#fff", fontSize: "14px", fontWeight: "bold", outline: "none"
            }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: "15px", background: "none", border: "none", color: "#888", fontSize: "16px", cursor: "pointer", padding: "5px" }}>✕</button>
          )}
        </div>
      </div>
    </div>
  );
};

const SplashScreen = ({ setView, isAutoLogReady, lockApp }) => (
  <div style={styles.root} translate="no">
    <div style={styles.fullCenter}>
      <button 
        onClick={() => setView("intro")} 
        style={{
          padding: "22px 50px", fontSize: "20px", fontWeight: "900", color: "#fff", backgroundColor: "transparent",
          borderWidth: "2.5px", borderStyle: "solid", borderColor: "#f59e0b", borderRadius: "100px", cursor: "pointer",
          boxShadow: "0 0 35px rgba(245, 158, 11, 0.4)", textTransform: "uppercase", letterSpacing: "4px", fontStyle: "italic"
        }}
      >
        START SYSTEM
      </button>
      {isAutoLogReady && (
        <button onClick={lockApp} style={{ marginTop: "60px", color: "#444", background: "none", border: "none", borderBottom: "1px solid #222", cursor: "pointer", fontSize: "12px", letterSpacing: "2px" }}>
          RESET SESSION
        </button>
      )}
    </div>
  </div>
);

const IntroScreen = ({ setView }) => {
  const [opacity, setOpacity] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioRef = useRef(null); 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0; 
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    let currentOpacity = 0;
    const fadeIn = setInterval(() => {
      currentOpacity += 0.05;
      setOpacity(currentOpacity);
      if (currentOpacity >= 1) clearInterval(fadeIn);
    }, 40);
    return () => clearInterval(fadeIn);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(Math.max(opacity, 0), 1);
    }
  }, [opacity]);

  useEffect(() => {
    if (isFadingOut) {
      const fadeOut = setInterval(() => {
        setOpacity((prev) => {
          const next = prev - 0.05;
          if (next <= 0) {
            clearInterval(fadeOut);
            return 0;
          }
          return next;
        });
      }, 40);
      return () => clearInterval(fadeOut);
    }
  }, [isFadingOut]);

  useEffect(() => {
    if (isFadingOut && opacity === 0) {
      const savedRole = localStorage.getItem("MSK_AUTH_ROLE");
      setView(savedRole ? "main" : "login"); 
    }
  }, [isFadingOut, opacity, setView]);

  return (
    <div style={styles.root} translate="no">
      <div style={{ ...styles.fullCenter, opacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingLeft: '32px' }}>
          <audio ref={audioRef} src="/Throttle_Pressure.mp3" preload="auto" />
          <div style={{
            width: "600px", height: "600px", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center",
            overflow: "hidden", marginBottom: "-130px", marginTop: "-50px", 
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 230px, rgba(0,0,0,0) 300px)",
            maskImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 230px, rgba(0,0,0,0) 300px)"
          }}>
            <video 
              src="/intro_video.mp4" autoPlay muted playsInline onEnded={() => setIsFadingOut(true)} 
              style={{ width: "650px", height: "auto", filter: "brightness(0.6) contrast(1.8)" }}
              onError={() => setTimeout(() => setIsFadingOut(true), 2000)}
            />
          </div>
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "900", fontStyle: "italic", color: "#FFFFFF", borderBottom: "5px solid #f59e0b", paddingBottom: "10px", margin: "0 auto 15px auto", letterSpacing: "-1px" }}>MOTOSTAR KOREA</h1>
            <p style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "bold", letterSpacing: "8px", margin: 0 }}>PREMIUM SERVICE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ setView, setUserRole, keepLoggedIn, setKeepLoggedIn }) => {
  const [passcode, setPasscode] = useState("");
  const handlePasscode = (num) => {
    if (passcode.length < 4) {
      const newPass = passcode + num;
      setPasscode(newPass);
      if (newPass === DEFAULT_CONFIG.ADMIN_PASSCODE || newPass === DEFAULT_CONFIG.USER_PASSCODE) {
        const role = newPass === DEFAULT_CONFIG.ADMIN_PASSCODE ? "admin" : "user";
        setUserRole(role);
        if (keepLoggedIn) localStorage.setItem("MSK_AUTH_ROLE", role);
        setView("main");
      } else if (newPass.length === 4) {
        setTimeout(() => setPasscode(""), 500);
      }
    }
  };

  return (
    <div style={styles.root} translate="no">
      <button onClick={() => setView("splash")} style={styles.backBtn}>← BACK</button>
      <div style={styles.fullCenter}>
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "38px", fontWeight: "900", fontStyle: "italic", letterSpacing: "3px", color: "#f59e0b" }}>SECURITY LOCK</h2>
          <p style={{ color: "#FFFFFF", fontSize: "11px", fontWeight: "bold", marginTop: "10px", letterSpacing: "4px" }}> AUTHORIZED ONLY </p>
        </div>
        <div style={{ display: "flex", gap: "22px", marginBottom: "45px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: "18px", height: "18px", borderRadius: "50%", borderWidth: "2.5px", borderStyle: "solid", backgroundColor: passcode.length >= i ? "#f59e0b" : "transparent", boxShadow: passcode.length >= i ? "0 0 20px #f59e0b" : "none", borderColor: passcode.length >= i ? "#f59e0b" : "#333", transition: "0.1s" }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginTop: "10px" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "X"].map((btn) => (
            <button key={btn} onClick={() => { if (btn === "C") setPasscode(""); else if (btn === "X") setPasscode(prev => prev.slice(0, -1)); else if (typeof btn === "number") handlePasscode(btn.toString()); }} style={{ width: "80px", height: "80px", borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#333", backgroundColor: "#111", color: "#fff", fontSize: "26px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{btn}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "35px", cursor: "pointer", padding: "12px 25px", backgroundColor: "#111", borderRadius: "50px", border: "1.5px solid #222" }} onClick={() => setKeepLoggedIn(!keepLoggedIn)}>
          <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: "2px solid #f59e0b", backgroundColor: keepLoggedIn ? "#f59e0b" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{keepLoggedIn && <span style={{ color: "#000", fontWeight: "900", fontSize: "14px" }}>✓</span>}</div>
          <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "900" }}>상시 로그인 유지</span>
        </div>
      </div>
    </div>
  );
};

const MainScreen = ({ setView, lockApp }) => (
  <div style={{ ...styles.root, justifyContent: "flex-start", padding: "20px" }} translate="no">
    <header style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", marginTop: "10px" }}>
      <div style={{ textAlign: "left" }}>
        <span style={{ fontWeight: "900", fontSize: "18px", fontStyle: "italic", letterSpacing: "-1px", color: "#fff" }}>MOTOSTAR</span><br/>
        <span style={{ fontSize: "9px", color: "#f59e0b", fontWeight: "bold" }}>TECHNICAL SUPPORT</span>
      </div>
      <button onClick={lockApp} style={{ backgroundColor: "#111", border: "2px solid #ef4444", borderRadius: "12px", padding: "8px 15px", color: "#ef4444", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>LOGOUT 🔓</button>
    </header>
    <div style={styles.fullCenter}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingLeft: '32px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: "160px", marginBottom: "20px" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
        <h1 style={{ fontSize: "32px", fontWeight: "900", fontStyle: "italic", color: "#FFFFFF", borderBottom: "5px solid #f59e0b", paddingBottom: "10px", margin: "0 auto 15px auto", letterSpacing: "-1px", display: 'inline-block', width: 'fit-content' }}>MOTOSTAR KOREA</h1>
        <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "bold", letterSpacing: "8px", marginBottom: "40px" }}>PREMIUM SERVICE</p>
      </div>

      <button onClick={() => setView("models")} style={{ ...styles.menuCard, borderLeft: "12px solid #f59e0b" }}>
        <span style={{color: "#FFF"}}>🛠️ 차종별 정비 지원</span><span style={{ fontSize: "12px", color: "#f59e0b" }}>VIEW</span>
      </button>
      
      {/* ⭐ 메인 화면: 정비 자료실 버튼 완벽 복구 (카테고리 메뉴로 연결됨) */}
      <button onClick={() => setView("library_menu")} style={{ ...styles.menuCard, borderLeft: "12px solid #3b82f6", backgroundColor: "#000810", border: "1.5px solid #001a33" }}>
        <span style={{ color: "#93c5fd" }}>📂 정비 자료실 (Library)</span><span style={{ fontSize: "12px", color: "#3b82f6" }}>OPEN</span>
      </button>
    </div>
    <p style={{ position: "absolute", bottom: "25px", color: "#555", fontSize: "11px", fontStyle: "italic", fontWeight: "900", letterSpacing: "6px", left: "50%", transform: "translateX(-50%)" }}>SINCE 1998</p>
  </div>
);

const DiagnosticScreen = ({ setView, selectedModel }) => {
  const [currentNodeKey, setCurrentNodeKey] = useState("start");
  const [history, setHistory] = useState([]);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const node = DIAGNOSTIC_LOGIC[currentNodeKey];

  const handleOption = (opt) => {
    if (opt.result) {
      setDiagnosticResult(opt.result);
    } else if (opt.next) {
      setHistory([...history, currentNodeKey]);
      setCurrentNodeKey(opt.next);
    }
  };

  const handleBack = () => {
    if (diagnosticResult) {
      setDiagnosticResult(null);
    } else if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeKey(prev);
    } else {
      setView("categories");
    }
  };

  const handleRestart = () => {
    setCurrentNodeKey("start");
    setHistory([]);
    setDiagnosticResult(null);
  };

  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={handleBack} style={styles.backBtn}>← BACK</button>
      <div style={{ ...styles.fullCenter, marginTop: "60px", paddingBottom: "100px", overflowY: "auto", display: "block" }}>
        <h2 style={{ fontSize: "16px", color: "#f59e0b", fontWeight: "900", marginBottom: "5px", letterSpacing: "1px" }}>{selectedModel || '368E'} 진단 모드</h2>
        <h2 style={{ fontSize: "20px", color: "#ef4444", fontWeight: "900", marginBottom: "15px", letterSpacing: "2px" }}>고장 추적 진단</h2>
        
        <div style={{ width: "100%", maxWidth: "450px", margin: "0 auto", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "2px solid #222", padding: "20px", boxSizing: "border-box" }}>
          {!diagnosticResult ? (
            <>
              <p style={{ fontSize: "18px", fontWeight: "900", lineHeight: "1.5", color: "#fff", marginBottom: "30px", whiteSpace: "pre-wrap" }}>
                {node?.question || "데이터를 찾을 수 없습니다."}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "500px", overflowY: "auto", paddingRight: "5px" }}>
                {node?.options?.map((opt, i) => {
                  const isDTCBtn = opt.text.includes("고장코드(DTC)");
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleOption(opt)}
                      style={{ 
                        padding: "16px 20px", borderRadius: "12px", 
                        border: isDTCBtn ? "2px solid #ef4444" : "1px solid #333", 
                        backgroundColor: isDTCBtn ? "#1a0505" : "#111",
                        color: isDTCBtn ? "#ff8888" : "#fff", 
                        fontSize: "15px", fontWeight: "bold", cursor: "pointer", textAlign: "left",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        minHeight: "56px"
                      }}
                    >
                      <span style={{flex: 1, paddingRight: "10px", wordBreak: "keep-all"}}>{opt.text}</span>
                      <span style={{ color: isDTCBtn ? "#ef4444" : "#f59e0b" }}>➔</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ padding: "20px", backgroundColor: "#1a1200", borderRadius: "15px", border: "2px solid #f59e0b", textAlign: "left" }}>
              <p style={{ color: "#f59e0b", fontWeight: "900", fontSize: "14px", marginBottom: "10px" }}>🚨 진단 결과 및 조치</p>
              <p style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {diagnosticResult}
              </p>
              <button onClick={handleRestart} style={{ marginTop: "25px", width: "100%", padding: "15px", borderRadius: "10px", border: "none", backgroundColor: "#f59e0b", color: "#000", fontWeight: "900", cursor: "pointer" }}>
                처음으로 돌아가기
              </button>
            </div>
          )}
        </div>
        
        <p style={{ marginTop: "30px", color: "#444", fontSize: "12px" }}>
          ※ 이 진단 로직은 {selectedModel || '368E'} 시스템을 기반으로 설계되었습니다.
        </p>
      </div>
    </div>
  );
};

const ModelsScreen = ({ setView, setSelectedModel }) => (
  <div style={{...styles.root, justifyContent: "flex-start", padding: "10px"}} translate="no">
    <button onClick={() => setView("main")} style={styles.backBtn}>← BACK</button>
    <div style={{ ...styles.fullCenter, justifyContent: 'flex-start', marginTop: '60px', overflowY: 'auto' }}>
      <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic", color: "#FFFFFF", borderBottom: "3px solid #f59e0b", width: "fit-content", paddingBottom: "15px" }}>MODEL SELECTION</h2>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
        {SUPPORTED_MODELS.map(model => {
          const isAvailable = model === "368E";
          return (
            <button key={model} onClick={() => { if(isAvailable) { setSelectedModel(model); setView("categories"); } }} style={{ ...styles.menuCard, borderLeft: `12px solid ${isAvailable ? "#f59e0b" : "#444"}`, opacity: isAvailable ? 1 : 0.4, cursor: isAvailable ? "pointer" : "default", padding: "18px 30px", marginBottom: '12px' }}>
              <span style={{color: '#FFFFFF'}}>{model}</span><span style={{ fontSize: '11px', color: isAvailable ? '#f59e0b' : '#888', fontWeight: "900" }}>{isAvailable ? "SELECT" : "UPDATING..."}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const CategoriesScreen = ({ setView, selectedModel, setSelectedCategory }) => (
  <div style={{...styles.root, justifyContent: "flex-start", padding: "10px"}} translate="no">
    <button onClick={() => setView("models")} style={styles.backBtn}>← BACK</button>
    <div style={{ ...styles.fullCenter, justifyContent: 'center' }}>
      <h2 style={{ fontSize: "22px", color: "#f59e0b", fontWeight: "900", marginBottom: "10px" }}>{selectedModel}</h2>
      <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic", color: "#FFFFFF" }}>SELECT CATEGORY</h1>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => { 
              if(cat.isReady) { 
                setSelectedCategory(cat.name);
                if (cat.id === "electrical") setView("electrical_menu");
                else if (cat.id === "frame") setView("frame_library"); 
                else if (cat.id === "engine") setView("engine_library");
              } 
            }} 
            style={{ ...styles.menuCard, borderLeft: `12px solid ${cat.isReady ? "#f59e0b" : "#444"}`, opacity: cat.isReady ? 1 : 0.4, cursor: cat.isReady ? "pointer" : "default", padding: "25px 30px" }}
          >
            <span style={{color: '#FFFFFF'}}>{cat.name}</span><span style={{ fontSize: '12px', color: cat.isReady ? '#f59e0b' : '#888', fontWeight: "900" }}>{cat.isReady ? "GO" : "UPDATING..."}</span>
          </button>
        ))}

        <button 
            onClick={() => setView("diagnostic")} 
            style={{ 
                ...styles.menuCard, 
                marginTop: "20px",
                borderLeft: "12px solid #ef4444", 
                backgroundColor: "#1a0505", 
                border: "1.5px solid #331111" 
            }}
        >
            <span style={{color: "#ff8888"}}>⚡ 고장 추적 진단 (AI Logic)</span>
            <span style={{ fontSize: "12px", color: "#ef4444" }}>START</span>
        </button>
      </div>
    </div>
  </div>
);

const EngineLibraryScreen = ({ setView, selectedModel }) => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={() => setView("categories")} style={styles.backBtn}>← BACK</button>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: "18px", color: "#f59e0b", fontWeight: "900", marginBottom: "5px" }}>{selectedModel || '368E'} - 엔진</h2>
        <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "30px", fontStyle: "italic", color: "#FFFFFF" }}>ENGINE MANUAL LIBRARY</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          {ENGINE_RESOURCES.map(res => (
            <div key={res.id} onClick={() => setSelectedFileId(res.fileId)} style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ height: "180px", width: "100%", backgroundColor: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #333" }}>
                <img src={`https://drive.google.com/thumbnail?id=${res.fileId}&sz=w800`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
              </div>
              <div style={{ padding: "20px" }}>
                <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: "900", border: "1.5px solid #ef4444", padding: "3px 8px", borderRadius: "6px", marginBottom: "12px", display: "inline-block" }}>{res.type}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.4" }}>{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedFileId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>MANUAL VIEWER</span>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '8px 20px', borderRadius: '12px' }}>✕ CLOSE</button>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

const FrameLibraryScreen = ({ setView, selectedModel }) => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={() => setView("categories")} style={styles.backBtn}>← BACK</button>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: "18px", color: "#f59e0b", fontWeight: "900", marginBottom: "5px" }}>{selectedModel || '368E'} - 프레임</h2>
        <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "30px", fontStyle: "italic", color: "#FFFFFF" }}>FRAME MANUAL LIBRARY</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          {FRAME_RESOURCES.map(res => (
            <div key={res.id} onClick={() => setSelectedFileId(res.fileId)} style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ height: "180px", width: "100%", backgroundColor: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #333" }}>
                <img src={`https://drive.google.com/thumbnail?id=${res.fileId}&sz=w800`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
              </div>
              <div style={{ padding: "20px" }}>
                <span style={{ fontSize: "10px", color: "#3b82f6", fontWeight: "900", border: "1.5px solid #3b82f6", padding: "3px 8px", borderRadius: "6px", marginBottom: "12px", display: "inline-block" }}>{res.type}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.4" }}>{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedFileId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>MANUAL VIEWER</span>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '8px 20px', borderRadius: '12px' }}>✕ CLOSE</button>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

const ElectricalMenuScreen = ({ setView, selectedModel }) => {
  const subMenus = [
    { id: "smart", name: "스마트 (SMART SYSTEM)", isReady: true },
    { id: "sequence", name: "시동 시퀀스 (START SEQUENCE)", isReady: true },
    { id: "wiring", name: "전체 회로도 (WIRING DIAGRAM)", isReady: true },
    { id: "scan", name: "스캔 분석 및 고장코드", isReady: true },
    { id: "ecu", name: "ECU (CONTROL UNIT)", isReady: false }
  ];
  return (
    <div style={{...styles.root, justifyContent: "flex-start", padding: "10px"}} translate="no">
      <button onClick={() => setView("categories")} style={styles.backBtn}>← BACK</button>
      <div style={{ ...styles.fullCenter, justifyContent: 'center' }}>
        <h2 style={{ fontSize: "20px", color: "#f59e0b", fontWeight: "900", marginBottom: "10px" }}>{selectedModel} - 전장</h2>
        <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic", color: "#FFFFFF" }}>ELECTRICAL MENU</h1>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {subMenus.map(menu => {
            let pointColor = "#f59e0b"; 
            if (menu.id === "sequence") pointColor = "#ef4444"; 
            if (menu.id === "wiring") pointColor = "#10b981"; 
            if (menu.id === "scan") pointColor = "#8b5cf6"; 

            return (
              <button key={menu.id} onClick={() => { 
                if(menu.isReady) { 
                  if(menu.id === "smart") setView("electrical_library"); 
                  else if(menu.id === "sequence") setView("sequence"); 
                  else if(menu.id === "wiring") setView("wiring_diagram"); 
                  else if(menu.id === "scan") setView("scan_menu"); 
                } 
              }} style={{ ...styles.menuCard, borderLeft: `12px solid ${menu.isReady ? pointColor : "#444"}`, opacity: menu.isReady ? 1 : 0.4, cursor: menu.isReady ? "pointer" : "default", padding: "22px 30px" }}>
                <span style={{color: '#FFFFFF'}}>{menu.name}</span><span style={{ fontSize: '11px', color: menu.isReady ? pointColor : "#888", fontWeight: "900" }}>{menu.isReady ? "GO" : "UPDATING"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScanMenuScreen = ({ setView, selectedModel }) => {
  return (
    <div style={{...styles.root, justifyContent: "flex-start", padding: "10px"}} translate="no">
      <button onClick={() => setView("electrical_menu")} style={styles.backBtn}>← BACK</button>
      <div style={{ ...styles.fullCenter, justifyContent: 'center' }}>
        <h2 style={{ fontSize: "20px", color: "#f59e0b", fontWeight: "900", marginBottom: "10px" }}>{selectedModel} - 전장</h2>
        <h1 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic", color: "#FFFFFF" }}>SCAN & FAULT CODE</h1>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={() => setView("scanner_guide_internal")} 
            style={{ ...styles.menuCard, borderLeft: `12px solid #8b5cf6`, padding: "25px 30px" }}
          >
            <span style={{color: '#FFFFFF'}}>스캔 분석 (SCAN ANALYSIS)</span>
            <span style={{ fontSize: '12px', color: "#8b5cf6", fontWeight: "900" }}>GO</span>
          </button>

          <button 
            onClick={() => setView("fault_code_library")} 
            style={{ ...styles.menuCard, borderLeft: `12px solid #ec4899`, padding: "25px 30px" }}
          >
            <span style={{color: '#FFFFFF'}}>고장코드 (FAULT CODES)</span>
            <span style={{ fontSize: '12px', color: "#ec4899", fontWeight: "900" }}>GO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FaultCodeLibraryScreen = ({ setView, selectedModel }) => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={() => setView("scan_menu")} style={styles.backBtn}>← BACK</button>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: "18px", color: "#f59e0b", fontWeight: "900", marginBottom: "5px" }}>{selectedModel || '368E'} - 고장코드</h2>
        <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "30px", fontStyle: "italic", color: "#FFFFFF" }}>FAULT CODE DATA</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          {FAULT_CODE_RESOURCES.map(res => (
            <div key={res.id} onClick={() => setSelectedFileId(res.fileId)} style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ height: "180px", width: "100%", backgroundColor: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #333" }}>
                <img src={`https://drive.google.com/thumbnail?id=${res.fileId}&sz=w800`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
              </div>
              <div style={{ padding: "20px" }}>
                <span style={{ fontSize: "10px", color: "#ec4899", fontWeight: "900", border: "1.5px solid #ec4899", padding: "3px 8px", borderRadius: "6px", marginBottom: "12px", display: "inline-block" }}>{res.type}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.4" }}>{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedFileId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>CODE VIEWER</span>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '8px 20px', borderRadius: '12px' }}>✕ CLOSE</button>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

const WiringDiagramScreen = ({ setView, selectedModel }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const zoomIn = () => setScale(prev => Math.min(prev * 1.3, 10)); 
  const zoomOut = () => setScale(prev => Math.max(prev / 1.3, 0.5)); 
  const resetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); };
  const handleWheel = (e) => { e.deltaY < 0 ? zoomIn() : zoomOut(); };
  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
  const handleMouseMove = (e) => { if (!isDragging) return; setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => { if (e.touches.length === 1) { setIsDragging(true); setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }); } };
  const handleTouchMove = (e) => { if (!isDragging || e.touches.length !== 1) return; setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y }); };
  const controlBtnStyle = { padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #10b981", backgroundColor: "#111", color: "#10b981", fontWeight: "900", fontSize: "14px", cursor: "pointer" };
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px", display: "flex", flexDirection: "column" }} translate="no">
      <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', marginTop: "10px", marginBottom: "15px" }}>
        <button onClick={() => setView("electrical_menu")} style={{ ...styles.backBtn, position: 'static' }}>← BACK</button>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "900" }}>{selectedModel} OFFICIAL DATA</span><br/>
          <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff", fontStyle: "italic" }}>전체 회로도 (Wiring Diagram)</span>
        </div>
      </header>
      <div style={{ display: "flex", gap: "12px", marginBottom: "15px", justifyContent: "center", zIndex: 10 }}>
        <button onClick={zoomOut} style={controlBtnStyle}>- 축소</button>
        <button onClick={resetZoom} style={{...controlBtnStyle, color: "#fff", borderColor: "#555"}}>↺ 원본</button>
        <button onClick={zoomIn} style={controlBtnStyle}>+ 확대</button>
      </div>
      <div style={{ width: '100%', flex: 1, backgroundColor: '#050505', borderRadius: '20px', overflow: 'hidden', border: "2px solid #222", position: "relative", cursor: isDragging ? "grabbing" : "grab", touchAction: "none", marginBottom: "60px" }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: "center", transition: isDragging ? "none" : "transform 0.15s ease-out" }}>
          <img src="/368E 회로도.jpeg" alt="Full Wiring Diagram" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none" }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      </div>
    </div>
  );
};

const ElectricalLibraryScreen = ({ setView, selectedModel }) => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={() => setView("electrical_menu")} style={styles.backBtn}>← BACK</button>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: "18px", color: "#f59e0b", fontWeight: "900", marginBottom: "5px" }}>{selectedModel}</h2>
        <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "30px", fontStyle: "italic", color: "#FFFFFF" }}>SMART SYSTEM LIBRARY</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          {ELECTRICAL_RESOURCES.map(res => (
            <div key={res.id} onClick={() => setSelectedFileId(res.fileId)} style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left" }}>
              <div style={{ height: "200px", width: "100%", backgroundColor: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={`https://drive.google.com/thumbnail?id=${res.fileId}&sz=w800`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
              </div>
              <div style={{ padding: "20px" }}>
                <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: "900", border: "1.5px solid #f59e0b", padding: "3px 8px", borderRadius: "6px", marginBottom: "12px", display: "inline-block" }}>{res.type}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.4" }}>{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedFileId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '12px 25px', borderRadius: '12px' }}>✕ CLOSE</button>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

const SequenceScreen = ({ setView, selectedModel }) => {
  const [activeStep, useState] = React.useState(1);
  const current = startSequenceData.steps[activeStep - 1];
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px", display: "flex", flexDirection: "column" }} translate="no">
      <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', marginTop: "10px", marginBottom: "15px" }}>
        <button onClick={() => setView("electrical_menu")} style={{ ...styles.backBtn, position: 'static' }}>← BACK</button>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "900" }}>{selectedModel} DIAGNOSTIC LOGIC</span><br/>
          <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff", fontStyle: "italic" }}>시동 시퀀스 분석</span>
        </div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", width: "100%", marginBottom: "15px" }}>
        {startSequenceData.steps.map(s => (
          <button key={s.id} onClick={() => useState(s.id)} style={{ padding: "10px 0", borderRadius: "8px", border: "1px solid #333", backgroundColor: activeStep === s.id ? "#f59e0b" : "#111", color: activeStep === s.id ? "#000" : "#fff", fontWeight: "900", fontSize: "13px" }}>{s.id}</button>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "15px", overflowY: "auto", paddingBottom: "20px" }}>
        <div style={{ flex: "1 1 500px", minHeight: "350px", backgroundColor: "#0a0a0a", borderRadius: "20px", border: "2px solid #222", display: "flex", flexDirection: "column", padding: "10px", gap: "15px" }}>
          {current?.images?.length > 0 ? current.images.map((imgName, idx) => (<img key={idx} src={`/${imgName}`} alt="" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />)) : <div style={{ textAlign: "center", color: "#555" }}><p style={{ fontSize: "40px" }}>🏍️</p><p>회로도 없음</p></div>}
        </div>
        <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ backgroundColor: "#111", padding: "20px", borderRadius: "15px", borderLeft: "8px solid #f59e0b" }}>
            <span style={{ color: "#f59e0b", fontWeight: "900" }}>STEP {activeStep}</span>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#fff" }}>{current.title}</h2>
          </div>
          <div style={{ backgroundColor: "#0a0a0a", border: "1.5px solid #222", padding: "18px", borderRadius: "15px" }}>
            <p style={{ color: "#888", fontSize: "11px", fontWeight: "900" }}>📍 Diagnostic Point</p>
            <p style={{ fontSize: "16px", fontWeight: "900", color: "#fff" }}>{current.wiring}</p>
          </div>
          <div style={{ backgroundColor: "#1a1200", border: "2px solid #f59e0b", padding: "20px", borderRadius: "15px" }}>
            <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "900" }}>⚡ Standard Value</p>
            <p style={{ fontSize: "22px", fontWeight: "900", fontStyle: "italic", color: "#fbbf24" }}>{current.check}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ⭐ 자료실 카테고리 메뉴 화면
const LibraryMenuScreen = ({ setView }) => (
  <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
    <button onClick={() => setView("main")} style={styles.backBtn}>← BACK</button>
    <div style={{ ...styles.fullCenter, justifyContent: 'flex-start', marginTop: '60px', overflowY: 'auto' }}>
      <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic", color: "#FFFFFF", borderBottom: "3px solid #3b82f6", width: "fit-content", paddingBottom: "15px" }}>RESOURCE LIBRARY</h2>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
        
        <button onClick={() => setView("scanner_library")} style={{ ...styles.menuCard, borderLeft: "12px solid #8b5cf6" }}>
          <span style={{color: '#FFFFFF'}}>💻 스캐너 및 고장코드</span><span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: "900" }}>OPEN</span>
        </button>

        <button onClick={() => {}} style={{ ...styles.menuCard, borderLeft: "12px solid #444", opacity: 0.4, cursor: "default" }}>
          <span style={{color: '#FFFFFF'}}>📖 차종별 정비 매뉴얼</span><span style={{ fontSize: '11px', color: '#888', fontWeight: "900" }}>UPDATING...</span>
        </button>

        <button onClick={() => {}} style={{ ...styles.menuCard, borderLeft: "12px solid #444", opacity: 0.4, cursor: "default" }}>
          <span style={{color: '#FFFFFF'}}>⚡ 전체 전장 회로도</span><span style={{ fontSize: '11px', color: '#888', fontWeight: "900" }}>UPDATING...</span>
        </button>
      </div>
    </div>
  </div>
);

// ⭐ 스캐너 전용 자료실 화면
const ScannerLibraryScreen = ({ setView }) => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <button onClick={() => setView("library_menu")} style={styles.backBtn}>← BACK</button>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: "18px", color: "#8b5cf6", fontWeight: "900", marginBottom: "5px" }}>정비 자료실</h2>
        <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "30px", fontStyle: "italic", color: "#FFFFFF" }}>SCANNER & DTC</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", alignItems: "center" }}>
          {SCANNER_LIBRARY_RESOURCES.map(res => (
            <div 
              key={res.id} 
              onClick={() => {
                if(res.action) setView(res.action);
                else setSelectedFileId(res.fileId);
              }} 
              style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            >
              <div style={{ height: "180px", width: "100%", backgroundColor: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #333", position: "relative" }}>
                {res.type === "APP_GUIDE" ? (
                  <div style={{ color: "#8b5cf6", fontSize: "60px" }}>📱</div>
                ) : (
                  <img src={`https://drive.google.com/thumbnail?id=${res.fileId}&sz=w800`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "/모터스타 이미지.png"; }} />
                )}
              </div>
              <div style={{ padding: "20px" }}>
                <span style={{ fontSize: "10px", color: "#8b5cf6", fontWeight: "900", border: "1.5px solid #8b5cf6", padding: "3px 8px", borderRadius: "6px", marginBottom: "12px", display: "inline-block" }}>{res.type}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.4" }}>{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedFileId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>DOCUMENT VIEWER</span>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '8px 20px', borderRadius: '12px' }}>✕ CLOSE</button>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

// ⭐ 앱 내장형 스캐너 가이드 화면
const ScannerGuideInternalScreen = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
      <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', marginTop: "10px", marginBottom: "5px" }}>
        <button onClick={() => setView("scanner_library")} style={{ ...styles.backBtn, position: 'static' }}>← BACK</button>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: "900" }}>SMART GUIDE</span><br/>
          <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff", fontStyle: "italic" }}>스캐너 통신 및 데이터 분석</span>
        </div>
      </header>

      {/* 탭 버튼 */}
      <div style={{ display: "flex", gap: "8px", width: "100%", marginBottom: "15px", padding: "0 10px" }}>
        {Object.entries(SCANNER_GUIDE_DATA).map(([key, data]) => (
          <button 
            key={key} 
            onClick={() => setActiveTab(key)} 
            style={{ 
              flex: 1, padding: "12px 0", borderRadius: "10px", border: "1px solid #333", 
              backgroundColor: activeTab === key ? "#8b5cf6" : "#111", 
              color: activeTab === key ? "#000" : "#fff", 
              fontWeight: "900", fontSize: "12px", transition: "all 0.2s"
            }}
          >
            {data.title}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 40px 10px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {SCANNER_GUIDE_DATA[activeTab].content.map((item, idx) => (
          <div key={idx} style={{ backgroundColor: "#0a0a0a", border: "1.5px solid #222", borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}>
            
            {/* 좌측 컬러 바 */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", backgroundColor: activeTab === "tab2" ? "#ef4444" : "#8b5cf6" }} />
            
            {item.step && <span style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: "900", marginBottom: "5px", display: "block" }}>{item.step}</span>}
            {item.id && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "900", marginBottom: "5px", display: "inline-block", border: "1px solid #ef4444", padding: "2px 6px", borderRadius: "4px", marginRight: "8px" }}>ID: {item.id}</span>}
            
            <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#fff", marginBottom: "10px", lineHeight: "1.3", display: "flex", alignItems: "center" }}>
              {item.title}
              {item.isWave && <span style={{ fontSize: "14px", marginLeft: "10px", animation: "wave 1s infinite alternate" }}>〰️</span>}
            </h3>
            
            {item.value && (
              <div style={{ backgroundColor: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #333" }}>
                <span style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>기준값 / 조작법</span>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#f59e0b" }}>{item.value}</span>
              </div>
            )}
            
            {item.desc && <p style={{ fontSize: "14px", color: "#ccc", lineHeight: "1.6", marginBottom: item.warning ? "15px" : "0" }}>{item.desc}</p>}
            
            {item.warning && (
              <div style={{ backgroundColor: "#2a0808", border: "1px solid #ef4444", padding: "12px", borderRadius: "8px" }}>
                <p style={{ fontSize: "13px", color: "#ff8888", fontWeight: "bold", lineHeight: "1.5", margin: 0 }}>{item.warning}</p>
              </div>
            )}

            {item.items && (
              <ul style={{ paddingLeft: "20px", margin: 0, color: "#ccc", fontSize: "14px", lineHeight: "1.8" }}>
                {item.items.map((li, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes wave {
            0% { transform: translateY(0px); color: #f59e0b; }
            100% { transform: translateY(-3px); color: #ef4444; }
          }
        `}
      </style>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("splash");
  const [selectedModel, setSelectedModel] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [userRole, setUserRole] = useState(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true); 
  const [isAutoLogReady, setIsAutoLogReady] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedRole = localStorage.getItem("MSK_AUTH_ROLE");
    if (savedRole) { setUserRole(savedRole); setIsAutoLogReady(true); }
  }, []);

  const lockApp = () => {
    localStorage.removeItem("MSK_AUTH_ROLE");
    setUserRole(null); setIsAutoLogReady(false); setView("splash");
  };

  const handleSearchResultClick = (action) => {
    setView(action);
  };

  const renderView = () => {
    switch (view) {
      case "splash": return <SplashScreen setView={setView} isAutoLogReady={isAutoLogReady} lockApp={lockApp} />;
      case "intro": return <IntroScreen setView={setView} />;
      case "login": return <LoginScreen setView={setView} setUserRole={setUserRole} keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} />;
      case "main": return <MainScreen setView={setView} lockApp={lockApp} />;
      case "diagnostic": return <DiagnosticScreen setView={setView} selectedModel={selectedModel} />;
      case "models": return <ModelsScreen setView={setView} setSelectedModel={setSelectedModel} />;
      case "categories": return <CategoriesScreen setView={setView} selectedModel={selectedModel} setSelectedCategory={setSelectedCategory} />;
      case "electrical_menu": return <ElectricalMenuScreen setView={setView} selectedModel={selectedModel} />;
      case "electrical_library": return <ElectricalLibraryScreen setView={setView} selectedModel={selectedModel} />;
      case "frame_library": return <FrameLibraryScreen setView={setView} selectedModel={selectedModel} />;
      case "engine_library": return <EngineLibraryScreen setView={setView} selectedModel={selectedModel} />; 
      case "scan_menu": return <ScanMenuScreen setView={setView} selectedModel={selectedModel} />;
      case "fault_code_library": return <FaultCodeLibraryScreen setView={setView} selectedModel={selectedModel} />;
      case "wiring_diagram": return <WiringDiagramScreen setView={setView} selectedModel={selectedModel} />;
      case "sequence": return <SequenceScreen setView={setView} selectedModel={selectedModel} />;
      case "library_menu": return <LibraryMenuScreen setView={setView} />;
      case "scanner_library": return <ScannerLibraryScreen setView={setView} />;
      case "scanner_guide_internal": return <ScannerGuideInternalScreen setView={setView} />;
      default: return <div style={styles.root}>Initializing System...</div>;
    }
  };

  return (
    <>
      {renderView()}
      {view !== "splash" && view !== "intro" && view !== "login" && (
        <BottomSearchBar onSearchResultClick={handleSearchResultClick} />
      )}
    </>
  );
}