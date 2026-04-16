export const AGE_GROUPS = [
  {
    id: '6-8',
    label: '6-8 años',
    rounds: [
      { type: 'word', p1: 'Consigue que diga: helado', p2: 'Consigue que diga: playa' },
      { type: 'action', p1: 'Consigue que mire al techo', p2: 'Consigue que se toque la nariz' },
      { type: 'topic', p1: 'Llévalo a hablar de animales sin decir “animal”', p2: 'Llévala a hablar del cole sin decir “cole”' },
      { type: 'word', p1: 'Consigue que diga: pijama', p2: 'Consigue que diga: galleta' },
      { type: 'action', p1: 'Consigue que se levante un momento', p2: 'Consigue que se ría' },
      { type: 'topic', p1: 'Haz que pregunte “por qué”', p2: 'Haz que diga una comida que le encanta' },
      { type: 'word', p1: 'Consigue que diga: dinosaurio', p2: 'Consigue que diga: cumpleaños' },
      { type: 'action', p1: 'Consigue que aplauda una vez', p2: 'Consigue que enseñe un dedo' },
    ],
  },
  {
    id: '9-12',
    label: '9-12 años',
    rounds: [
      { type: 'word', p1: 'Consigue que diga: videojuego', p2: 'Consigue que diga: pizza' },
      { type: 'action', p1: 'Consigue que se cruce de brazos', p2: 'Consigue que mire la puerta' },
      { type: 'topic', p1: 'Haz que termine hablando de vacaciones', p2: 'Haz que termine hablando de un profe' },
      { type: 'word', p1: 'Consigue que diga: mochila', p2: 'Consigue que diga: secreto' },
      { type: 'action', p1: 'Consigue que te haga una pregunta', p2: 'Consigue que diga tu nombre' },
      { type: 'topic', p1: 'Llévalo a hablar de una peli', p2: 'Llévala a hablar de deportes' },
      { type: 'word', p1: 'Consigue que diga: dragón', p2: 'Consigue que diga: examen' },
      { type: 'action', p1: 'Consigue que sonría sin reírse', p2: 'Consigue que diga “en serio?”' },
    ],
  },
  {
    id: 'family',
    label: 'Familiar',
    rounds: [
      { type: 'word', p1: 'Consigue que diga: café', p2: 'Consigue que diga: sofá' },
      { type: 'action', p1: 'Consigue que mire el móvil', p2: 'Consigue que mire por la ventana' },
      { type: 'topic', p1: 'Haz que hable de un viaje', p2: 'Haz que hable de una comida favorita' },
      { type: 'word', p1: 'Consigue que diga: domingo', p2: 'Consigue que diga: regalo' },
      { type: 'action', p1: 'Consigue que diga “vale” dos veces', p2: 'Consigue que se encoga de hombros' },
      { type: 'topic', p1: 'Llévalo a hablar de música', p2: 'Llévala a hablar de una manía' },
      { type: 'word', p1: 'Consigue que diga: verano', p2: 'Consigue que diga: sorpresa' },
      { type: 'action', p1: 'Consigue que haga una pausa larga', p2: 'Consigue que cambie de tema' },
    ],
  },
]

export const MODE_LABELS = {
  word: 'Palabra',
  action: 'Acción',
  topic: 'Tema',
}

export const TURN_SECONDS = 75
