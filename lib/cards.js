// Datos de prueba de cartas Pokémon
export const pokemonCards = [
  {
    slug: 'charizard',
    name: 'Charizard',
    hp: 90,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    description: 'Escupe fuego que es lo suficientemente caliente como para derretir rocas. Puede causar incendios forestales soplando llamas.',
    type: 'Fuego/Volador',
    attacks: [
      { name: 'Lanzallamas', damage: 90 },
      { name: 'Garra Dragón', damage: 100 }
    ]
  },
  {
    slug: 'blastoise',
    name: 'Blastoise',
    hp: 85,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    description: 'Los cañones de agua en su caparazón son muy precisos. Pueden disparar balas de agua lo suficientemente precisas como para golpear latas vacías a más de 160 pies.',
    type: 'Agua',
    attacks: [
      { name: 'Hidrobomba', damage: 80 },
      { name: 'Pistola Agua', damage: 40 }
    ]
  },
  {
    slug: 'venusaur',
    name: 'Venusaur',
    hp: 88,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    description: 'Después de una lluvia, el aroma de la flor es más fuerte. El aroma atrae a otros Pokémon.',
    type: 'Planta/Veneno',
    attacks: [
      { name: 'Rayo Solar', damage: 85 },
      { name: 'Látigo Cepa', damage: 45 }
    ]
  },
  {
    slug: 'pikachu',
    name: 'Pikachu',
    hp: 65,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    description: 'Cuando varios de estos Pokémon se juntan, su electricidad puede acumularse y causar tormentas eléctricas.',
    type: 'Eléctrico',
    attacks: [
      { name: 'Rayo', damage: 70 },
      { name: 'Impactrueno', damage: 40 }
    ]
  },
  {
    slug: 'mewtwo',
    name: 'Mewtwo',
    hp: 95,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    description: 'Fue creado por un científico después de años de experimentos de ingeniería genética horribles.',
    type: 'Psíquico',
    attacks: [
      { name: 'Psíquico', damage: 95 },
      { name: 'Psicorte', damage: 70 }
    ]
  },
  {
    slug: 'gyarados',
    name: 'Gyarados',
    hp: 92,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
    description: 'Raramente se ve en estado salvaje. Muy feroz, destruirá todo a su paso.',
    type: 'Agua/Volador',
    attacks: [
      { name: 'Hidrobomba', damage: 90 },
      { name: 'Hiper Rayo', damage: 100 }
    ]
  }
];

export async function getLatestCards() {
  // Simular una llamada API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pokemonCards);
    }, 500);
  });
}

export async function getCardDetails(slug) {
  // Simular una llamada API para obtener detalles
  return new Promise((resolve) => {
    setTimeout(() => {
      const card = pokemonCards.find(c => c.slug === slug);
      resolve(card);
    }, 300);
  });
}
