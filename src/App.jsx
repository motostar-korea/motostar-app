import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ChevronRight, 
  Search, 
  FileText, 
  Cloud, 
  Lock, 
  Wrench,
  Zap,
  Cpu,
  ChevronLeft,
  Home,
  Menu,
  X
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 로고 섹션 컴포넌트
  const LogoSection = () => (
    <div className="flex flex-col items-center mb-8">
      {/* 로고 이미지 자리 */}
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-gradient-to-b from-neutral-800 to-black p-4 rounded-xl border border-neutral-700 shadow-2xl flex items-center justify-center h-full w-full overflow-hidden">
          {/* 엠블럼 심볼 (SVG나 이미지가 없을 경우를 대비한 대체 아이콘) */}
          <div className="text-yellow-500">
             <Zap size={40} fill="currentColor" />
          </div>
        </div>
      </div>
      
      {/* 텍스트 타이틀 - 이 부분이 수정된 핵심 영역입니다 */}
      <div className="flex flex-col items-center space-y-1">
         <span className="text-neutral-400 text-[10px] tracking-[0.3em] font-medium mb-1">PREMIUM SERVICE</span>
         <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-none">
              MOTOSTAR
            </h1>
            {/* KOREA 텍스트에 상단 여백(mt-2)을 추가하여 간격을 조절했습니다 */}
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white leading-none mt-2">
              KOREA
            </h2>
         </div>
         <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-yellow-600 to-transparent mt-4 opacity-70"></div>
         <span className="text-yellow-500 text-[11px] tracking-[0.5em] font-bold mt-2">PREMIUM SERVICE</span>
      </div>
    </div>
  );

  // 메인 대시보드 화면
  const MainDashboard = () => (
    <div className="flex-1 flex flex-col px-6 py-8 animate-in fade-in duration-700">
      <LogoSection />
      
      <div className="space-y-4 mt-4">
        {/* 정비 지원 버튼 */}
        <button 
          onClick={() => setView('technical_support')}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between group active:scale-95 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
              <Wrench size={24} />
            </div>
            <div className="text-left">
              <div className="text-white text-lg font-bold">차종별 정비 지원</div>
              <div className="text-neutral-500 text-xs">Technical Manuals</div>
            </div>
          </div>
          <div className="text-yellow-500 flex items-center gap-1 font-bold text-xs">
            VIEW <ChevronRight size={16} />
          </div>
        </button>

        {/* 정비 자료실 버튼 */}
        <button 
          className="w-full bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-5 flex items-center justify-between group active:scale-95 transition-all duration-200"
        >
          <div className="flex items-center gap-4 opacity-80">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Cloud size={24} />
            </div>
            <div className="text-left">
              <div className="text-white text-lg font-bold">정비 자료실 (Cloud)</div>
              <div className="text-neutral-500 text-xs">Resource Library</div>
            </div>
          </div>
          <div className="text-blue-500 flex items-center gap-1 font-bold text-xs opacity-80">
            OPEN <ChevronRight size={16} />
          </div>
        </button>
      </div>

      <div className="mt-auto pt-10 text-center">
        <p className="text-neutral-600 text-[10px] tracking-widest uppercase">Motostar Korea Management System v2.0</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col max-w-md mx-auto border-x border-neutral-900 shadow-2xl relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-600 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-900 rounded-full blur-[100px]"></div>
      </div>

      {/* 상단 헤더 */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-white font-black italic tracking-tighter text-xl">MOTOSTAR</span>
          <span className="text-yellow-500 text-[8px] font-bold tracking-widest uppercase">Technical Support</span>
        </div>
        
        <button className="bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold tracking-tighter uppercase transition-colors hover:bg-red-500 hover:text-white">
          Logout <Lock size={12} />
        </button>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col relative z-10">
        {view === 'home' && <MainDashboard />}
        {view !== 'home' && (
          <div className="p-6">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-neutral-400 mb-6 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} /> Back to Dashboard
            </button>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
               <Settings className="mx-auto mb-4 text-neutral-600 animate-spin-slow" size={48} />
               <h3 className="text-xl font-bold mb-2">Service Preparing</h3>
               <p className="text-neutral-500 text-sm italic">'{view}' 메뉴를 준비 중입니다.</p>
            </div>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="bg-neutral-950/80 backdrop-blur-md border-t border-neutral-900 px-8 py-4 flex items-center justify-between relative z-10">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-yellow-500' : 'text-neutral-600'}`}>
          <Home size={20} />
          <span className="text-[8px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-neutral-600">
          <Search size={20} />
          <span className="text-[8px] font-bold uppercase">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-neutral-600">
          <FileText size={20} />
          <span className="text-[8px] font-bold uppercase">Documents</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-neutral-600">
          <Menu size={20} />
          <span className="text-[8px] font-bold uppercase">More</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default App;