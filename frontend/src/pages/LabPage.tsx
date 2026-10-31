import { Link } from 'react-router-dom'

const materials = [
  {
    to: '/laboratorio/balanza',
    title: 'Balanza de ecuaciones',
    text: 'Quita lo mismo en ambos lados hasta descubrir cuánto vale x.',
    icon: '⚖️',
    color: 'green',
    level: 'Álgebra',
  },
  {
    to: '/laboratorio/fracciones',
    title: 'Tiras de fracciones',
    text: 'Junta y compara tiras de 1/2, 1/3, 1/4… para sumar y encontrar equivalencias.',
    icon: '🍫',
    color: 'pink',
    level: 'Fracciones',
  },
  {
    to: '/laboratorio/geoplano',
    title: 'Geoplano',
    text: 'Estira ligas para formar polígonos y medir su área y perímetro.',
    icon: '📌',
    color: 'blue',
    level: 'Geometría',
  },
]

export default function LabPage() {
  return (
    <section className="stack">
      <div className="page-head">
        <h1>Laboratorio</h1>
        <p className="muted">Materiales para tocar, mover y descubrir las matemáticas.</p>
      </div>
      <div className="grid">
        {materials.map((m) => {
          const body = (
            <>
              <span className={`game-card__cover tile--${m.color}`}>{m.icon}</span>
              <div className="game-card__body">
                <span className="badge">{m.level}</span>
                <h3>
                  {m.title} {!m.to && <span className="badge badge--gold">Pronto</span>}
                </h3>
                <p className="muted">{m.text}</p>
              </div>
            </>
          )
          return m.to ? (
            <Link key={m.title} to={m.to} className="game-card">{body}</Link>
          ) : (
            <div key={m.title} className="game-card game-card--soon">{body}</div>
          )
        })}
      </div>
    </section>
  )
}
