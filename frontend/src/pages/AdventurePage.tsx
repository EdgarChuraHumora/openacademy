import { useState } from 'react'
import { Link } from 'react-router-dom'
import { areaLabel, HERO_XP_PER_LEVEL, heroLevel, heroStats, heroes, MAX_UPGRADE, stages, UPGRADE_BONUS, upgradeCost, type Upgrades } from '../features/adventure/data'
import { EnemyArt, HeroArt } from '../features/adventure/Characters'
import { heroUpgrades, isHeroUnlocked, isStageUnlocked, type AdventureSave } from '../features/adventure/storage'
import { useAdventure } from '../features/adventure/useAdventure'

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
  const { save, online, failed, buy } = useAdventure()
  if (failed) {
    return (
      <section className="adventure stack narrow center">
        <p>No se pudo cargar tu aventura. Revisa tu conexión y vuelve a intentarlo.</p>
        <button className="btn btn--yellow" onClick={() => window.location.reload()}>Reintentar</button>
      </section>
    )
  }
  if (!save) return <p className="muted center">Cargando tu aventura…</p>
  return <AdventureMap save={save} online={online} buy={buy} />
}

interface MapProps {
  save: AdventureSave
  online: boolean
  buy: (heroId: string, type: keyof Upgrades) => Promise<string | null>
}

function AdventureMap({ save, online, buy }: MapProps) {
  const [shopError, setShopError] = useState('')
  const [busy, setBusy] = useState(false)
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

  const current = heroes.find((h) => h.id === selected) ?? heroes[0]
  const owned = heroUpgrades(save, current.id)

  async function purchase(type: keyof Upgrades) {
    setBusy(true)
    setShopError((await buy(current.id, type)) ?? '')
    setBusy(false)
  }

  return (
    <section className="adventure stack">
      <div className="page-head">
        <h1>⚔️ Aventura</h1>
        <p>Elige a tu héroe y derrota a los monstruos resolviendo ejercicios. Cada respuesta correcta es un ataque.</p>
      </div>

      <div className="adv-coins">🪙 {save.coins} monedas</div>
      <p className="adv-note adv-note--left">
        {online ? (
          '☁️ Tu avance se guarda en tu cuenta.'
        ) : (
          <>
            Tu avance se guarda solo en este navegador. <Link to="/login">Inicia sesión</Link> para guardarlo en tu cuenta.
          </>
        )}
      </p>

      <h2 className="section-title">Tus héroes</h2>
      <div className="hero-grid">
        {heroes.map((h) => {
          const unlocked = isHeroUnlocked(h, save)
          const xp = save.heroXp[h.id] ?? 0
          const stats = heroStats(h, xp, heroUpgrades(save, h.id))
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
              <span className="hero-card__portrait" aria-hidden="true">{unlocked ? <HeroArt id={h.id} label={h.name} size={60} /> : '🔒'}</span>
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

      <h2 className="section-title">Tienda de {current.name}</h2>
      <div className="adv-shop">
        {([
          ['attack', '⚔️ Más ataque'],
          ['hp', '❤️ Más vida'],
        ] as const).map(([type, label]) => {
          const n = owned[type]
          const cost = upgradeCost(n)
          const maxed = n >= MAX_UPGRADE
          return (
            <div key={type} className="adv-shop__item">
              <strong>{label}</strong>
              <small>+{Math.round(UPGRADE_BONUS * 100)} % cada mejora · {n}/{MAX_UPGRADE}</small>
              <button className="btn btn--yellow btn--small" disabled={busy || maxed || save.coins < cost} onClick={() => purchase(type)}>
                {maxed ? 'Al máximo' : `Comprar · ${cost} 🪙`}
              </button>
            </div>
          )
        })}
      </div>
      {shopError && <p className="auth__error" role="alert">{shopError}</p>}
      <p className="adv-note">Gana monedas venciendo etapas: más estrellas, más monedas.</p>

      <h2 className="section-title">Mapa</h2>
      <ol className="adv-map">
        {stages.map((s, i) => {
          const open = isStageUnlocked(i, save)
          const stars = save.stars[s.id] ?? 0
          const body = (
            <>
              <span className="adv-stage__icon" aria-hidden="true">{open ? <EnemyArt stageId={s.id} label={s.enemy.name} size={46} /> : '🔒'}</span>
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
