export const navItems = [
  { name: "Start Here", image: "/assets/landing_hover_black-white_1.jpg", link: "/ethos" },
  { name: "Collector Applications", image: "/assets/landing_hover_black-white_2.jpg", link: "/collector" },
  { name: "Drop Site", image: "/assets/landing_hover_black-white_3.jpg", link: "https://piggybanxinc.com" },
  { name: "PiggyVerse", image: "/assets/landing_hover_black-white_1.jpg", link: "https://intothepiggyverse.com" },
  { name: "The Knights", image: "/assets/landing_hover_black-white_2.jpg", link: "/knights-of-the-roundtable" },
]

// temp data file for collector form
export const collectionRules = [
  "I am here to collect and appreciate the art as well as have a positive impact on the community.",
  "No flipping.",
  "Don't call them cards. These are pieces of art and should be referred to and treated as such.",
  "I will maintain respectful communication with other collectors.",
]

export const wallPieceRules = [
  "Each 1,000% Wall-Piece is priced at $15,000 USD.",
  "Only 1 artwork, per design, will be produced and released at 1,000%; the Studio reserves the right to produce alternate variants (i.e. Black Label) of a given design, in the future.",
  "Artworks with the highest demand will be listed in a private auction for interested collectors.",
]

export const collectionVariations = [
  "Angel Dust",
  "Atomic",
  "Beam",
  "Bubble",
  "Canvas",
  "Chrome",
  "Digit",
  "Disco",
  "Flash",
  "Fractal",
  "Galactic",
  "Glass",
  "Gold",
  "Griddy",
  "Groove",
  "Holo",
  "Hypnotic",
  "Link",
  "Matte",
  "Metal",
  "Plaid",
  "Platinum",
  "Prism",
  "Radiant",
  "Razz",
  "Refractor",
  "Sequence",
  "Scale",
  "Snakeskin",
  "Starburst",
  "Titanium",
  "Twill",
  "Wave",
  "Wire",
]

// Original collection preferences with subcategories (kept for potential future use)
export const originalCollectionPreferences = [
  {
    name: "Sports",
    icon: "trophy",
    subcategories: [
      "Baseball",
      "Basketball",
      "Fighting",
      "Football",
      "Soccer",
    ]
  },
  {
    name: "Music",
    icon: "music",
    subcategories: []
  },
  {
    name: "Movies",
    icon: "film",
    subcategories: []
  },
  {
    name: "Video Games",
    icon: "gamepad-2",
    subcategories: []
  },
  {
    name: "Anime",
    icon: "palette",
    subcategories: []
  },
  {
    name: "Pocket Monsters",
    icon: "pokemon",
    subcategories: []
  },
  {
    name: "Comics/ Superheroes",
    icon: "sparkles",
    klaviyoValue: "Comics/Superheroes",
    subcategories: []
  },
  {    
    name: "Cars/ Racing",
    icon: "car",
    klaviyoValue: "Cars/Racing",
    subcategories: []
  },
  {
    name: "Galaxy Far Away",
    icon: "spaceship",
    subcategories: []
  },
  {
    name: "Studio Concepts",
    icon: "warehouse",
    subcategories: []
  }
]

// New collection preferences without subcategories
export const collectionPreferences = [
  {
    name: "Sports",
    icon: "trophy",
  },
  {
    name: "Music",
    icon: "music",
  },
  {
    name: "Movies",
    icon: "film",
  },
  {
    name: "Video Games",
    icon: "gamepad-2",
  },
  {
    name: "Anime",
    icon: "palette",
  },
  {
    name: "Pocket Monsters",
    icon: "pokemon",
  },
  {
    name: "Comics/ Superheroes",
    icon: "sparkles",
    klaviyoValue: "Comics/Superheroes",
  },
  {    
    name: "Cars/ Racing",
    icon: "car",
    klaviyoValue: "Cars/Racing",
  },
  {
    name: "Galaxy Far Away",
    icon: "spaceship",
  },
  {
    name: "Studio Concepts",
    icon: "warehouse",
  }
]


export type Collaborator = {
  image: string
  alt: string
  href: string
  title: string
}
export const collaborators: Collaborator[] = [
  {
    image: "/assets/aaron-kai_logo.png",
    alt: "Aaron Kai",
    href: "https://www.aaronkai.com/",
    title: "Aaron Kai",
  },
  {
    image: "/assets/good-charlotte_logo.png",
    alt: "Good Charlotte",
    href: "https://www.goodcharlotte.com/",
    title: "Good Charlotte",
  },
  {
    image: "/assets/astro-boy_logo.png",
    alt: "Astro Boy",
    href: "https://astroboy.ai/",
    title: "Astro Boy",
  },
  {
    image: "/assets/steve-aoki_logo.png",
    alt: "Steve Aoki",
    href: "https://www.steveaoki.com/",
    title: "Steve Aoki",
  },
  {
      image: "/assets/aaron-kai_logo.png",
      alt: "Aaron Kai",
      href: "https://www.aaronkai.com/",
      title: "Aaron Kai",
    },
    {
      image: "/assets/good-charlotte_logo.png",
      alt: "Good Charlotte",
      href: "https://www.goodcharlotte.com/",
      title: "Good Charlotte",
    },
    {
      image: "/assets/astro-boy_logo.png",
      alt: "Astro Boy",
      href: "https://astroboy.ai/",
      title: "Astro Boy",
    },
    {
      image: "/assets/steve-aoki_logo.png",
      alt: "Steve Aoki",
      href: "https://www.steveaoki.com/",
      title: "Steve Aoki",
    },
]