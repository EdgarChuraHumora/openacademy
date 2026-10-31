type Mood = 'happy' | 'sad' | 'celebrate'

interface MascotProps {
  size?: number
  mood?: Mood
}

// Opi, la mascota de OpenAcademy (provisional)
export default function Mascot({ size = 120, mood = 'happy' }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Opi, la mascota">
      <circle cx="60" cy="70" r="42" fill="#6C4CF5" />
      <ellipse cx="60" cy="88" rx="26" ry="18" fill="#8E75FF" />
      <ellipse cx="33" cy="80" rx="6" ry="4" fill="#FF8FB1" opacity="0.8" />
      <ellipse cx="87" cy="80" rx="6" ry="4" fill="#FF8FB1" opacity="0.8" />

      {mood === 'celebrate' ? (
        <g stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M36 66 Q44 56 52 66" />
          <path d="M68 66 Q76 56 84 66" />
        </g>
      ) : (
        <g>
          <circle cx="44" cy="64" r="11" fill="#fff" />
          <circle cx="76" cy="64" r="11" fill="#fff" />
          <circle cx="46" cy={mood === 'sad' ? 67 : 65} r="5.5" fill="#1E1B4B" />
          <circle cx="78" cy={mood === 'sad' ? 67 : 65} r="5.5" fill="#1E1B4B" />
          <circle cx="48" cy="63" r="1.8" fill="#fff" />
          <circle cx="80" cy="63" r="1.8" fill="#fff" />
        </g>
      )}

      <path
        d={mood === 'sad' ? 'M50 88 Q60 80 70 88' : 'M48 82 Q60 94 72 82'}
        stroke="#1E1B4B"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill={mood === 'celebrate' ? '#1E1B4B' : 'none'}
      />

      <path d="M38 30 L38 40 Q60 50 82 40 L82 30 Z" fill="#2B2766" />
      <polygon points="60,12 102,26 60,40 18,26" fill="#1E1B4B" />
      <path d="M60 26 L94 30 L94 46" stroke="#FFC93C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="48" r="4.5" fill="#FFC93C" />
    </svg>
  )
}
