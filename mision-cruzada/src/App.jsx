import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AGE_GROUPS, MODE_LABELS, TURN_SECONDS } from './data'

const PHASES = {
  setup: 'setup',
  reveal1: 'reveal1',
  handoff1: 'handoff1',
  reveal2: 'reveal2',
  countdown: 'countdown',
  result: 'result',
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

function pickRound(ageId, usedRounds) {
  const group = AGE_GROUPS.find((item) => item.id === ageId)
  if (!group) return null
  const available = group.rounds.filter((round) => !usedRounds.includes(`${round.type}:${round.p1}:${round.p2}`))
  const pool = available.length ? available : group.rounds
  return shuffle(pool)[0]
}

function App() {
  const [ageId, setAgeId] = useState('6-8')
  const [phase, setPhase] = useState(PHASES.setup)
  const [round, setRound] = useState(null)
  const [usedRounds, setUsedRounds] = useState([])
  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })
  const [wins, setWins] = useState({ p1: false, p2: false })

  const currentAge = useMemo(() => AGE_GROUPS.find((item) => item.id === ageId), [ageId])

  useEffect(() => {
    if (phase !== PHASES.countdown) return undefined
    if (secondsLeft <= 0) {
      setPhase(PHASES.result)
      return undefined
    }
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [phase, secondsLeft])

  const startRound = () => {
    const nextRound = pickRound(ageId, usedRounds)
    if (!nextRound) return
    const signature = `${nextRound.type}:${nextRound.p1}:${nextRound.p2}`
    setRound(nextRound)
    setUsedRounds((list) => [...list, signature])
    setWins({ p1: false, p2: false })
    setSecondsLeft(TURN_SECONDS)
    setPhase(PHASES.reveal1)
  }

  const resetGame = () => {
    setPhase(PHASES.setup)
    setRound(null)
    setUsedRounds([])
    setScores({ p1: 0, p2: 0 })
    setWins({ p1: false, p2: false })
    setSecondsLeft(TURN_SECONDS)
  }

  const saveScore = () => {
    setScores((prev) => ({
      p1: prev.p1 + (wins.p1 ? 1 : 0),
      p2: prev.p2 + (wins.p2 ? 1 : 0),
    }))
  }

  const nextRound = () => {
    saveScore()
    startRound()
  }

  const finishRound = () => {
    saveScore()
    setPhase(PHASES.setup)
    setRound(null)
    setSecondsLeft(TURN_SECONDS)
    setWins({ p1: false, p2: false })
  }

  return (
    <main className="app-shell">
      <div className="background-deco background-deco-left">☁️</div>
      <div className="background-deco background-deco-right">⭐</div>

      <section className="card">
        <header className="header kid">
          <div className="brand-row">
            <div className="brand-badge">🎈</div>
            <div>
              <p className="eyebrow">Misión Cruzada</p>
              <h1>¡A jugar!</h1>
              <p className="subtitle">Dos peques, un móvil, mucha risa.</p>
            </div>
          </div>

          <div className="scoreboard bubble">
            <span>🦊 {scores.p1}</span>
            <span>🐼 {scores.p2}</span>
          </div>
        </header>

        {phase === PHASES.setup && (
          <>
            <section className="hero-stage">
              <div className="hero-scene">
                <div className="hero-face one">🦊</div>
                <div className="hero-face two">🐼</div>
                <div className="hero-star">✨</div>
              </div>
              <div className="hero-copy">
                <h2>Misiones secretas</h2>
                <p>Mira tu misión, pasa el móvil y juega hablando.</p>
              </div>
            </section>

            <div className="selector selector-kids">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={group.id === ageId ? 'chip active' : 'chip'}
                  onClick={() => setAgeId(group.id)}
                >
                  <span className="chip-emoji">{group.emoji}</span>
                  <span>{group.label}</span>
                </button>
              ))}
            </div>

            <div className="mini-cards">
              <div className="mini-card pink">
                <div className="mini-icon">👀</div>
                <strong>Mira</strong>
              </div>
              <div className="mini-card blue">
                <div className="mini-icon">📱</div>
                <strong>Pasa</strong>
              </div>
              <div className="mini-card yellow">
                <div className="mini-icon">🗣️</div>
                <strong>Habla</strong>
              </div>
              <div className="mini-card green">
                <div className="mini-icon">🏆</div>
                <strong>Gana</strong>
              </div>
            </div>

            <div className="actions stack">
              <button type="button" className="primary big" onClick={startRound}>
                Empezar
              </button>
              <button type="button" className="secondary soft" onClick={resetGame}>
                Reiniciar
              </button>
            </div>
          </>
        )}

        {round && phase === PHASES.reveal1 && (
          <RevealCard
            player="Jugador 1"
            mascot="🦊"
            type={MODE_LABELS[round.type]}
            mission={round.p1}
            onContinue={() => setPhase(PHASES.handoff1)}
          />
        )}

        {round && phase === PHASES.handoff1 && (
          <HandoffCard title="Pásalo" subtitle="Ahora mira el jugador 2" onContinue={() => setPhase(PHASES.reveal2)} />
        )}

        {round && phase === PHASES.reveal2 && (
          <RevealCard
            player="Jugador 2"
            mascot="🐼"
            type={MODE_LABELS[round.type]}
            mission={round.p2}
            onContinue={() => {
              setSecondsLeft(TURN_SECONDS)
              setPhase(PHASES.countdown)
            }}
          />
        )}

        {round && phase === PHASES.countdown && (
          <section className="phase-card countdown playful sky">
            <p className="eyebrow">⏰ Tiempo</p>
            <div className="timer-ring">
              <h2 className="timer">{secondsLeft}</h2>
            </div>
            <p className="lead small">Guardad el móvil y jugad.</p>
            <button type="button" className="secondary soft" onClick={() => setPhase(PHASES.result)}>
              Terminar
            </button>
          </section>
        )}

        {round && phase === PHASES.result && (
          <section className="phase-card playful finish">
            <p className="eyebrow">🏁 Final</p>
            <h2>¿Quién lo logró?</h2>

            <div className="result-grid kid-results">
              <label className={wins.p1 ? 'result-box win' : 'result-box'}>
                <input type="checkbox" checked={wins.p1} onChange={() => setWins((prev) => ({ ...prev, p1: !prev.p1 }))} />
                <span>🦊 Jugador 1</span>
                <strong>{round.p1}</strong>
              </label>

              <label className={wins.p2 ? 'result-box win' : 'result-box'}>
                <input type="checkbox" checked={wins.p2} onChange={() => setWins((prev) => ({ ...prev, p2: !prev.p2 }))} />
                <span>🐼 Jugador 2</span>
                <strong>{round.p2}</strong>
              </label>
            </div>

            <div className="actions stack">
              <button type="button" className="primary big" onClick={nextRound}>
                Otra ronda
              </button>
              <button type="button" className="secondary soft" onClick={finishRound}>
                Volver
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

function RevealCard({ player, mascot, type, mission, onContinue }) {
  const [visible, setVisible] = useState(false)

  return (
    <section className="phase-card playful reveal-card">
      <div className="mascot-big">{mascot}</div>
      <p className="eyebrow">{player}</p>
      <h2>Tu misión</h2>
      <p className="badge">{type}</p>

      {!visible ? (
        <button type="button" className="primary big" onClick={() => setVisible(true)}>
          Ver misión
        </button>
      ) : (
        <>
          <div className="mission-box kid">{mission}</div>
          <button type="button" className="secondary soft" onClick={onContinue}>
            Ya está
          </button>
        </>
      )}
    </section>
  )
}

function HandoffCard({ title, subtitle, onContinue }) {
  return (
    <section className="phase-card handoff playful pass-card">
      <div className="pass-emoji">📲</div>
      <p className="eyebrow">Cambio</p>
      <h2>{title}</h2>
      <p className="lead small">{subtitle}</p>
      <button type="button" className="primary big" onClick={onContinue}>
        Seguir
      </button>
    </section>
  )
}

export default App
