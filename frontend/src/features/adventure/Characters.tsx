import type { ReactNode } from 'react'

// Dibujos propios de la Aventura (mismo estilo que Opi: formas redondas y contorno oscuro)
const INK = '#1E1B4B'
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function Eyes({ y, cx = 60, gap = 12, r = 7, angry = false }: { y: number; cx?: number; gap?: number; r?: number; angry?: boolean }) {
  return (
    <g>
      {[cx - gap, cx + gap].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} fill="#fff" {...line} strokeWidth={2} />
          <circle cx={x + (angry ? (i ? -1.5 : 1.5) : 1)} cy={y + 1} r={r * 0.5} fill={INK} />
          <circle cx={x + 2} cy={y - 1.5} r={r * 0.17} fill="#fff" />
        </g>
      ))}
      {angry && (
        <g {...line} strokeWidth={3.5}>
          <path d={`M${cx - gap - r} ${y - r - 4} L${cx - gap + r} ${y - r + 1}`} />
          <path d={`M${cx + gap + r} ${y - r - 4} L${cx + gap - r} ${y - r + 1}`} />
        </g>
      )}
    </g>
  )
}

function Smile({ y, cx = 60, w = 10 }: { y: number; cx?: number; w?: number }) {
  return <path d={`M${cx - w} ${y} Q${cx} ${y + w} ${cx + w} ${y}`} fill="none" {...line} />
}

function Fangs({ y, cx = 60, w = 12 }: { y: number; cx?: number; w?: number }) {
  return (
    <g>
      <path d={`M${cx - w} ${y} Q${cx} ${y + 6} ${cx + w} ${y}`} fill="none" {...line} />
      <path d={`M${cx - w / 2} ${y + 2.5} l3 6 l3 -5`} fill="#fff" {...line} strokeWidth={2} />
      <path d={`M${cx + w / 2 - 6} ${y + 3} l3 5 l3 -6`} fill="#fff" {...line} strokeWidth={2} />
    </g>
  )
}

function Cheeks({ y, cx = 60, gap = 20 }: { y: number; cx?: number; gap?: number }) {
  return (
    <g fill="#FF8FB1" opacity={0.7}>
      <ellipse cx={cx - gap} cy={y} rx={5} ry={3} />
      <ellipse cx={cx + gap} cy={y} rx={5} ry={3} />
    </g>
  )
}

