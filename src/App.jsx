import React, { useState, useEffect, useRef } from "react";

/**
 * ==========================================
 * 1. CONFIG & DATA (정적 데이터 구역)
 * ==========================================
 */
const DEFAULT_CONFIG = {
  ADMIN_PASSCODE: "5282",
  USER_PASSCODE: "1234",
  FOLDER_ID: "1nU2dtw62y7rruBVolcEj9tIscmDrB6-H",
};

const SUPPORTED_MODELS = ["125M", "125D", "125E", "125C", "310M", "350D", "368E", "368G"];

const CATEGORIES = [
  { id: "engine", name: "엔진 (ENGINE)", isReady: false },
  { id: "frame", name: "프레임 (FRAME)", isReady: false },
  { id: "electrical", name: "전장 (ELECTRICAL)", isReady: true }
];

const ELECTRICAL_RESOURCES = [
  { id: "res1", title: "ZONTES 368E 스마트 리시버(PKE) 완벽 해부", type: "VIDEO", fileId: "18e92VGc4-tMHbtyWck2CxQ_onUN1LVmj" },
  { id: "res2", title: "368E 전장 회로도 및 배선 상세", type: "PDF", fileId: "1irtuLNez68hZGYsPv8_3HLAHPeWCwCkh" },
  { id: "res3", title: "스마트키 시스템의 숨겨진 세계", type: "PPTX", fileId: "1XQgsO90TKDgrmvriByQLBXcVwMY58JHt" },
  { id: "res4", title: "존테스 368E: 디지털 악수", type: "VIDEO", fileId: "1A61J-oJ9Mm5k9ut3FUfJVMIugkZry0JM" }
];

// docx 문서 내용 및 커스텀 이미지 맵핑 완벽 반영
const startSequenceData = {
  steps: [
    { 
      id: 1, 
      title: "PKE 웨이크업 (기상)", 
      wiring: "헤드락 스위치 ➔ PKE 31번 (Y/R2)", 
      check: "[입력] +12V 유입 확인", 
      tip: "적색 버튼을 누르면 PKE 시스템이 잠에서 깨어납니다.",
      images: ["step1.png"]
    },
    { 
      id: 2, 
      title: "스마트키 호출", 
      wiring: "PKE 22, 23번 ➔ LF 안테나", 
      check: "[출력] 저주파 펄스 방출", 
      tip: "바이크가 리모컨을 찾기 위해 호출 신호를 쏩니다.",
      images: ["step2.png"]
    },
    { 
      id: 3, 
      title: "암호 인증", 
      wiring: "리모컨 ➔ PKE 내부 안테나", 
      check: "[수신] 고주파(HF) 암호 수신", 
      tip: "PKE가 리모컨의 암호를 수신하고 인증을 완료합니다.",
      images: ["step2.png"]
    },
    { 
      id: 4, 
      title: "핸들락 해제 지시", 
      wiring: "PKE 14번 ➔ 핸들락 모터 (W/Y1)", 
      check: "[출력] +12V 전원 공급", 
      tip: "모터가 돌면서 기계적으로 핸들락을 풉니다.",
      images: ["step2.png"]
    },
    { 
      id: 5, 
      title: "핸들락 해제 확인", 
      wiring: "핸들락 내부 스위치 ➔ PKE 30번 (O/B1)", 
      check: "[입력] +12V 피드백 유입", 
      tip: "모터가 다 풀리면 들어오는 가장 중요한 피드백 신호입니다.",
      images: ["step3.png"] 
    },
    { 
      id: 6, 
      title: "메인전원(ACC) 인가 및 분기", 
      wiring: "PKE 2, 3번 ➔ 세컨 퓨즈박스", 
      check: "[출력] +12V (B단자)", 
      tip: "안전 확인 후 바이크 전체에 ACC 전원이 공급됩니다.",
      detail: "B단자에서 +12V 분기:\n1. W/B1: Engine flameout switch +전원\n2. U/Y1: ABS ECM, OBD 단자 +전원\n3. P: 패싱, 혼, 윙커, F/R 미등 +전원\n4. B1: 스피드메터, 열선, 도난경보기, USB 등 +전원",
      images: ["step4.png"]
    },
    { 
      id: 7, 
      title: "킬 스위치 ON (안전 확보)", 
      wiring: "우측 킬 스위치 ➔ ECU 31번", 
      check: "[입력] B/W 배선 +12V 변환", 
      tip: "ECU가 깨어나고, 주행 중 핸들 잠김 방지 전원이 인가됩니다.",
      images: ["step5.png"]
    },
    { 
      id: 8, 
      title: "메인 릴레이 구동", 
      wiring: "ECU 5번 (O/B) ➔ 메인 릴레이", 
      check: "[출력] - 접지 신호 인가", 
      tip: "릴레이 작동 시 W/B 단자에서 +12V 출력. (연료펌프, 인젝터, 캐니스터, 이그니션 코일 등에 전원 인가)",
      images: ["step6.png", "step7.png"] // 다중 이미지 지원
    },
    { 
      id: 9, 
      title: "브레이크 신호 입력", 
      wiring: "브레이크 스위치 ➔ PKE 34번 / ECU 20번 (L/G1)", 
      check: "[입력] - 접지 신호 유입", 
      tip: "좌/우 레버 조작 여부를 감지하며, 시동 필수 조건이 충족됩니다.",
      images: ["step8.png"]
    },
    { 
      id: 10, 
      title: "스타트 버튼 조작", 
      wiring: "스타트 스위치 ➔ 메인 스타터 릴레이", 
      check: "[입력] +12V 제어 전원 (Y/R)", 
      tip: "스타트 버튼의 +12V 전기가 릴레이 코일로 직행하여 자력을 생성합니다.",
      images: ["step9.png"]
    },
    { 
      id: 11, 
      title: "시동 승인 (보조 릴레이)", 
      wiring: "ECU 15번 ➔ 보조 릴레이", 
      check: "[출력] - 접지 승인 신호 (R/G)", 
      tip: "ECU가 모든 안전 조건을 검토한 후 최종적으로 마이너스(-) 신호를 보조 릴레이로 전달합니다.",
      images: ["step10.png"]
    },
    { 
      id: 12, 
      title: "최종 시동 폭발", 
      wiring: "메인 스타터 릴레이 결합 ➔ 스타터 모터", 
      check: "Engine 가동 (회전)", 
      tip: "릴레이가 강하게 붙으며 스타터 모터가 회전하고 엔진 시동이 완료됩니다!",
      images: [] // 이미지가 없는 단계
    }
  ]
};

