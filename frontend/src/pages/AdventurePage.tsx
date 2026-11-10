import { useState } from 'react'
import { Link } from 'react-router-dom'
import { areaLabel, HERO_XP_PER_LEVEL, heroLevel, heroStats, heroes, stages } from '../features/adventure/data'
import { isHeroUnlocked, isStageUnlocked, loadAdventure } from '../features/adventure/storage'

const SELECTED_KEY = 'oa-aventura-heroe'

function readSelected() {
  try {
    return localStorage.getItem(SELECTED_KEY) ?? 'numeron'
  } catch {
    return 'numeron'
  }
}

// /aventura: elige un héroe y una etapa del mapa
export default function AdventurePage() {
  const save = loadAdventure()
  const [selected, setSelected] = useState(() => {
    const id = readSelected()
    const hero = heroes.find((h) => h.id === id)
    return hero && isHeroUnlocked(hero, save) ? id : 'numeron'
  })

  function choose(id: string) {
    setSelected(id)
    try {
      localStorage.setItem(SELECTED_KEY, id)
    } catch {
      // sin almacenamiento: se elige solo para esta visita
    }
  }

  return (
    <section className="adventure stack">
      <div className="page-head">
        <h1>⚔️ Aventura</h1>
        <p>Elige a tu héroe y derrota a los monstruos resolviendo ejercicios. Cada respuesta correcta es un ataque.</p>
      </div>

      <h2 className="section-title">Tus héroes</h2>
      <div className="hero-grid">
        {heroes.map((h) => {
          const unlocked = isHeroUnlocked(h, save)
          const xp = save.heroXp[h.id] ?? 0
          const stats = heroStats(h, xp)
          const lockStage = stages.find((s) => s.id === h.unlockAfter)
          return (
            <button
              key={h.id}
              type="button"
              className={`hero-card ${selected === h.id ? 'hero-card--selected' : ''}`}
              disabled={!unlocked}
              aria-pressed={selected === h.id}
              onClick={() => choose(h.id)}
            >
              <span className="hero-card__portrait" aria-hidden="true">{unlocked ? h.icon : '🔒'}</span>
              <strong>{h.name}</strong>
              <small>{h.title}</small>
              {unlocked ? (
                <>
                  <span className="hero-card__level">Nivel {heroLevel(xp)} · {areaLabel[h.area]}</span>
                  <span className="adv-bar"><span style={{ width: `${((xp % HERO_XP_PER_LEVEL) / HERO_XP_PER_LEVEL) * 100}%` }} /></span>
                  <span className="hero-card__stats">❤️ {stats.hp} · ⚔️ {stats.attack}</span>
                  <span className="hero-card__special">✨ {h.special.name}: {h.special.description}</span>
                </>
              ) : (
                <span className="hero-card__special">Gana la etapa «{lockStage?.name}» para conseguirlo</span>
              )}
            </button>
          )
        })}
      </div>

      <h2 className="section-title">Mapa</h2>
      <ol className="adv-map">
        {stages.map((s, i) => {
          const open = isStageUnlocked(i, save)
          const stars = save.stars[s.id] ?? 0
          const body = (
            <>
              <span className="adv-stage__icon" aria-hidden="true">{open ? s.enemy.icon : '🔒'}</span>
              <span className="adv-stage__info">
                <strong>{i + 1}. {s.name}</strong>
                <small>
                  {s.area === 'mixta' ? 'Todas las áreas' : areaLabel[s.area]} · {open ? s.enemy.name : 'Gana la etapa anterior'}
                  {s.boss && ' · Jefe final'}
                </small>
              </span>
              {stars > 0 && (
                <span className="adv-stage__stars" aria-label={`${stars} de 3 estrellas`}>
                  {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                </span>
              )}
            </>
          )
          return (
            <li key={s.id}>
              {open ? (
                <Link to={`/aventura/batalla/${s.id}?heroe=${selected}`} className={`adv-stage ${s.boss ? 'adv-stage--boss' : ''}`}>
                  {body}
                </Link>
              ) : (
                <div className="adv-stage adv-stage--locked">{body}</div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="adv-note">
        Pista: si el héroe es del área de la etapa, hace más daño. Responder rápido da golpes críticos.
      </p>
    </section>
  )
}