// ---------- Héroes ----------
const heroArt: Record<string, ReactNode> = {
  numeron: (
    <>
      <circle cx="60" cy="74" r="36" fill="#4F8CFF" {...line} />
      <ellipse cx="60" cy="90" rx="22" ry="14" fill="#7FAEFF" />
      <path d="M60 30 Q66 8 84 12 Q72 18 68 31" fill="#FFC93C" {...line} />
      <path d="M24 66 Q24 30 60 30 Q96 30 96 66 L88 66 Q86 50 60 50 Q34 50 32 66 Z" fill="#C9D3E8" {...line} />
      <rect x="56" y="34" width="8" height="16" rx="3" fill="#9AA8C7" />
      <Eyes y={70} />
      <Cheeks y={82} />
      <Smile y={84} />
      <path d="M80 80 H110 V96 Q110 110 95 116 Q80 110 80 96 Z" fill="#FFC93C" {...line} />
      <path d="M95 86 V106 M85 96 H105" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  incognita: (
    <>
      <path d="M16 40 L20 114" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="16" cy="34" r="9" fill="#5EEAD4" {...line} />
      <circle cx="60" cy="78" r="34" fill="#B05CF0" {...line} />
      <ellipse cx="60" cy="94" rx="20" ry="12" fill="#C98BF7" />
      <path d="M32 54 Q46 30 58 6 Q66 4 68 12 Q78 34 88 54 Z" fill="#4B2A8C" {...line} />
      <ellipse cx="60" cy="54" rx="38" ry="8" fill="#4B2A8C" {...line} />
      <path d="M53 26 L65 40 M65 26 L53 40" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" />
      <Eyes y={76} />
      <Cheeks y={88} />
      <Smile y={90} w={8} />
    </>
  ),
  compasia: (
    <>
      <path d="M98 34 Q120 74 98 114" fill="none" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
      <path d="M98 34 L98 114" stroke={INK} strokeWidth="1.5" />
      <circle cx="58" cy="76" r="35" fill="#22C55E" {...line} />
      <ellipse cx="58" cy="94" rx="20" ry="12" fill="#5EDB8C" />
      <path d="M22 72 Q20 30 58 28 Q96 30 94 72 Q86 48 58 48 Q30 48 22 72 Z" fill="#15803D" {...line} />
      <path d="M58 32 L66 46 H50 Z" fill="#FFC93C" {...line} strokeWidth={2} />
      <Eyes y={72} cx={58} />
      <Cheeks y={84} cx={58} />
      <Smile y={86} cx={58} />
    </>
  ),
  azaria: (
    <>
      <circle cx="58" cy="74" r="35" fill="#FF9F43" {...line} />
      <ellipse cx="58" cy="92" rx="20" ry="12" fill="#FFC285" />
      <path d="M26 60 Q26 30 58 30 Q90 30 90 60 Z" fill="#F43F5E" {...line} />
      <path d="M86 58 Q104 56 110 64 Q98 66 86 64 Z" fill="#C81E44" {...line} />
      <circle cx="58" cy="32" r="5" fill="#FFC93C" {...line} strokeWidth={2} />
      <Eyes y={70} cx={56} />
      <Cheeks y={82} cx={56} />
      <Smile y={84} cx={56} />
      <rect x="80" y="82" width="30" height="30" rx="7" fill="#fff" {...line} transform="rotate(12 95 97)" />
      <g fill={INK} transform="rotate(12 95 97)">
        <circle cx="88" cy="89" r="3" />
        <circle cx="95" cy="97" r="3" />
        <circle cx="102" cy="105" r="3" />
      </g>
    </>
  ),
}

// ---------- Monstruos (uno por etapa) ----------
const enemyArt: Record<string, ReactNode> = {
  pradera: (
    <>
      <circle cx="26" cy="92" r="15" fill="#84CC16" {...line} />
      <circle cx="48" cy="88" r="18" fill="#84CC16" {...line} />
      <path d="M20 92 H32 M42 88 H54" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 46 Q68 26 60 22 M90 46 Q96 26 104 22" fill="none" {...line} />
      <circle cx="60" cy="22" r="4" fill="#FFC93C" {...line} strokeWidth={2} />
      <circle cx="104" cy="22" r="4" fill="#FFC93C" {...line} strokeWidth={2} />
      <circle cx="82" cy="70" r="26" fill="#A3E635" {...line} />
      <Eyes y={64} cx={82} gap={10} r={6} angry />
      <Fangs y={80} cx={82} w={10} />
    </>
  ),
  cueva: (
    <>
      <path d="M36 58 Q10 36 2 72 Q14 66 18 80 Q26 70 36 80 Z" fill="#5B21B6" {...line} />
      <path d="M84 58 Q110 36 118 72 Q106 66 102 80 Q94 70 84 80 Z" fill="#5B21B6" {...line} />
      <path d="M40 46 L44 20 L56 40 Z M80 46 L76 20 L64 40 Z" fill="#7C3AED" {...line} />
      <circle cx="60" cy="68" r="30" fill="#7C3AED" {...line} />
      <circle cx="60" cy="86" r="11" fill="#EDE9FE" {...line} strokeWidth={2} />
      <path d="M53 86 H67" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="80.5" r="2" fill={INK} />
      <circle cx="60" cy="91.5" r="2" fill={INK} />
      <Eyes y={60} gap={11} r={6} angry />
      <Fangs y={70} w={8} />
    </>
  ),
  pantano: (
    <>
      <ellipse cx="60" cy="82" rx="42" ry="30" fill="#10B981" {...line} />
      <ellipse cx="60" cy="94" rx="26" ry="14" fill="#6EE7B7" />
      <path d="M52 86 L68 102 M68 86 L52 102" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
      <circle cx="38" cy="50" r="15" fill="#10B981" {...line} />
      <circle cx="82" cy="50" r="15" fill="#10B981" {...line} />
      <Eyes y={50} gap={22} r={8} angry />
      <path d="M38 68 Q60 82 82 68" fill="none" {...line} strokeWidth={4} />
    </>
  ),
  torre: (
    <>
      <path d="M60 12 V40" {...line} strokeWidth={4} />
      <path d="M30 16 H90" {...line} strokeWidth={4} />
      <path d="M30 16 L22 32 H38 Z M90 16 L82 32 H98 Z" fill="#FFC93C" {...line} strokeWidth={2} />
      <rect x="24" y="40" width="72" height="72" rx="14" fill="#9CA3AF" {...line} />
      <path d="M36 52 L44 60 L40 68 M84 96 L76 90 L80 82" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 66 L52 70 M82 66 L68 70" {...line} strokeWidth={4} />
      <rect x="40" y="72" width="12" height="7" rx="3" fill="#FFC93C" {...line} strokeWidth={2} />
      <rect x="68" y="72" width="12" height="7" rx="3" fill="#FFC93C" {...line} strokeWidth={2} />
      <rect x="44" y="90" width="32" height="8" rx="3" fill="#4B5563" {...line} strokeWidth={2} />
    </>
  ),
  jardin: (
    <>
      <path d="M8 106 Q8 88 26 88 H100 Q112 88 112 106 Z" fill="#FCD34D" {...line} />
      <rect x="46" y="34" width="56" height="56" rx="12" fill="#F59E0B" {...line} />
      <path d="M74 62 h8 v8 h-16 v-16 h24 v24 h-32 v-32 h40" fill="none" stroke="#92400E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="26" cy="74" rx="15" ry="22" fill="#FCD34D" {...line} />
      <path d="M20 54 L14 34 M32 54 L38 34" {...line} />
      <circle cx="14" cy="32" r="4" fill={INK} />
      <circle cx="38" cy="32" r="4" fill={INK} />
      <Eyes y={70} cx={26} gap={7} r={5} angry />
      <Fangs y={82} cx={26} w={7} />
    </>
  ),
  valle: (
    <>
      <path d="M84 84 L100 42 L76 24" fill="none" stroke="#B91C1C" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 24 L66 18 L70 30 Z" fill="#FFC93C" {...line} strokeWidth={2} />
      <path d="M94 56 A14 14 0 0 1 90 34" fill="none" stroke="#FFC93C" strokeWidth="3" />
      <path d="M30 94 l-10 14 M44 98 l-6 14 M64 98 l6 14 M78 94 l10 12" {...line} />
      <ellipse cx="56" cy="84" rx="34" ry="20" fill="#EF4444" {...line} />
      <circle cx="16" cy="62" r="11" fill="#EF4444" {...line} />
      <path d="M8 56 L16 62 L8 68" fill="#FCA5A5" {...line} strokeWidth={2} />
      <path d="M26 72 L32 80" {...line} />
      <Eyes y={80} cx={50} gap={10} r={6} angry />
      <Fangs y={92} cx={50} w={8} />
    </>
  ),
  mercado: (
    <>
      <path d="M48 26 Q46 6 56 4 Q56 16 60 24 Q64 8 74 8 Q70 20 70 30" fill="#FFC93C" {...line} />
      <ellipse cx="60" cy="70" rx="32" ry="40" fill="#22C55E" {...line} />
      <path d="M28 66 Q16 90 34 104 Q36 84 40 74 Z M92 66 Q104 90 86 104 Q84 84 80 74 Z" fill="#15803D" {...line} />
      <rect x="46" y="84" width="28" height="20" rx="4" fill="#fff" {...line} strokeWidth={2} />
      <path d="M52 100 V94 M60 100 V88 M68 100 V92" stroke="#6C4CF5" strokeWidth="4" strokeLinecap="round" />
      <Eyes y={52} gap={12} r={7} angry />
      <path d="M52 62 Q60 56 68 62 Q66 74 60 80 Q54 74 52 62 Z" fill="#FFC93C" {...line} />
    </>
  ),
  feria: (
    <>
      <path d="M30 40 L32 18 L48 34 Z M90 40 L88 18 L72 34 Z" fill="#A16207" {...line} />
      <circle cx="60" cy="72" r="40" fill="#A16207" {...line} />
      <ellipse cx="60" cy="92" rx="24" ry="18" fill="#FDE68A" />
      <text x="60" y="102" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="26" fill="#A16207">?</text>
      <circle cx="44" cy="60" r="15" fill="#FDE68A" {...line} strokeWidth={2} />
      <circle cx="76" cy="60" r="15" fill="#FDE68A" {...line} strokeWidth={2} />
      <Eyes y={60} gap={16} r={9} angry />
      <path d="M55 70 L65 70 L60 80 Z" fill="#F59E0B" {...line} strokeWidth={2} />
    </>
  ),
  castillo: (
    <>
      <path d="M30 60 Q2 30 4 76 Q14 70 18 84 Q24 74 32 82 Z" fill="#7F1D1D" {...line} />
      <path d="M90 60 Q118 30 116 76 Q106 70 102 84 Q96 74 88 82 Z" fill="#7F1D1D" {...line} />
      <path d="M92 100 Q116 104 110 84 Q106 92 96 92" fill="#B91C1C" {...line} />
      <path d="M40 40 Q30 18 40 8 Q42 26 50 34 Z M80 40 Q90 18 80 8 Q78 26 70 34 Z" fill="#FFC93C" {...line} />
      <circle cx="60" cy="72" r="38" fill="#B91C1C" {...line} />
      <ellipse cx="60" cy="98" rx="22" ry="12" fill="#FCA5A5" />
      <path d="M50 92 H70 M50 100 H70 M66 86 L54 106" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="60" cy="74" rx="18" ry="11" fill="#DC2626" {...line} strokeWidth={2} />
      <circle cx="54" cy="72" r="2" fill={INK} />
      <circle cx="66" cy="72" r="2" fill={INK} />
      <Eyes y={56} gap={14} r={8} angry />
      <Fangs y={82} w={12} />
    </>
  ),
}

function Art({ children, size, label }: { children: ReactNode; size: number; label: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} className="character">
      {children}
    </svg>
  )
}

export function HeroArt({ id, size = 64, label }: { id: string; size?: number; label: string }) {
  return <Art size={size} label={label}>{heroArt[id]}</Art>
}

export function EnemyArt({ stageId, size = 64, label }: { stageId: string; size?: number; label: string }) {
  return <Art size={size} label={label}>{enemyArt[stageId]}</Art>
}