/**
 * ==========================================
 * 2. GLOBAL STYLES (공통 스타일 구역)
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
    width: "100%", flex: 1, textAlign: "center", padding: "20px", boxSizing: "border-box"
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
 * 3. SUB COMPONENTS (화면별 분할 컴포넌트)
 * ==========================================
 */

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

  // 에러 원인 해결: setView 등 사이드 이펙트와 상태 업데이트(setState)를 완벽히 분리
  useEffect(() => {
    if (isFadingOut) {
      const fadeOut = setInterval(() => {
        setOpacity((prev) => {
          const next = prev - 0.05;
          if (next <= 0) {
            clearInterval(fadeOut);
            return 0; // 순수하게 상태만 업데이트
          }
          return next;
        });
      }, 40);
      return () => clearInterval(fadeOut);
    }
  }, [isFadingOut]);

  // 투명도가 0에 도달했을 때 비로소 화면을 전환하도록 독립적인 useEffect 사용
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
          
          {/* 사운드 트랙 재생 태그 (UI에는 숨김 처리) */}
          <audio ref={audioRef} src="/Throttle_Pressure.mp3" preload="auto" />

          {/* 비디오 뷰어 컨테이너 (위/아래 잘림 완벽 차단 - 거대 픽셀 사이즈 적용) */}
          <div style={{
            width: "600px", 
            height: "600px", // 빛 팽창을 완벽히 수용하기 위해 높이를 무지막지하게 키움
            flexShrink: 0, // 화면이 작아도 컨테이너가 쪼그라들지 않도록 고정
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden", 
            marginBottom: "-130px", // 컨테이너 하단의 거대한 투명 영역 위로 텍스트를 바짝 당김
            marginTop: "-50px", 
            // 퍼센트(%)가 아닌 픽셀(px) 단위로 솔리드 영역을 거대하게 고정. 
            // 반지름 230px(지름 460px)까지는 빛을 100% 선명하게 보호함.
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 230px, rgba(0,0,0,0) 300px)",
            maskImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 230px, rgba(0,0,0,0) 300px)"
          }}>
            <video 
              src="/intro_video.mp4" 
              autoPlay 
              muted 
              playsInline 
              onEnded={() => setIsFadingOut(true)} 
              style={{ 
                width: "650px", // 영상 넓이를 틀보다 넓게 해 워터마크를 완벽히 화면 밖으로 추방
                height: "auto",
                transform: "translateY(0)", 
                filter: "brightness(0.6) contrast(1.8)" // 카본 배경을 칠흑 같은 블랙으로 융화시킴
              }}
              onError={() => {
                setTimeout(() => setIsFadingOut(true), 2000);
              }}
            />
          </div>

          {/* 텍스트 영역 (비디오 컨테이너의 투명한 하단부 위로 확실하게 덮어지도록 z-index 부여) */}
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
      <button onClick={() => setView("cloudView")} style={{ ...styles.menuCard, borderLeft: "12px solid #3b82f6", backgroundColor: "#000810", border: "1.5px solid #001a33" }}>
        <span style={{ color: "#93c5fd" }}>📂 정비 자료실 (Cloud)</span><span style={{ fontSize: "12px", color: "#3b82f6" }}>OPEN</span>
      </button>
    </div>
    <p style={{ position: "absolute", bottom: "25px", color: "#555", fontSize: "11px", fontStyle: "italic", fontWeight: "900", letterSpacing: "6px", left: "50%", transform: "translateX(-50%)" }}>SINCE 1998</p>
  </div>
);

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
      <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "50px", fontStyle: "italic", color: "#FFFFFF" }}>SELECT CATEGORY</h1>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => { if(cat.isReady) { setSelectedCategory(cat.name); setView("electrical_menu"); } }} style={{ ...styles.menuCard, borderLeft: `12px solid ${cat.isReady ? "#f59e0b" : "#444"}`, opacity: cat.isReady ? 1 : 0.4, cursor: cat.isReady ? "pointer" : "default", padding: "25px 30px" }}>
            <span style={{color: '#FFFFFF'}}>{cat.name}</span><span style={{ fontSize: '12px', color: cat.isReady ? '#f59e0b' : '#888', fontWeight: "900" }}>{cat.isReady ? "GO" : "UPDATING..."}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const ElectricalMenuScreen = ({ setView, selectedModel }) => {
  const subMenus = [
    { id: "smart", name: "스마트 (SMART SYSTEM)", isReady: true },
    { id: "sequence", name: "시동 시퀀스 (START SEQUENCE)", isReady: true },
    { id: "wiring", name: "전체 회로도 (WIRING DIAGRAM)", isReady: true },
    { id: "scan", name: "스캔 분석 (SCAN ANALYSIS)", isReady: false },
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

            return (
              <button 
                key={menu.id} 
                onClick={() => { 
                  if(menu.isReady) { 
                    if(menu.id === "smart") setView("electrical_library"); 
                    else if(menu.id === "sequence") setView("sequence"); 
                    else if(menu.id === "wiring") setView("wiring_diagram"); 
                  } 
                }} 
                style={{ 
                  ...styles.menuCard, 
                  borderLeft: `12px solid ${menu.isReady ? pointColor : "#444"}`, 
                  opacity: menu.isReady ? 1 : 0.4, 
                  cursor: menu.isReady ? "pointer" : "default", 
                  padding: "22px 30px" 
                }}
              >
                <span style={{color: '#FFFFFF'}}>{menu.name}</span>
                <span style={{ fontSize: '11px', color: menu.isReady ? pointColor : "#888", fontWeight: "900" }}>
                  {menu.isReady ? "GO" : "UPDATING"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
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

  const handleWheel = (e) => {
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) { 
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };
  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const controlBtnStyle = {
    padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #10b981", 
    backgroundColor: "#111", color: "#10b981", fontWeight: "900", fontSize: "14px", cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
  };

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

      <div 
        style={{ 
          width: '100%', flex: 1, backgroundColor: '#050505', borderRadius: '20px', 
          overflow: 'hidden', border: "2px solid #222", position: "relative",
          cursor: isDragging ? "grabbing" : "grab", touchAction: "none" 
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div style={{
          width: "100%", height: "100%", 
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, 
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.15s ease-out" 
        }}>
          <img 
            src="/368E 회로도.jpeg" 
            alt="Full Wiring Diagram" 
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none" }} 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              if (!e.target.nextSibling) {
                const fallback = document.createElement('div');
                fallback.innerHTML = `<div style="text-align:center; color:#555; padding:20px;"><p style="font-size:40px; margin-bottom:10px;">🔌</p><p><b>368E 회로도.jpeg</b> 원본 이미지를<br/>프로젝트의 public 폴더에 넣어주세요.</p></div>`;
                e.target.parentNode.appendChild(fallback);
              }
            }} 
          />
        </div>
        
        <div style={{ position: "absolute", bottom: "15px", width: "100%", textAlign: "center", pointerEvents: "none" }}>
          <span style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "8px 15px", borderRadius: "20px", fontSize: "11px", color: "#aaa" }}>
            💡 마우스/터치로 이미지를 끌어서 이동하세요
          </span>
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
            <div key={res.id} onClick={() => setSelectedFileId(res.fileId)} style={{ width: "100%", maxWidth: "450px", backgroundColor: "#0a0a0a", borderRadius: "24px", border: "1.5px solid #222", overflow: "hidden", cursor: "pointer", textAlign: "left", flexShrink: 0 }}>
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
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#000", zIndex: 11000, display: "flex", flexDirection: "column", padding: "10px", boxSizing: "border-box" }}>
          <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 0', marginBottom: '10px' }}>
            <button onClick={() => setSelectedFileId(null)} style={{ color: '#FFFFFF', background: '#e11d48', border: 'none', fontSize: '14px', fontWeight: "900", cursor: 'pointer', padding: '12px 25px', borderRadius: '12px' }}>✕ CLOSE</button>
            <span style={{ color: '#f59e0b', fontWeight: "900", paddingTop: '12px' }}>RESOURCE VIEWER</span>
          </header>
          <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe src={`https://drive.google.com/file/d/${selectedFileId}/preview`} style={{ width: '100%', height: '100%', border: 'none' }} title="Full Preview" allow="autoplay; encrypted-media" />
          </div>
        </div>
      )}
    </div>
  );
};

