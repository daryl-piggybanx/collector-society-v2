export type NewsItem = {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  slug: string
}

export type GameMode = {
  id: string
  name: string
  description: string
  image: string
  playerCount: string
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary"
}

export type Expansion = {
  id: string
  name: string
  subtitle: string
  description: string
  image: string
  releaseDate: string
  price: string
  features: string[]
}

export type Guardian = {
  id: string
  className: string
  description: string
  image: string
  abilities: string[]
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "The Final Shape: A New Chapter Begins",
    excerpt:
      "Experience the epic conclusion to the Light and Darkness saga in Destiny 2's most ambitious expansion yet.",
    image: "/assets/astro-boy_banner.png",
    date: "2024-06-04",
    category: "Expansion",
    slug: "final-shape-new-chapter",
  },
  {
    id: "2",
    title: "Season of the Wish Now Live",
    excerpt: "Make a wish and face the consequences. New activities, weapons, and story content await.",
    image: "/assets/astro-boy_banner.png",
    date: "2024-11-28",
    category: "Season",
    slug: "season-of-the-wish",
  },
  {
    id: "3",
    title: "Trials of Osiris Returns This Weekend",
    excerpt: "Test your skills in Destiny 2's premier PvP endgame activity. Flawless rewards await the worthy.",
    image: "/assets/astro-boy_banner.png",
    date: "2024-12-15",
    category: "PvP",
    slug: "trials-of-osiris-weekend",
  },
]

export const gameModes: GameMode[] = [
  {
    id: "1",
    name: "Raids",
    description: "Six-player cooperative challenges that test teamwork, communication, and skill.",
    image: "/assets/astro-boy_banner.png",
    playerCount: "6 Players",
    difficulty: "Legendary",
  },
  {
    id: "2",
    name: "Crucible",
    description: "Competitive multiplayer where Guardians test their might against one another.",
    image: "/assets/astro-boy_banner.png",
    playerCount: "6v6 / 3v3",
    difficulty: "Medium",
  },
  {
    id: "3",
    name: "Strikes",
    description: "Three-player cooperative missions featuring unique bosses and mechanics.",
    image: "/assets/astro-boy_banner.png",
    playerCount: "3 Players",
    difficulty: "Easy",
  },
  {
    id: "4",
    name: "Gambit",
    description: "A unique blend of PvE and PvP where teams race to defeat enemies and invade.",
    image: "/assets/astro-boy_banner.png",
    playerCount: "4v4",
    difficulty: "Medium",
  },
]

export const expansions: Expansion[] = [
  {
    id: "1",
    name: "The Final Shape",
    subtitle: "The Light and Darkness Saga Concludes",
    description:
      "Journey into the heart of the Traveler and face the Witness in the ultimate battle between Light and Darkness.",
    image: "/assets/astro-boy_banner.png",
    releaseDate: "June 4, 2024",
    price: "$49.99",
    features: [
      "New Destination: The Pale Heart",
      "Prismatic Subclass",
      "New Exotic Weapons & Armor",
      "Raid: Salvation's Edge",
    ],
  },
  {
    id: "2",
    name: "Lightfall",
    subtitle: "Darkness Falls. Heroes Rise.",
    description: "Travel to Neptune and discover the neon-soaked city of Neomuna as you learn to wield Strand.",
    image: "/assets/astro-boy_banner.png",
    releaseDate: "February 28, 2023",
    price: "$49.99",
    features: ["New Destination: Neomuna", "Strand Subclass", "Legendary Campaign", "Raid: Root of Nightmares"],
  },
]

export const guardianClasses: Guardian[] = [
  {
    id: "1",
    className: "Titan",
    description: "Stalwart defenders who stand as an unbreakable wall between the Light and the Darkness.",
    image: "/assets/astro-boy_banner.png",
    abilities: ["Ward of Dawn", "Thundercrash", "Burning Maul", "Sentinel Shield"],
  },
  {
    id: "2",
    className: "Hunter",
    description: "Agile scouts who strike from the shadows with precision and deadly efficiency.",
    image: "/assets/astro-boy_banner.png",
    abilities: ["Golden Gun", "Shadowshot", "Arc Staff", "Spectral Blades"],
  },
  {
    id: "3",
    className: "Warlock",
    description: "Scholars of the Light who bend reality to their will through ancient knowledge.",
    image: "/assets/astro-boy_banner.png",
    abilities: ["Nova Bomb", "Well of Radiance", "Stormtrance", "Winter's Wrath"],
  },
]
