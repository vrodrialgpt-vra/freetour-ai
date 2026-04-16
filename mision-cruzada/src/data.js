export const AGE_GROUPS = [
  {
    id: '6-8',
    label: 'Peques',
    emoji: '🌈',
    rounds: [
      { type: 'word', p1: 'Haz que diga: helado', p2: 'Haz que diga: playa' },
      { type: 'action', p1: 'Haz que mire arriba', p2: 'Haz que se toque la nariz' },
      { type: 'topic', p1: 'Habla de animales', p2: 'Habla del cole' },
      { type: 'word', p1: 'Haz que diga: pijama', p2: 'Haz que diga: galleta' },
      { type: 'action', p1: 'Haz que se levante', p2: 'Haz que se ría' },
      { type: 'topic', p1: 'Haz que pregunte: ¿por qué?', p2: 'Haz que diga una comida rica' },
      { type: 'word', p1: 'Haz que diga: dinosaurio', p2: 'Haz que diga: cumpleaños' },
      { type: 'action', p1: 'Haz que aplauda', p2: 'Haz que enseñe un dedo' },
    ],
  },
  {
    id: '9-12',
    label: 'Mayores',
    emoji: '🚀',
    rounds: [
      { type: 'word', p1: 'Haz que diga: videojuego', p2: 'Haz que diga: pizza' },
      { type: 'action', p1: 'Haz que cruce los brazos', p2: 'Haz que mire la puerta' },
      { type: 'topic', p1: 'Habla de vacaciones', p2: 'Habla de un profe' },
      { type: 'word', p1: 'Haz que diga: mochila', p2: 'Haz que diga: secreto' },
      { type: 'action', p1: 'Haz que te pregunte algo', p2: 'Haz que diga tu nombre' },
      { type: 'topic', p1: 'Habla de una peli', p2: 'Habla de deporte' },
      { type: 'word', p1: 'Haz que diga: dragón', p2: 'Haz que diga: examen' },
      { type: 'action', p1: 'Haz que sonría', p2: 'Haz que diga: ¿en serio?' },
    ],
  },
  {
    id: 'family',
    label: 'Familia',
    emoji: '🎉',
    rounds: [
      { type: 'word', p1: 'Haz que diga: café', p2: 'Haz que diga: sofá' },
      { type: 'action', p1: 'Haz que mire el móvil', p2: 'Haz que mire la ventana' },
      { type: 'topic', p1: 'Habla de un viaje', p2: 'Habla de una comida favorita' },
      { type: 'word', p1: 'Haz que diga: domingo', p2: 'Haz que diga: regalo' },
      { type: 'action', p1: 'Haz que diga vale dos veces', p2: 'Haz que encoja los hombros' },
      { type: 'topic', p1: 'Habla de música', p2: 'Habla de una manía' },
      { type: 'word', p1: 'Haz que diga: verano', p2: 'Haz que diga: sorpresa' },
      { type: 'action', p1: 'Haz que pare un momento', p2: 'Haz que cambie de tema' },
    ],
  },
]

export const MODE_LABELS = {
  word: 'Palabra',
  action: 'Acción',
  topic: 'Tema',
}

export const TURN_SECONDS = 60