const SequenceScreen = ({ setView, selectedModel }) => {
  const [activeStep, setActiveStep] = useState(1);
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
          <button 
            key={s.id} 
            onClick={() => setActiveStep(s.id)} 
            style={{ 
              padding: "10px 0", borderRadius: "8px", border: "1px solid #333", 
              backgroundColor: activeStep === s.id ? "#f59e0b" : "#111", 
              color: activeStep === s.id ? "#000" : "#fff", 
              fontWeight: "900", fontSize: "13px", cursor: "pointer",
              boxShadow: activeStep === s.id ? "0 0 10px rgba(245, 158, 11, 0.5)" : "none"
            }}
          >
            {s.id}
          </button>
        ))}
      </div>

      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "15px", 
        overflowY: "auto",
        paddingBottom: "20px" 
      }}>
        
        <div style={{ 
          flex: "1 1 500px", 
          minHeight: "350px", 
          maxHeight: "750px", 
          backgroundColor: "#0a0a0a", 
          borderRadius: "20px", 
          border: "2px solid #222", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: current?.images?.length > 0 ? "flex-start" : "center", 
          position: "relative",
          overflowY: "auto", 
          padding: current?.images?.length > 0 ? "10px" : "20px",
          gap: "15px"
        }}>
          {current?.images?.length > 0 ? (
            current.images.map((imgName, idx) => (
              <img 
                key={idx}
                src={`/${imgName}`} 
                alt={`Step ${activeStep} Diagram ${idx + 1}`} 
                style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: "10px", backgroundColor: "#000" }} 
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  if (!e.target.nextSibling) {
                    const fallback = document.createElement('div');
                    fallback.innerHTML = `<p style="color:#555; text-align:center; padding:20px;"><b>${imgName}</b> 파일을 찾을 수 없습니다.</p>`;
                    e.target.parentNode.appendChild(fallback);
                  }
                }} 
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#555" }}>
              <p style={{ fontSize: "40px", marginBottom: "10px" }}>🏍️</p>
              <p style={{ fontWeight: "bold", fontSize: "16px", color: "#888" }}>이 단계는 참고용 회로도가 없습니다.</p>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>우측의 텍스트 설명을 확인해 주세요.</p>
            </div>
          )}
        </div>

        <div style={{ 
          flex: "1 1 350px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px" 
        }}>
          <div style={{ backgroundColor: "#111", padding: "20px", borderRadius: "15px", borderLeft: "8px solid #f59e0b" }}>
            <span style={{ color: "#f59e0b", fontWeight: "900", fontSize: "14px" }}>STEP {activeStep < 10 ? `0${activeStep}` : activeStep}</span>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#fff", marginTop: "5px", marginBottom: 0 }}>{current.title}</h2>
          </div>

          <div style={{ backgroundColor: "#0a0a0a", border: "1.5px solid #222", padding: "18px", borderRadius: "15px" }}>
            <p style={{ color: "#888", fontSize: "11px", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}>📍 Diagnostic Point (측정 위치)</p>
            <p style={{ fontSize: "16px", fontWeight: "900", color: "#fff", lineHeight: "1.4" }}>{current.wiring}</p>
          </div>

          <div style={{ backgroundColor: "#1a1200", border: "2px solid #f59e0b", padding: "20px", borderRadius: "15px" }}>
            <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "900", marginBottom: "8px" }}>⚡ Standard Value (기준값)</p>
            <p style={{ fontSize: "22px", fontWeight: "900", fontStyle: "italic", color: "#fbbf24", margin: 0 }}>{current.check}</p>
          </div>

          <div style={{ backgroundColor: "#111", padding: "18px", borderRadius: "15px", border: "1.5px solid #222" }}>
            <p style={{ color: "#fff", fontSize: "14px", lineHeight: "1.6", fontWeight: "bold", margin: 0 }}>💡 {current.tip}</p>
          </div>

          {current.detail && (
            <div style={{ backgroundColor: "#001a33", padding: "18px", borderRadius: "15px", border: "1.5px solid #003366" }}>
              <p style={{ color: "#60a5fa", fontSize: "11px", fontWeight: "900", marginBottom: "8px" }}>📑 상세 분기 내역</p>
              <pre style={{ color: "#bfdbfe", fontSize: "13px", lineHeight: "1.6", fontWeight: "bold", margin: 0, fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                {current.detail}
              </pre>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

const CloudViewScreen = ({ setView }) => (
  <div style={{ ...styles.root, justifyContent: "flex-start", padding: "10px" }} translate="no">
    <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', marginTop: "35px" }}>
        <button onClick={() => setView("main")} style={styles.backBtn}>← BACK</button>
        <span style={{ fontSize: '12px', color: '#FFFFFF', fontStyle: 'italic', fontWeight: "900" }}>MOTOSTAR CLOUD</span>
    </header>
    <div style={{ width: "100%", flex: 1, backgroundColor: "#000", borderRadius: "25px", border: "1.5px solid #222", overflow: "hidden", display: "flex", marginTop: "20px", marginBottom: "20px" }}>
      <iframe src={`https://drive.google.com/embeddedfolderview?id=${DEFAULT_CONFIG.FOLDER_ID}#grid`} style={{ width: "100%", height: "100%", border: "none" }} title="Drive" allow="autoplay" />
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState("splash");
  const [selectedModel, setSelectedModel] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [userRole, setUserRole] = useState(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true); 
  const [isAutoLogReady, setIsAutoLogReady] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    document.documentElement.setAttribute("translate", "no");
    const savedRole = localStorage.getItem("MSK_AUTH_ROLE");
    if (savedRole) { 
      setUserRole(savedRole); 
      setIsAutoLogReady(true); 
    }
  }, []);

  const lockApp = () => {
    localStorage.removeItem("MSK_AUTH_ROLE");
    setUserRole(null); 
    setIsAutoLogReady(false); 
    setView("splash");
  };

  switch (view) {
    case "splash":
      return <SplashScreen setView={setView} isAutoLogReady={isAutoLogReady} lockApp={lockApp} />;
    case "intro":
      return <IntroScreen setView={setView} />;
    case "login":
      return <LoginScreen setView={setView} setUserRole={setUserRole} keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn} />;
    case "main":
      return <MainScreen setView={setView} lockApp={lockApp} />;
    case "models":
      return <ModelsScreen setView={setView} setSelectedModel={setSelectedModel} />;
    case "categories":
      return <CategoriesScreen setView={setView} selectedModel={selectedModel} setSelectedCategory={setSelectedCategory} />;
    case "electrical_menu":
      return <ElectricalMenuScreen setView={setView} selectedModel={selectedModel} />;
    case "electrical_library":
      return <ElectricalLibraryScreen setView={setView} selectedModel={selectedModel} />;
    case "wiring_diagram":
      return <WiringDiagramScreen setView={setView} selectedModel={selectedModel} />;
    case "sequence":
      return <SequenceScreen setView={setView} selectedModel={selectedModel} />;
    case "cloudView":
      return <CloudViewScreen setView={setView} />;
    default:
      return <div style={styles.root}>Initializing System...</div>;
  }
}