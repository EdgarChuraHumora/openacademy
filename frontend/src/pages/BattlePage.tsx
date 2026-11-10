import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MathText from '../components/MathText'
import { EnemyArt, HeroArt } from '../features/adventure/Characters'
import { coinReward, heroes, heroLevel, heroStats, stages, type Hero, type Stage } from '../features/adventure/data'
import { makeQuestion, type BattleQuestion } from '../features/adventure/questions'
import { heroUpgrades, isHeroUnlocked, isStageUnlocked, type AdventureSave } from '../features/adventure/storage'
import { useAdventure } from '../features/adventure/useAdventure'
import { useRecordGame } from '../lib/results'

const letters = ['A', 'B', 'C', 'D']
const SECONDS = 20 // tiempo para responder cada ejercicio
const FAST = 6 // si responde antes de estos segundos, golpe crítico
const CHARGE = 3 // respuestas correctas para cargar el poder especial

type Phase = 'question' | 'feedback' | 'won' | 'lost'
interface Hit {
  id: number
  who: 'hero' | 'enemy'
  text: string
}

const vary = (n: number) => Math.max(1, Math.round(n * (0.9 + Math.random() * 0.2)))

function Bar({ value, max, kind }: { value: number; max: number; kind: 'hero' | 'enemy' }) {
  return (
    <div className={`hp hp--${kind}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label="Vida">
      <span style={{ width: `${(Math.max(0, value) / max) * 100}%` }} />
      <small>{Math.max(0, value)} / {max}</small>
    </div>
  )
}

interface BattleProps {
  stage: Stage
  hero: Hero
  initialSave: AdventureSave
  onWin: (stageId: string, heroId: string, stars: number) => Promise<string | null>
  onRestart: () => void
}

function Battle({ stage, hero, initialSave, onWin, onRestart }: BattleProps) {
  const record = useRecordGame()
  // Avance al empezar el combate (para saber qué se desbloquea al ganar)
  const [save] = useState(initialSave)
  const [saveError, setSaveError] = useState('')
  const stats = heroStats(hero, save.heroXp[hero.id] ?? 0, heroUpgrades(save, hero.id))
  const sameArea = stage.area === hero.area

  const [phase, setPhase] = useState<Phase>('question')
  const [heroHp, setHeroHp] = useState(stats.hp)
  const [enemyHp, setEnemyHp] = useState(stage.enemy.hp)
  const [question, setQuestion] = useState<BattleQuestion>(() => makeQuestion(stage.area, stage.tier))
  const [selected, setSelected] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(SECONDS)
  const [charge, setCharge] = useState(0)
  const [shield, setShield] = useState(false)
  const [message, setMessage] = useState(`¡Un ${stage.enemy.name} salvaje aparece!`)
  const [hit, setHit] = useState<Hit | null>(null)
  const [tally, setTally] = useState({ correct: 0, answered: 0 })
  const [reward, setReward] = useState({ stars: 0, heroXp: 0, xp: 0, coins: 0, levelUp: false })
  // Copias inmediatas de la vida y los aciertos (los temporizadores leen valores viejos del estado)
  const hp = useRef({ hero: stats.hp, enemy: stage.enemy.hp })
  const score = useRef({ correct: 0, answered: 0 })
  const done = useRef(false)

  function setLife(heroLife: number, enemyLife: number) {
    hp.current = { hero: heroLife, enemy: enemyLife }
    setHeroHp(heroLife)
    setEnemyHp(enemyLife)
  }

  // Reloj de cada ejercicio
  useEffect(() => {
    if (phase !== 'question') return
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [phase, question])

  useEffect(() => {
    if (phase === 'question' && timeLeft === 0) answer(-1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase])

  function strike(who: Hit['who'], text: string) {
    setHit({ id: Date.now(), who, text })
  }

  function answer(index: number) {
    if (phase !== 'question') return
    setSelected(index)
    score.current = {
      correct: score.current.correct + (index === question.answerIndex ? 1 : 0),
      answered: score.current.answered + 1,
    }
    setTally(score.current)
    if (index === question.answerIndex) {
      const crit = SECONDS - timeLeft < FAST
      const damage = vary(stats.attack * (sameArea ? 1.25 : 1) * (crit ? 1.4 : 1))
      setLife(hp.current.hero, hp.current.enemy - damage)
      setCharge((c) => Math.min(CHARGE, c + 1))
      strike('enemy', `-${damage}`)
      setMessage(`${crit ? '¡Golpe crítico! ' : '¡Correcto! '}${hero.name} hace ${damage} de daño.`)
      setPhase('feedback')
      setTimeout(next, 1100)
    } else {
      if (shield) {
        setShield(false)
        strike('hero', '🛡️')
        setMessage(`${index === -1 ? '¡Se acabó el tiempo! ' : ''}El muro de ${hero.name} bloquea el ataque.`)
      } else {
        const damage = vary(stage.enemy.attack)
        setLife(hp.current.hero - damage, hp.current.enemy)
        strike('hero', `-${damage}`)
        setMessage(`${index === -1 ? '¡Se acabó el tiempo! ' : ''}${stage.enemy.name} ataca y hace ${damage} de daño.`)
      }
      setPhase('feedback')
    }
  }

  function castSpecial() {
    if (phase !== 'question' || charge < CHARGE) return
    setCharge(0)
    const kind = hero.special.kind
    // Tiro de suerte: un dado decide si hace x2, x2.5, x3, x3.5 o x4
    const luck = 2 + 0.5 * Math.floor(Math.random() * 5)
    const damage = vary(stats.attack * (kind === 'blast' ? 3 : kind === 'luck' ? luck : 1.5))
    const healed = kind === 'heal' ? Math.min(stats.hp, hp.current.hero + Math.round(stats.hp / 3)) : hp.current.hero
    setLife(healed, hp.current.enemy - damage)
    strike('enemy', `-${damage}`)
    if (kind === 'shield') setShield(true)
    setMessage(kind === 'luck' ? `🎲 ¡${hero.special.name}! Salió x${luck}: ${damage} de daño.` : `✨ ¡${hero.special.name}! ${hero.special.description}`)
    setPhase('feedback')
    setTimeout(next, 1300)
  }

  // Pasa al siguiente ejercicio o termina el combate (lee la vida más reciente)
  function next() {
    if (done.current) return
    if (hp.current.enemy <= 0) finish(true, hp.current.hero)
    else if (hp.current.hero <= 0) finish(false, hp.current.hero)
    else {
      setQuestion(makeQuestion(stage.area, stage.tier))
      setSelected(null)
      setTimeLeft(SECONDS)
      setPhase('question')
    }
  }

  function finish(won: boolean, hpLeft: number) {
    done.current = true
    setPhase(won ? 'won' : 'lost')
    if (!won) return
    const ratio = hpLeft / stats.hp
    const stars = ratio >= 0.7 ? 3 : ratio >= 0.35 ? 2 : 1
    const heroXp = 15 * stage.tier + 5 * stars
    const coins = coinReward(stage.tier, stars)
    const before = save.heroXp[hero.id] ?? 0
    onWin(stage.id, hero.id, stars).then((message) => setSaveError(message ?? ''))
    const { correct, answered } = score.current
    const xp = Math.min(200, 5 * correct + 10 * stars)
    setReward({ stars, heroXp, xp, coins, levelUp: heroLevel(before + heroXp) > heroLevel(before) })
    record(`aventura:${stage.id}`, correct, Math.max(1, answered), xp)
  }

  // ¿Se desbloqueó un héroe con esta victoria?
  const newHero = phase === 'won' ? heroes.find((h) => h.unlockAfter === stage.id && !isHeroUnlocked(h, save)) : undefined
  const nextStage = stages[stages.findIndex((s) => s.id === stage.id) + 1]

  if (phase === 'won' || phase === 'lost') {
    const won = phase === 'won'
    return (
      <section className="adventure stack narrow center">
        <span className="adv-result__icon" aria-hidden="true">{won ? <HeroArt id={hero.id} label={hero.name} size={130} /> : <EnemyArt stageId={stage.id} label={stage.enemy.name} size={130} />}</span>
        <h1>{won ? '¡Victoria!' : 'Derrota…'}</h1>
        {won ? (
          <>
            <div className="stars" aria-label={`${reward.stars} de 3 estrellas`}>
              {[1, 2, 3].map((n) => <span key={n} className={n <= reward.stars ? 'star star--on' : 'star'}>★</span>)}
            </div>
            <p>
              {tally.correct} de {tally.answered} ejercicios correctos · +{reward.xp} XP · {hero.name} gana +{reward.heroXp} XP de héroe · +{reward.coins} 🪙
            </p>
            {reward.levelUp && <p className="adv-banner">⬆️ ¡{hero.name} subió de nivel! Ahora tiene más vida y ataque.</p>}
            {saveError && <p className="auth__error" role="alert">{saveError}</p>}
            {newHero && <p className="adv-banner adv-banner--hero"><HeroArt id={newHero.id} label={newHero.name} size={48} /> ¡Nuevo héroe: {newHero.name}, {newHero.title}!</p>}
          </>
        ) : (
          <p>{stage.enemy.name} ganó esta vez. Repasa los ejercicios y vuelve a intentarlo: cada combate trae ejercicios nuevos.</p>
        )}
        {won && nextStage && stage.boss !== true && (
          <Link to={`/aventura/batalla/${nextStage.id}?heroe=${hero.id}`} className="btn btn--yellow">
            Siguiente etapa: {nextStage.name}
          </Link>
        )}
        <button className="btn" onClick={onRestart}>{won ? 'Jugar otra vez' : 'Reintentar'}</button>
        <Link to="/aventura" className="btn btn--ghost">Volver al mapa</Link>
      </section>
    )
  }

  const answered = phase === 'feedback'
  return (
    <section className="adventure battle stack narrow">
      <div className="battle__top">
        <Link to="/aventura" className="quiz-close" aria-label="Salir del combate">✕</Link>
        <strong>{stage.name}</strong>
        <span className="battle__timer" aria-label={`Quedan ${timeLeft} segundos`}>⏱️ {timeLeft}</span>
      </div>
      <div className="adv-bar adv-bar--time"><span style={{ width: `${(timeLeft / SECONDS) * 100}%` }} /></div>

      <div className="arena">
        <div className={`fighter fighter--enemy ${hit?.who === 'enemy' ? 'fighter--hit' : ''}`} key={`e-${hit?.who === 'enemy' ? hit.id : 0}`}>
          <span className="fighter__icon" aria-hidden="true"><EnemyArt stageId={stage.id} label={stage.enemy.name} size={96} /></span>
          <strong>{stage.enemy.name}</strong>
          <Bar value={enemyHp} max={stage.enemy.hp} kind="enemy" />
          {hit?.who === 'enemy' && <span className="damage" key={hit.id}>{hit.text}</span>}
        </div>
        <div className={`fighter fighter--hero ${hit?.who === 'hero' ? 'fighter--hit' : ''}`} key={`h-${hit?.who === 'hero' ? hit.id : 0}`}>
          <span className="fighter__icon" aria-hidden="true"><HeroArt id={hero.id} label={hero.name} size={96} />{shield && <span className="fighter__shield">🛡️</span>}</span>
          <strong>{hero.name} · Nv. {heroLevel(save.heroXp[hero.id] ?? 0)}</strong>
          <Bar value={heroHp} max={stats.hp} kind="hero" />
          {hit?.who === 'hero' && <span className="damage damage--hero" key={hit.id}>{hit.text}</span>}
        </div>
      </div>

      <p className="battle__message" aria-live="polite">{message}</p>

      <div className="card battle__question">
        <h2><MathText text={question.text} /></h2>
        <div className="options">
          {question.options.map((opt, i) => {
            let cls = 'option'
            if (answered && i === question.answerIndex) cls += ' option--correct'
            else if (answered && i === selected) cls += ' option--wrong'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => answer(i)}>
                <span className="option__letter">{letters[i]}</span>
                <MathText text={opt} />
              </button>
            )
          })}
        </div>
        {answered && selected !== question.answerIndex && selected !== null && (
          <>
            <p className="feedback feedback--bad">Solución: <MathText text={question.explanation} /></p>
            <button className="btn" onClick={next}>Continuar</button>
          </>
        )}
      </div>

      <button className="btn btn--yellow special-btn" disabled={charge < CHARGE || answered} onClick={castSpecial}>
        ✨ {hero.special.name} {charge < CHARGE ? `(${charge}/${CHARGE})` : '¡Listo!'}
      </button>
    </section>
  )
}

// /aventura/batalla/:stageId?heroe=numeron
export default function BattlePage() {
  const { stageId } = useParams()
  const [params] = useSearchParams()
  const { save, win } = useAdventure()
  const [round, setRound] = useState(0)
  if (!save) return <p className="muted center">Cargando tu aventura…</p>
  const index = stages.findIndex((s) => s.id === stageId)
  const stage = stages[index]
  const chosen = heroes.find((h) => h.id === params.get('heroe'))
  const hero = chosen && isHeroUnlocked(chosen, save) ? chosen : heroes[0]

  if (!stage || !isStageUnlocked(index, save)) {
    return (
      <section className="adventure stack narrow center">
        <p>Esa etapa todavía está cerrada. Gana las anteriores para llegar a ella.</p>
        <Link to="/aventura" className="btn btn--yellow">Volver al mapa</Link>
      </section>
    )
  }
  return <Battle key={`${stage.id}-${hero.id}-${round}`} stage={stage} hero={hero} initialSave={save} onWin={win} onRestart={() => setRound((r) => r + 1)} />
}
