<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOTOSTAR Technical Support System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <style>
/* 1. THE SETUP */
* {
  box-sizing: border-box;
}

body {
  background-color: #111;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  margin: 0;
  min-height: 100vh;
  padding: 20px 0;
  place-items: center;
}

.slide-container {
  align-items: center;
  background-color: #050505; /* Deep black */
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.1);
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  gap: 50px;
  height: 720px;
  justify-content: center;
  overflow: hidden;
  padding: 60px;
  position: relative;
  width: 1280px;
  color: #fff;
}

/* Background Design */
.slide-container::before {
  background: radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent 50%),
              radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.05), transparent 40%);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}

.slide-container::after {
  background: rgba(245, 158, 11, 0.3);
  bottom: 0;
  content: '';
  height: 4px;
  left: 0;
  position: absolute;
  width: 100%;
}

.slide-container > * {
  position: relative;
  z-index: 1;
}

/* 2. CONSISTENT TYPOGRAPHY */
.slide-container h1,
.slide-container h2,
.slide-container h3,
.slide-container h4 {
  color: #ffffff;
  font-weight: 900;
  margin: 0;
}

.slide-container h1 span,
.slide-container h2 span,
.slide-title span {
  color: #f59e0b; /* Motostar Amber */
}

/* Body Text Font */
.slide-container p,
.slide-container .subtitle,
.slide-container li,
.slide-container .number-label,
.slide-container .chart-summary {
  color: #d1d5db;
  line-height: 1.6;
}

/* Consistent Font Sizes */
.slide-container h1 {
  font-size: 72px;
  letter-spacing: -1px;
  font-style: italic;
  border-bottom: 5px solid #f59e0b;
  padding-bottom: 10px;
  display: inline-block;
}

.slide-container .slide-title {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 40px;
  text-align: left;
  width: 100%;
  border-left: 8px solid #f59e0b;
  padding-left: 20px;
}

.slide-container h3 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #f59e0b;
}

.slide-container p,
.slide-container li,
.slide-container th,
.slide-container td {
  font-size: 20px;
}

.slide-container .subtitle {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 4px;
  margin: 20px auto 0;
  color: #f59e0b;
}

.slide-container .content-area {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  width: 100%;
}

/* 3. LAYOUT DEFINITIONS */
.title-layout {
  text-align: center;
}

