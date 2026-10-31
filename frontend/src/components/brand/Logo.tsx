import Mascot from './Mascot'

export default function Logo() {
  return (
    <span className="logo">
      <Mascot size={36} />
      <span className="logo__text">
        Open<span className="logo__accent">Academy</span>
      </span>
    </span>
  )
}
