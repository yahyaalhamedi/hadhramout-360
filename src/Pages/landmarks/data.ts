export interface LandmarkGalleryImage {
  url: string
  alt: string
}

export interface Landmark {
  id: number
  slug: string
  imageUrl: string
  location: string
  title: string
  subtitle: string
  category: string
  tag: string
  isFavorite: boolean
  description: string[]
  quote: string
  overview: {
    location: string
    style: string
    status: string
    bestTime: string
  }
  didYouKnow: string
  gallery: LandmarkGalleryImage[]
}

export const LANDMARKS_DATA: Landmark[] = [
  {
    id: 1,
    slug: 'shibam',
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80',
    location: 'Shibam, Hadhramout',
    title: "Shibam: The Manhattan of the Desert",
    subtitle:
      "Witness the world's oldest skyscraper city, a 16th-century architectural marvel of mud-brick high-rises reaching toward the heavens.",
    category: 'Historical',
    tag: 'Historic Site',
    isFavorite: false,
    description: [
      "Rising majestically from the desert floor of Wadi Hadhramout, Shibam is often referred to as the \"Chicago of the Desert\" or the \"Manhattan of the Desert.\" This UNESCO World Heritage site is home to approximately 500 mud-brick tower houses, some standing up to seven stories tall.",
      "The city's design is a testament to early urban planning, with narrow streets designed to provide shade and verticality that offered protection from Bedouin raids. Each building was crafted using sun-dried mud bricks and wood, protected by a layer of lime plaster that must be periodically maintained.",
      "Walking through the labyrinthine streets of Shibam is like stepping back in time. The smell of sun-baked earth and the sight of intricately carved wooden doors tell stories of a wealthy merchant past, where the incense trade once flourished.",
    ],
    quote:
      "\"Shibam represents one of the oldest and best examples of vertical urban planning in the world, a unique expression of the Hadrami culture.\"",
    overview: {
      location: 'Wadi Hadhramout, Yemen',
      style: 'Traditional Mud-Brick',
      status: 'Open to Visitors',
      bestTime: 'Late Afternoon (Sunset)',
    },
    didYouKnow:
      "Some of the buildings in Shibam have survived for over 500 years despite being made entirely of earth and organic materials.",
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        alt: 'Ornate wooden door of Shibam',
      },
      {
        url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        alt: 'Aerial view of Shibam towers',
      },
      {
        url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=80',
        alt: 'Craftsman at work in Shibam',
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        alt: 'Shibam towers at sunset',
      },
    ],
  },
  {
    id: 2,
    slug: 'wadi-doan',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    location: 'Wadi Doan, Hadhramout',
    title: 'Valley of the Ancient Palms',
    subtitle:
      'A breathtaking canyon carved through millennia, home to ancient villages perched on cliff edges and endless palm groves.',
    category: 'Natural',
    tag: 'Natural Wonder',
    isFavorite: false,
    description: [
      "Wadi Doan is one of the most spectacular valleys in the Arabian Peninsula. The dramatic canyon walls rise hundreds of metres above a lush floor of date palms and terraced farms, creating an almost surreal landscape that has captivated travellers for centuries.",
      "Scattered along the valley are cliff-hugging villages whose mud-brick houses seem to grow organically from the rock face. Each village has its own distinct character, from the towering mansions of returning migrants to humble farmer dwellings unchanged for generations.",
      "The wadi is also famed for its Sidr honey, considered among the finest in the world, and its perfectly ripe Mejdool dates. A walk through the valley floor reveals a complex irrigation system built over centuries.",
    ],
    quote:
      "\"Wadi Doan is where the desert breathes — a hidden paradise of green threading through ancient stone.\"",
    overview: {
      location: 'Hadhramout Governorate, Yemen',
      style: 'Natural Canyon & Oasis',
      status: 'Open to Visitors',
      bestTime: 'Early Morning',
    },
    didYouKnow:
      "Wadi Doan's Sidr honey fetches up to $200 per kilogram on international markets, making it one of the most expensive honeys in the world.",
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        alt: 'Palm grove in Wadi Doan',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        alt: 'Wadi Doan canyon aerial',
      },
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
        alt: 'Sunrise over the valley',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        alt: 'Village on the cliff edge',
      },
    ],
  },
  {
    id: 3,
    slug: 'al-mukalla',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    location: 'Al Mukalla, Hadhramout',
    title: 'Port of a Thousand Stories',
    subtitle:
      'A coastal jewel where the Arabian Sea meets centuries of maritime heritage, spice trade, and Hadrami hospitality.',
    category: 'Cultural',
    tag: 'Cultural Hub',
    isFavorite: false,
    description: [
      "Al Mukalla is the capital of Hadhramout Governorate and its most vibrant city, straddling the coast of the Arabian Sea. Its harbour has been a gateway for trade routes connecting Arabia, East Africa, and South Asia for over a millennium.",
      "The old city's whitewashed waterfront buildings, adorned with painted wooden balconies, reflect a unique architectural blend of Hadrami, Indian, and East African influences — testament to the far-reaching migrations of the Hadrami people.",
      "Today the city buzzes with life: fishermen hauling silver catches at dawn, aromatic spice markets, and coffee houses where qishr (ginger coffee) flows freely alongside conversation.",
    ],
    quote:
      "\"Al Mukalla is not just a city; it is a living archive of the Hadrami diaspora's stories, carried home on the sea breeze.\"",
    overview: {
      location: 'Arabian Sea Coast, Yemen',
      style: 'Coastal & Maritime',
      status: 'Open to Visitors',
      bestTime: 'October – March',
    },
    didYouKnow:
      "The Hadrami diaspora is one of the largest in the Arab world, with communities in Southeast Asia, East Africa, and the Gulf maintaining strong ties to Al Mukalla.",
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Al Mukalla coastline',
      },
      {
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        alt: 'Al Mukalla harbour',
      },
      {
        url: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=800&q=80',
        alt: 'Spice market',
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        alt: 'Sunset over the sea',
      },
    ],
  },
  {
    id: 4,
    slug: 'tarim',
    imageUrl:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=80',
    location: 'Tarim, Hadhramout',
    title: 'City of a Thousand Minarets',
    subtitle:
      'A city of extraordinary scholarship and breathtaking Islamic architecture, where knowledge has been cultivated for over a thousand years.',
    category: 'Historical',
    tag: 'Historic Site',
    isFavorite: false,
    description: [
      "Tarim has been a centre of Islamic learning for more than a millennium. The city's skyline is punctuated by hundreds of minarets, earning it the nickname \"City of a Thousand Minarets.\" Its mosques and religious institutes have produced some of the most influential Islamic scholars in history.",
      "The Al-Mihdhar Mosque, with its soaring minaret — the tallest mud-brick tower in the world — stands as a symbol of Tarim's enduring spiritual authority. The city's libraries house thousands of rare manuscripts on theology, astronomy, medicine, and poetry.",
      "Tarim's academic tradition continues to this day through Dar al-Mustafa and other institutions that attract students from across the Muslim world, keeping alive a chain of scholarship stretching back centuries.",
    ],
    quote:
      "\"In Tarim, every stone is a page of history, every minaret a finger pointing toward knowledge.\"",
    overview: {
      location: 'Wadi Hadhramout, Yemen',
      style: 'Islamic Architecture',
      status: 'Open to Visitors',
      bestTime: 'Winter (December – February)',
    },
    didYouKnow:
      "The Al-Mihdhar Mosque minaret in Tarim is the tallest mud-brick minaret in the world, standing approximately 53 metres high.",
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1565515267862-8afe5b039bb4?auto=format&fit=crop&w=800&q=80',
        alt: 'Tarim minaret at dusk',
      },
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
        alt: 'Tarim cityscape',
      },
      {
        url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80',
        alt: 'Tarim mosque courtyard',
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        alt: 'Tarim at golden hour',
      },
    ],
  },
]