.section-title-layout {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.section-title-layout h2 {
  font-size: 64px;
  margin-bottom: 20px;
}

.section-title-layout p {
  font-size: 24px;
  max-width: 800px;
  color: #9ca3af;
}

.section-title-layout hr {
  background-color: #f59e0b;
  border: none;
  height: 6px;
  margin: 30px auto;
  width: 120px;
}

.two-column {
  align-items: flex-start;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  width: 100%;
}

.two-column.tiled {
  align-items: stretch;
}

.two-column.tiled > div {
  background-color: #111;
  border-radius: 16px;
  border: 2px solid #222;
  padding: 40px;
  text-align: left;
}

.two-column ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.two-column li {
  margin-bottom: 20px;
  padding-left: 30px;
  position: relative;
}

.two-column li::before {
  content: '⚡';
  position: absolute;
  left: 0;
  color: #f59e0b;
}

.image-wrapper {
  border-radius: 16px;
  height: 380px;
  max-width: 100%;
  overflow: hidden;
  width: 100%;
  border: 2px solid #333;
}

.image-wrapper img {
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  width: 100%;
}

.two-column .image-wrapper img {
  object-fit: cover;
}

.tiled-content {
  align-items: stretch;
  display: flex;
  gap: 40px;
  justify-content: center;
  width: 100%;
}

.tile {
  align-items: center;
  background-color: #111;
  border-radius: 16px;
  border: 2px solid #222;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  padding: 40px 30px;
  text-align: center;
}

.tile .icon {
  color: #f59e0b;
  font-size: 56px;
  margin-bottom: 25px;
}

.image-tile {
  flex: 1;
  text-align: center;
  background-color: #111;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #222;
}

.image-tile .image-wrapper {
  height: 250px;
  margin-bottom: 20px;
}

.full-bg-image {
  background-position: center;
  background-size: cover;
}

.full-bg-image .content-overlay {
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 50px 80px;
  border-radius: 24px;
  border: 2px solid #f59e0b;
}

/* Quote Layout */
.quote-layout {
  margin: 0 auto;
  text-align: center;
  width: 80%;
  background: #111;
  padding: 60px;
  border-radius: 24px;
  border: 2px dashed #f59e0b;
}

.quote-layout blockquote {
  color: #fff;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0 0 40px 0;
  position: relative;
}

.quote-layout cite {
  color: #f59e0b;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
}

/* Bleed Image Right */
.slide-container.bleed-image-layout {
  align-items: start;
  display: grid;
  gap: 50px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0;
}

.slide-container.bleed-image-layout > .content-container {
  padding: 80px 0 80px 80px;
}

.slide-container.bleed-image-layout > .image-container {
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.slide-container.bleed-image-layout img.bleed-image-side {
  display: block;
  height: 720px;
  object-fit: cover;
  object-position: center;
  width: 100%;
  border-left: 5px solid #f59e0b;
}

/* Warning Box */
.warning-box {
    background-color: #2a0808;
    border: 2px solid #ef4444;
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
}

.warning-box p {
    color: #ff8888;
    margin: 0;
    font-weight: bold;
}

/* Table Style */
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.data-table th, .data-table td {
    border: 1px solid #333;
    padding: 12px 15px;
    text-align: left;
}

.data-table th {
    background-color: #222;
    color: #f59e0b;
    font-weight: bold;
}

.data-table td {
    color: #fff;
}
    </style>
</head>
<body>

<!-- Slide 1: Title_Slide -->
<div class="slide-container" id="slide1">
    <div class="title-layout">
        <h1>MOTOSTAR KOREA</h1>
        <p class="subtitle">스캐너 사용 설명 및 데이터 분석 가이드 (368G 실전)</p>
    </div>
</div>

<!-- Slide 2: 진입 단계 -->
<div class="slide-container" id="slide2">
    <h2 class="slide-title">1. 물리적 스캔 모드 진입 (강제 진입)</h2>
    <div class="content-area">
        <div class="two-column">
            <div>
                <h3>진입 방법</h3>
                <p>좌측 서브 스위치의 <strong>SET + MODE 버튼</strong>을 동시에 길게 누릅니다.</p>
                <div class="warning-box">
                    <p>[★ 핵심 교육]</p>
                    <p>계기판 온도 지침 로고가 깜박이고, 온도 그래프가 사라지면 진입 성공입니다. 이 작업 없이 스캐너만 꽂으면 통신 오류가 발생할 수 있습니다.</p>
                </div>
            </div>
            <div>
                <div class="image-wrapper" style="background-color: #222; display: flex; justify-content: center; align-items: center; border: 2px dashed #555;">
                    <p style="color: #888;">(선생님이 촬영하신 계기판 사진 들어갈 자리)</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Slide 3: 시스템 및 통신 선택 -->
<div class="slide-container" id="slide3">
    <h2 class="slide-title">2. 시스템 및 통신 선택</h2>
    <div class="content-area">
        <div class="two-column tiled">
            <div>
                <h3>시스템 선택</h3>
                <ul>
                    <li><strong>1. ECU (보쉬 선택):</strong> 존테스 고유 프로토콜 및 제조사 전용 심층 진단 모드입니다.</li>
                    <li><strong>2. ABS:</strong> 브레이크 제어 모듈 전용 진단 모드입니다.</li>
                    <li><strong>3. OBDII/EOBD:</strong> 배출가스 검사소용 범용 표준 진단 모드입니다. (심층 데이터 확인 불가)</li>
                </ul>
            </div>
            <div>
                <h3>통신 선택</h3>
                <ul>
                    <li><strong>MSE6.0 CAN:</strong> 125cc 이상 시리즈 스캔 시 반드시 선택해야 하는 고속 통신 모드입니다. (125cc 이하는 8.0 선택)</li>
                </ul>
                <div class="warning-box" style="margin-top: 10px;">
                    <p>'통신 실패'가 뜬다면 십중팔구 K-Line 등 잘못된 방식을 골랐기 때문입니다.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Slide 4: 메인 메뉴 구조 -->
<div class="slide-container" id="slide4">
    <h2 class="slide-title">3. 스캐너 메인 메뉴 구조</h2>
    <div class="content-area">
        <table class="data-table">
            <thead>
                <tr>
                    <th>메뉴명</th>
                    <th>상세 설명</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>ECU version</strong></td>
                    <td>ECU H/W 및 S/W 버전, 차대번호 확인</td>
                </tr>
                <tr>
                    <td><strong>Read Fault Code</strong></td>
                    <td>현재 및 과거(History) 고장코드 확인</td>
                </tr>
                <tr>
                    <td><strong>Clear Fault Code</strong></td>
                    <td>고장코드 소거 (정비 완료 후 실시)</td>
                </tr>
                <tr>
                    <td><strong style="color: #f59e0b;">Data Stream</strong></td>
                    <td><strong style="color: #f59e0b;">(핵심)</strong> 실시간 센서 데이터 및 작동 상태 33개 항목 확인</td>
                </tr>
                <tr>
                    <td><strong>Active Test</strong></td>
                    <td>릴레이, 인젝터 등 강제 구동 테스트 (부품 불량 판별 시 유용)</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Slide 5: 핵심 데이터 - 산소센서 -->
<div class="slide-container bleed-image-layout" id="slide5">
    <div class="content-container">
        <h2 class="slide-title">4. 핵심 데이터: <span>산소센서</span></h2>
        <div class="content-area">
            <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
                <h3>B1S1_O2_Volt (촉매 전)</h3>
                <p>기준값: 0.23 ~ 0.85 V</p>
                <div class="warning-box" style="margin-bottom: 30px;">
                    <p>[★ 핵심 교육] 연료 제어를 위해 0.1V ~ 0.9V 사이를 쉴 새 없이 '파도쳐야' 정상입니다!</p>
                </div>

                <h3>B1S2_O2_Volt (촉매 후)</h3>
                <p>기준값: 0.45 V (고정)</p>
                <div class="warning-box">
                    <p>[★ 핵심 교육] 촉매가 정상 작동하면 이 수치는 파도치지 않고 0.45V 부근에 고정되어야 합니다. 파도치면 촉매 사망!</p>
                </div>
            </div>
        </div>
    </div>
    <div class="image-container" style="background-color: #222; display: flex; justify-content: center; align-items: center; border-left: 5px solid #f59e0b;">
        <p style="color: #888;">(선생님이 촬영하신 스캐너 파형 사진 들어갈 자리)</p>
    </div>
</div>

<!-- Slide 6: 필수 점검 데이터 요약 -->
<div class="slide-container" id="slide6">
    <h2 class="slide-title">5. 기타 필수 점검 데이터 (아이들링 기준)</h2>
    <div class="content-area">
        <table class="data-table">
            <thead>
                <tr>
                    <th>항목명</th>
                    <th>기준값</th>
                    <th>상세 설명</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>MapData</strong> (흡기 매니폴드 절대 압력)</td>
                    <td>35.25 ~ 41.25 kPa</td>
                    <td>엔진의 부하 상태를 파악하는 핵심 센서값입니다.</td>
                </tr>
                <tr>
                    <td><strong>EngineSpeed</strong> (엔진 회전수)</td>
                    <td>1600 ~ 1700 RPM</td>
                    <td>아이들링(공회전) 시 목표 및 실제 엔진 회전수입니다.</td>
                </tr>
                <tr>
                    <td><strong>AdvIgnition</strong> (점화 시기 진각)</td>
                    <td>5.25 ~ 11.25 °(도)</td>
                    <td>피스톤 상사점(TDC) 도달 전 점화 플러그가 터지는 타이밍입니다.</td>
                </tr>
                <tr>
                    <td><strong>shortTermFuelTrimB1-S1</strong> (단기 연료 보정)</td>
                    <td>0.00 ~ 0.78 %</td>
                    <td>B1S1 산소센서 값에 따라 실시간으로 변하는 연료 보정량입니다.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Slide 7: 마무리 -->
<div class="slide-container full-bg-image" id="slide7" style="background-color: #1a1a1a;">
    <div class="content-overlay">
        <h2>MOTOSTAR PREMIUM SERVICE</h2>
        <p style="color:#d1d5db; font-size:22px; max-width:800px;">정확한 데이터 분석이 완벽한 정비의 시작입니다.</p>
    </div>
</div>

</body>
</html>
```