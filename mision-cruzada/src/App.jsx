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
  const [ageId, setAgeId] = useState('family')
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

  const confirmResults = () => {
    setScores((prev) => ({
      p1: prev.p1 + (wins.p1 ? 1 : 0),
      p2: prev.p2 + (wins.p2 ? 1 : 0),
    }))
  }

  const nextRound = () => {
    confirmResults()
    startRound()
  }

  const finishRound = () => {
    confirmResults()
    setPhase(PHASES.setup)
    setRound(null)
    setSecondsLeft(TURN_SECONDS)
    setWins({ p1: false, p2: false })
  }

  return (
    <main className="app-shell">
      <section className="card">
        <header className="header">
          <div>
            <p className="eyebrow">Misión Cruzada</p>
            <h1>Juego para 2, fuera de la pantalla</h1>
          </div>
          <div className="scoreboard">
            <span>J1 {scores.p1}</span>
            <span>J2 {scores.p2}</span>
          </div>
        </header>

        {phase === PHASES.setup && (
          <>
            <p className="lead">
              El móvil solo reparte misiones. Luego se juega hablando, riendo y picándose cara a cara.
            </p>

            <div className="selector">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={group.id === ageId ? 'chip active' : 'chip'}
                  onClick={() => setAgeId(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <div className="info-grid">
              <article>
                <h2>Cómo va</h2>
                <ul>
                  <li>Jugador 1 ve su misión</li>
                  <li>Pasa el móvil al Jugador 2</li>
                  <li>Jugáis 75 segundos sin mirar la pantalla</li>
                  <li>Al final marcáis quién cumplió</li>
                </ul>
              </article>
              <article>
                <h2>Modo actual</h2>
                <p>{currentAge?.label}</p>
                <p>Rondas guardadas: {usedRounds.length}</p>
              </article>
            </div>

            <div className="actions">
              <button type="button" className="primary" onClick={startRound}>
                Empezar ronda
              </button>
              <button type="button" className="secondary" onClick={resetGame}>
                Reiniciar partida
              </button>
            </div>
          </>
        )}

        {round && phase === PHASES.reveal1 && (
          <RevealCard
            player="Jugador 1"
            type={MODE_LABELS[round.type]}
            mission={round.p1}
            onContinue={() => setPhase(PHASES.handoff1)}
          />
        )}

        {round && phase === PHASES.handoff1 && (
          <HandoffCard
            title="Pásale el móvil al Jugador 2"
            subtitle="Que no mire la misión anterior. Esto es parte del show."
            onContinue={() => setPhase(PHASES.reveal2)}
          />
        )}

        {round && phase === PHASES.reveal2 && (
          <RevealCard
            player="Jugador 2"
            type={MODE_LABELS[round.type]}
            mission={round.p2}
            onContinue={() => {
              setSecondsLeft(TURN_SECONDS)
              setPhase(PHASES.countdown)
            }}
          />
        )}

        {round && phase === PHASES.countdown && (
          <section className="phase-card countdown">
            <p className="eyebrow">Ronda en marcha</p>
            <h2>{secondsLeft}s</h2>
            <p className="lead small">Guardad el móvil y jugad fuera de pantalla.</p>
            <button type="button" className="secondary" onClick={() => setPhase(PHASES.result)}>
              Terminar antes
            </button>
          </section>
        )}

        {round && phase === PHASES.result && (
          <section className="phase-card">
            <p className="eyebrow">Resolución</p>
            <h2>¿Quién cumplió su misión?</h2>

            <div className="result-grid">
              <label className={wins.p1 ? 'result-box win' : 'result-box'}>
                <input
                  type="checkbox"
                  checked={wins.p1}
                  onChange={() => setWins((prev) => ({ ...prev, p1: !prev.p1 }))}
                />
                <span>Jugador 1</span>
                <strong>{round.p1}</strong>
              </label>

              <label className={wins.p2 ? 'result-box win' : 'result-box'}>
                <input
                  type="checkbox"
                  checked={wins.p2}
                  onChange={() => setWins((prev) => ({ ...prev, p2: !prev.p2 }))}
                />
                <span>Jugador 2</span>
                <strong>{round.p2}</strong>
              </label>
            </div>

            <div className="actions">
              <button type="button" className="primary" onClick={nextRound}>
                Siguiente ronda
              </button>
              <button type="button" className="secondary" onClick={finishRound}>
                Guardar y volver
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

function RevealCard({ player, type, mission, onContinue }) {
  const [visible, setVisible] = useState(false)

  return (
    <section className="phase-card">
      <p className="eyebrow">{player}</p>
      <h2>Tu misión secreta</h2>
      <p className="badge">{type}</p>

      {!visible ? (
        <button type="button" className="primary" onClick={() => setVisible(true)}>
          Mostrar misión
        </button>
      ) : (
        <>
          <div className="mission-box">{mission}</div>
          <button type="button" className="secondary" onClick={onContinue}>
            Ya la vi
          </button>
        </>
      )}
    </section>
  )
}

function HandoffCard({ title, subtitle, onContinue }) {
  return (
    <section className="phase-card handoff">
      <p className="eyebrow">Cambio de jugador</p>
      <h2>{title}</h2>
      <p className="lead small">{subtitle}</p>
      <button type="button" className="primary" onClick={onContinue}>
        Seguir
      </button>
    </section>
  )
}

export default App
