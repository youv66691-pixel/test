import React from 'react';
import { Question } from '../types';

interface ScienceDiagramProps {
  type: Question['diagramType'];
}

export const ScienceDiagram: React.FC<ScienceDiagramProps> = ({ type }) => {
  if (!type) return null;

  switch (type) {
    case 'mirror_lens':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>볼록렌즈 굴절 광선도</span>
            <span className="text-cyan-400 font-mono">물체 거리 &gt; 2f</span>
          </div>
          <svg viewBox="0 0 500 160" className="w-full h-36">
            {/* Optical Axis */}
            <line x1="20" y1="80" x2="480" y2="80" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
            
            {/* Convex Lens */}
            <ellipse cx="250" cy="80" rx="16" ry="65" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="2" />
            <line x1="250" y1="10" x2="250" y2="150" stroke="#0891b2" strokeWidth="1" strokeDasharray="2 2" />

            {/* Focal Points */}
            <circle cx="170" cy="80" r="3.5" fill="#38bdf8" />
            <text x="170" y="98" fill="#94a3b8" textAnchor="middle" fontSize="11">F (초점)</text>
            <circle cx="90" cy="80" r="3.5" fill="#38bdf8" />
            <text x="90" y="98" fill="#94a3b8" textAnchor="middle" fontSize="11">2f</text>

            <circle cx="330" cy="80" r="3.5" fill="#38bdf8" />
            <text x="330" y="98" fill="#94a3b8" textAnchor="middle" fontSize="11">F'</text>
            <circle cx="410" cy="80" r="3.5" fill="#38bdf8" />
            <text x="410" y="98" fill="#94a3b8" textAnchor="middle" fontSize="11">2f'</text>

            {/* Object (Candle) at > 2f */}
            <line x1="50" y1="80" x2="50" y2="25" stroke="#f59e0b" strokeWidth="4" />
            <polygon points="46,25 54,25 50,15" fill="#ef4444" />
            <text x="50" y="105" fill="#f59e0b" textAnchor="middle" fontSize="11" fontWeight="bold">촛불 (물체)</text>

            {/* Ray 1: Parallel to axis -> passes through F' */}
            <line x1="50" y1="25" x2="250" y2="25" stroke="#fbbf24" strokeWidth="1.8" />
            <line x1="250" y1="25" x2="420" y2="125" stroke="#fbbf24" strokeWidth="1.8" />

            {/* Ray 2: Passes through optical center */}
            <line x1="50" y1="25" x2="420" y2="125" stroke="#f472b6" strokeWidth="1.8" />

            {/* Inverted Image at between F' and 2f' */}
            <line x1="370" y1="80" x2="370" y2="110" stroke="#10b981" strokeWidth="3" />
            <polygon points="367,110 373,110 370,118" fill="#10b981" />
            <text x="370" y="138" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">축소된 거꾸로 선 상</text>
          </svg>
        </div>
      );

    case 'density_float':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>수조 속 물질의 밀도 비교</span>
            <span className="text-cyan-400 font-mono">밀도 기준: 물 = 1.0 g/cm³</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Beaker Container */}
            <rect x="120" y="20" width="260" height="115" rx="8" fill="none" stroke="#64748b" strokeWidth="2.5" />
            
            {/* Water layer */}
            <rect x="122" y="55" width="256" height="78" fill="rgba(14, 165, 233, 0.2)" />
            <line x1="122" y1="55" x2="378" y2="55" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
            <text x="350" y="75" fill="#38bdf8" fontSize="11">물 (1.0 g/cm³)</text>

            {/* Floating Object A: Cork (density 0.24) */}
            <rect x="150" y="42" width="46" height="25" rx="4" fill="#d97706" />
            <text x="173" y="58" fill="#ffffff" textAnchor="middle" fontSize="10" fontWeight="bold">코르크</text>
            <text x="173" y="36" fill="#fbbf24" textAnchor="middle" fontSize="10">밀도 0.24</text>

            {/* Floating Object B: Ice/Plastic (density 0.92) */}
            <rect x="230" y="50" width="50" height="35" rx="4" fill="#0284c7" opacity="0.85" />
            <text x="255" y="72" fill="#ffffff" textAnchor="middle" fontSize="10" fontWeight="bold">얼음</text>
            <text x="255" y="44" fill="#7dd3fc" textAnchor="middle" fontSize="10">밀도 0.92</text>

            {/* Sinking Object C: Iron/Gold (density 7.87) */}
            <rect x="310" y="110" width="44" height="22" rx="3" fill="#475569" stroke="#94a3b8" />
            <text x="332" y="125" fill="#f1f5f9" textAnchor="middle" fontSize="10" fontWeight="bold">쇠구슬</text>
            <text x="332" y="103" fill="#cbd5e1" textAnchor="middle" fontSize="10">밀도 7.87</text>

            {/* Annotations */}
            <text x="60" y="50" fill="#34d399" fontSize="11">▲ 밀도 &lt; 1.0 (뜸)</text>
            <text x="60" y="120" fill="#f87171" fontSize="11">▼ 밀도 &gt; 1.0 (가라앉음)</text>
          </svg>
        </div>
      );

    case 'photosynthesis':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>식물 엽록체의 광합성 메커니즘</span>
            <span className="text-emerald-400 font-mono">물 + CO₂ + 빛 → 포도당 + 산소</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Chloroplast Organelle */}
            <ellipse cx="250" cy="75" rx="150" ry="58" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2.5" />
            <text x="250" y="35" fill="#34d399" textAnchor="middle" fontSize="12" fontWeight="bold">엽록체 (Chloroplast)</text>

            {/* Sun / Light Energy */}
            <circle cx="70" cy="30" r="18" fill="#fbbf24" opacity="0.9" />
            <path d="M70,55 L140,65" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" markerEnd="url(#arrow)" />
            <text x="70" y="65" fill="#fde047" textAnchor="middle" fontSize="11" fontWeight="bold">빛에너지</text>

            {/* Inputs: Water and CO2 */}
            <rect x="40" y="85" width="80" height="26" rx="6" fill="#0284c7" />
            <text x="80" y="102" fill="#ffffff" textAnchor="middle" fontSize="11">물 (H₂O) 뿌리</text>

            <rect x="40" y="118" width="80" height="26" rx="6" fill="#475569" />
            <text x="80" y="135" fill="#ffffff" textAnchor="middle" fontSize="11">이산화탄소 (기공)</text>

            {/* Flow arrows into chloroplast */}
            <line x1="125" y1="98" x2="160" y2="85" stroke="#38bdf8" strokeWidth="2" />
            <line x1="125" y1="128" x2="165" y2="105" stroke="#94a3b8" strokeWidth="2" />

            {/* Internal Thylakoids / Chlorophyll */}
            <rect x="210" y="55" width="80" height="40" rx="6" fill="rgba(5, 150, 105, 0.4)" stroke="#34d399" strokeWidth="1.5" />
            <text x="250" y="78" fill="#ecfdf5" textAnchor="middle" fontSize="11" fontWeight="bold">엽록소 광화학 반응</text>

            {/* Outputs: Glucose and Oxygen */}
            <line x1="340" y1="70" x2="385" y2="60" stroke="#10b981" strokeWidth="2" />
            <line x1="340" y1="95" x2="385" y2="110" stroke="#06b6d4" strokeWidth="2" />

            <rect x="390" y="45" width="95" height="28" rx="6" fill="#059669" />
            <text x="437" y="63" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="bold">포도당 (녹말 저장)</text>

            <rect x="390" y="95" width="95" height="28" rx="6" fill="#0284c7" />
            <text x="437" y="113" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="bold">산소 (O₂ 방출)</text>
          </svg>
        </div>
      );

    case 'moon_phases':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>달의 공전과 위상 (태양-지구-달 위치 관계)</span>
            <span className="text-amber-400 font-mono">태양 - 지구 - 달 일직선 = 망(보름달)</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Sunlight rays from Left */}
            <line x1="10" y1="20" x2="80" y2="20" stroke="#f59e0b" strokeWidth="2" />
            <line x1="10" y1="75" x2="80" y2="75" stroke="#f59e0b" strokeWidth="2" />
            <line x1="10" y1="130" x2="80" y2="130" stroke="#f59e0b" strokeWidth="2" />
            <text x="45" y="55" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">햇빛 ➔</text>

            {/* Earth at center */}
            <circle cx="250" cy="75" r="26" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <path d="M250,49 A26,26 0 0,0 250,101 Z" fill="#0369a1" />
            <text x="250" y="79" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="bold">지구</text>

            {/* Moon Orbit */}
            <ellipse cx="250" cy="75" rx="140" ry="55" fill="none" stroke="#334155" strokeDasharray="4 4" strokeWidth="1.5" />

            {/* Position 1: New Moon (삭) - Between Sun and Earth */}
            <circle cx="120" cy="75" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <path d="M120,61 A14,14 0 0,1 120,89 Z" fill="#334155" />
            <text x="120" y="105" fill="#94a3b8" textAnchor="middle" fontSize="10">삭 (New)</text>

            {/* Position 2: First Quarter (상현) - Top */}
            <circle cx="250" cy="22" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <path d="M250,8 A14,14 0 0,1 250,36 Z" fill="#fbbf24" />
            <text x="250" y="7" fill="#fbbf24" textAnchor="middle" fontSize="10">상현달 (반달)</text>

            {/* Position 3: Full Moon (망/보름달) - Far right opposite to Sun */}
            <circle cx="380" cy="75" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="380" cy="75" r="18" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" />
            <text x="380" y="108" fill="#fde047" textAnchor="middle" fontSize="11" fontWeight="bold">망 (보름달) ★</text>
            <text x="380" y="122" fill="#cbd5e1" textAnchor="middle" fontSize="9">밤새 관측</text>

            {/* Position 4: Last Quarter (하현) - Bottom */}
            <circle cx="250" cy="128" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <path d="M250,114 A14,14 0 0,0 250,142 Z" fill="#fbbf24" />
            <text x="250" y="148" fill="#fbbf24" textAnchor="middle" fontSize="10">하현달 (반달)</text>
          </svg>
        </div>
      );

    case 'gravity_vacuum':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>자유 낙하 실험: 공기 중 vs 진공관</span>
            <span className="text-cyan-400 font-mono">진공: 질량 무관 동시 낙하 (g = 9.8 m/s²)</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Tube 1: Air */}
            <rect x="80" y="15" width="130" height="120" rx="6" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="2" />
            <text x="145" y="32" fill="#94a3b8" textAnchor="middle" fontSize="11" fontWeight="bold">공기 중 (저항 있음)</text>
            
            {/* Steel ball fallen faster */}
            <circle cx="120" cy="115" r="10" fill="#94a3b8" stroke="#f8fafc" />
            <text x="120" y="132" fill="#cbd5e1" textAnchor="middle" fontSize="9">쇠구슬</text>

            {/* Feather floating above */}
            <path d="M165,60 C175,55 180,68 170,75 C162,70 160,62 165,60 Z" fill="#fbbf24" />
            <text x="170" y="88" fill="#fbbf24" textAnchor="middle" fontSize="9">깃털 (저항↑)</text>
            <text x="145" y="102" fill="#f87171" textAnchor="middle" fontSize="10">시간차 발생</text>

            {/* Tube 2: Vacuum */}
            <rect x="290" y="15" width="140" height="120" rx="6" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth="2" />
            <text x="360" y="32" fill="#38bdf8" textAnchor="middle" fontSize="11" fontWeight="bold">진공 상태 (저항 없음)</text>

            {/* Both side by side at bottom */}
            <circle cx="335" cy="115" r="10" fill="#94a3b8" stroke="#f8fafc" />
            <text x="335" y="132" fill="#cbd5e1" textAnchor="middle" fontSize="9">쇠구슬 (1kg)</text>

            <path d="M380,110 C390,105 395,118 385,125 C377,120 375,112 380,110 Z" fill="#fbbf24" />
            <text x="385" y="132" fill="#fde047" textAnchor="middle" fontSize="9">깃털 (0.01kg)</text>

            {/* Equal acceleration indicator */}
            <line x1="315" y1="125" x2="405" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <text x="360" y="75" fill="#34d399" textAnchor="middle" fontSize="12" fontWeight="bold">동시 바닥 도착!</text>
            <text x="360" y="90" fill="#6ee7b7" textAnchor="middle" fontSize="10">가속도 a = g = 9.8 m/s²</text>
          </svg>
        </div>
      );

    case 'endothermic':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>화학 반응과 에너지 변화: 흡열 반응</span>
            <span className="text-cyan-400 font-mono">주위 열 흡수 → 주위 온도 하강 (냉각팩)</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Axis */}
            <line x1="60" y1="130" x2="440" y2="130" stroke="#64748b" strokeWidth="1.5" />
            <line x1="60" y1="130" x2="60" y2="20" stroke="#64748b" strokeWidth="1.5" />
            <text x="60" y="15" fill="#94a3b8" fontSize="10">에너지 (kJ)</text>
            <text x="430" y="145" fill="#94a3b8" fontSize="10">반응 진행 ➔</text>

            {/* Reactant energy level */}
            <line x1="80" y1="100" x2="180" y2="100" stroke="#38bdf8" strokeWidth="3" />
            <text x="130" y="118" fill="#7dd3fc" textAnchor="middle" fontSize="11" fontWeight="bold">반응물 (질산암모늄+물)</text>

            {/* Activation curve */}
            <path d="M180,100 Q240,30 300,55" fill="none" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1.5" />

            {/* Product energy level */}
            <line x1="300" y1="55" x2="410" y2="55" stroke="#10b981" strokeWidth="3" />
            <text x="355" y="45" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">생성물 (용액)</text>

            {/* Absorbed Heat delta H */}
            <line x1="260" y1="100" x2="260" y2="55" stroke="#f43f5e" strokeWidth="2.5" />
            <polygon points="256,60 264,60 260,50" fill="#f43f5e" />
            <text x="265" y="80" fill="#f43f5e" fontSize="11" fontWeight="bold">열에너지 흡수 (ΔH &gt; 0)</text>

            <rect x="330" y="90" width="100" height="30" rx="6" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" />
            <text x="380" y="110" fill="#38bdf8" textAnchor="middle" fontSize="10" fontWeight="bold">❄️ 주위 온도 하강</text>
          </svg>
        </div>
      );

    case 'digestion_enzymes':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>이자(Pancreas)의 3대 영양소 분해 효소</span>
            <span className="text-amber-400 font-mono">탄수화물 · 단백질 · 지방 동시 분해</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Organ diagram */}
            <ellipse cx="120" cy="75" rx="55" ry="35" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
            <text x="120" y="70" fill="#fde047" textAnchor="middle" fontSize="14" fontWeight="bold">이자 (Pancreas)</text>
            <text x="120" y="88" fill="#cbd5e1" textAnchor="middle" fontSize="10">이자액 분비</text>

            {/* Duct to duodenum */}
            <path d="M175,75 C200,75 210,75 230,75" stroke="#f59e0b" strokeWidth="4" />

            {/* 3 Enzyme outputs */}
            {/* 1. Amylase */}
            <line x1="230" y1="75" x2="280" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <rect x="285" y="20" width="180" height="26" rx="5" fill="#0284c7" />
            <text x="375" y="37" fill="#ffffff" textAnchor="middle" fontSize="11">아밀레이스 (녹말 ➔ 엿당)</text>

            {/* 2. Trypsin */}
            <line x1="230" y1="75" x2="280" y2="75" stroke="#10b981" strokeWidth="2" />
            <rect x="285" y="62" width="180" height="26" rx="5" fill="#059669" />
            <text x="375" y="79" fill="#ffffff" textAnchor="middle" fontSize="11">트립신 (단백질 분해)</text>

            {/* 3. Lipase */}
            <line x1="230" y1="75" x2="280" y2="115" stroke="#f43f5e" strokeWidth="2" />
            <rect x="285" y="104" width="180" height="26" rx="5" fill="#e11d48" />
            <text x="375" y="121" fill="#ffffff" textAnchor="middle" fontSize="11">라이페이스 (지방 ➔ 지방산+모노글리세리드)</text>
          </svg>
        </div>
      );

    case 'greenhouse':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>대기 중 온실 효과 메커니즘</span>
            <span className="text-rose-400 font-mono">주요 원인: CO₂ 화석 연료 배출</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Earth Surface */}
            <path d="M20,135 Q250,115 480,135" fill="none" stroke="#10b981" strokeWidth="5" />
            <text x="250" y="145" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">지구 표면 (지표면)</text>

            {/* Atmosphere layer */}
            <path d="M20,65 Q250,45 480,65" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" />
            <text x="440" y="55" fill="#38bdf8" textAnchor="middle" fontSize="10">대기권 계면</text>

            {/* Solar radiation (Visible/UV) passes through */}
            <line x1="70" y1="20" x2="130" y2="125" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="80" y="40" fill="#fde047" fontSize="10">태양 복사 (가시광선)</text>

            {/* Greenhouse gases layer */}
            <rect x="180" y="60" width="140" height="30" rx="8" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="250" y="76" fill="#fca5a5" textAnchor="middle" fontSize="11" fontWeight="bold">온실 기체 (CO₂, CH₄)</text>
            <text x="250" y="86" fill="#f87171" textAnchor="middle" fontSize="9">적외선 흡수 &amp; 재방출</text>

            {/* Earth IR radiation trapped */}
            <line x1="220" y1="125" x2="240" y2="92" stroke="#f43f5e" strokeWidth="2" />
            {/* Re-emitted back to earth */}
            <line x1="260" y1="92" x2="280" y2="125" stroke="#f43f5e" strokeWidth="2.5" />
            <polygon points="277,125 285,125 281,130" fill="#f43f5e" />
            <text x="330" y="115" fill="#fda4af" fontSize="10">지표로 재복사 (온실 효과)</text>
          </svg>
        </div>
      );

    case 'ohms_law':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>전기 회로도와 옴의 법칙</span>
            <span className="text-cyan-400 font-mono">I = V / R = 20V / 10Ω = 2A</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Circuit loop */}
            <rect x="80" y="30" width="340" height="90" rx="8" fill="none" stroke="#64748b" strokeWidth="2.5" />

            {/* Battery on left: 20V */}
            <rect x="74" y="60" width="12" height="30" fill="#0f172a" />
            <line x1="80" y1="65" x2="80" y2="72" stroke="#38bdf8" strokeWidth="4" />
            <line x1="75" y1="77" x2="85" y2="77" stroke="#38bdf8" strokeWidth="2" />
            <line x1="80" y1="82" x2="80" y2="88" stroke="#38bdf8" strokeWidth="4" />
            <text x="40" y="79" fill="#38bdf8" fontSize="12" fontWeight="bold">20 V</text>

            {/* Resistor on top: 10 ohms */}
            <rect x="210" y="22" width="80" height="16" fill="#0f172a" />
            <path d="M210,30 L220,20 L230,40 L240,20 L250,40 L260,20 L270,40 L280,30" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="250" y="14" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">저항 R = 10 Ω</text>

            {/* Ammeter on bottom */}
            <rect x="230" y="112" width="40" height="16" fill="#0f172a" />
            <circle cx="250" cy="120" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="250" y="124" fill="#34d399" textAnchor="middle" fontSize="12" fontWeight="bold">A</text>
            <text x="250" y="146" fill="#6ee7b7" textAnchor="middle" fontSize="11" fontWeight="bold">전류 I = 2 A</text>

            {/* Current direction arrow */}
            <line x1="330" y1="30" x2="370" y2="30" stroke="#06b6d4" strokeWidth="2" />
            <polygon points="370,27 376,30 370,33" fill="#06b6d4" />
            <text x="350" y="48" fill="#67e8f9" textAnchor="middle" fontSize="10">전류 흐름 (I)</text>
          </svg>
        </div>
      );

    case 'precipitation':
      return (
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2 text-slate-400 font-medium">
            <span>앙금 생성 반응: 질산 은 + 염화 나트륨</span>
            <span className="text-cyan-400 font-mono">Ag⁺ + Cl⁻ → AgCl ↓ (흰색 앙금)</span>
          </div>
          <svg viewBox="0 0 500 150" className="w-full h-36">
            {/* Test Tube 1: AgNO3 */}
            <rect x="90" y="25" width="40" height="75" rx="10" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2" />
            <text x="110" y="60" fill="#38bdf8" textAnchor="middle" fontSize="10">AgNO₃</text>
            <text x="110" y="72" fill="#bae6fd" textAnchor="middle" fontSize="9">수용액</text>

            <text x="145" y="65" fill="#94a3b8" fontSize="16">+</text>

            {/* Test Tube 2: NaCl */}
            <rect x="170" y="25" width="40" height="75" rx="10" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2" />
            <text x="190" y="60" fill="#38bdf8" textAnchor="middle" fontSize="10">NaCl</text>
            <text x="190" y="72" fill="#bae6fd" textAnchor="middle" fontSize="9">수용액</text>

            {/* Arrow */}
            <path d="M225,65 L265,65" stroke="#f59e0b" strokeWidth="2.5" />
            <polygon points="265,60 273,65 265,70" fill="#f59e0b" />

            {/* Reaction Beaker on Right */}
            <rect x="300" y="25" width="85" height="95" rx="6" fill="rgba(15, 23, 42, 0.8)" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="302" y="55" width="81" height="63" fill="rgba(14, 165, 233, 0.15)" />

            {/* White Precipitate AgCl at bottom */}
            <rect x="306" y="102" width="73" height="15" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="320" cy="108" r="3" fill="#cbd5e1" />
            <circle cx="340" cy="110" r="2.5" fill="#cbd5e1" />
            <circle cx="360" cy="107" r="3" fill="#cbd5e1" />
            <text x="342.5" y="94" fill="#ffffff" textAnchor="middle" fontSize="10" fontWeight="bold">AgCl ↓</text>
            <text x="342.5" y="132" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="bold">흰색 앙금 생성</text>

            {/* Spectator ions */}
            <text x="430" y="60" fill="#94a3b8" fontSize="10">구경꾼 이온:</text>
            <text x="430" y="75" fill="#cbd5e1" fontSize="11">Na⁺, NO₃⁻</text>
            <text x="430" y="90" fill="#64748b" fontSize="9">(용액 속에 유지)</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
