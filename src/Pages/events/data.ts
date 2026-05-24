export interface EventGalleryImage {
  url: string
  alt: string
}

export interface Event {
  id: number
  slug: string
  imageUrl: string
  authorName: string
  authorImage: string
  location: string
  venue: string
  venueDetail: string
  date: string          // display string e.g. "September 26, 2024"
  dateRange: string     // e.g. "Oct 12 - Oct 15, 2024"
  title: string
  tag: string
  category: string
  admission: string
  description: string[]
  mapLat: number
  mapLng: number
  gallery: EventGalleryImage[]
}

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    slug: 'pottery-festival-shibam',
    imageUrl:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Ahmed Bin Hashim',
    authorImage: 'https://i.pravatar.cc/150?img=11',
    location: 'Shibam, Hadhramout',
    venue: 'Old City Square',
    venueDetail: 'Shibam District, Hadhramout Governorate',
    date: 'October 12, 2024',
    dateRange: 'Oct 12 – Oct 15, 2024',
    title: 'Traditional Pottery Festival in Shibam',
    tag: 'Cultural Heritage',
    category: 'Cultural',
    admission: 'Free Entry / Workshop Fees Apply',
    description: [
      "In the heart of the \"Manhattan of the Desert,\" the Traditional Pottery Festival celebrates the enduring legacy of Shibam's master clay-workers. This isn't just a festival; it's a living archive of Hadrami identity. For four days, the narrow alleyways between high-rise mud-brick towers will hum with the sound of spinning wheels and the rhythmic tapping of decorative tools.",
      "Visitors will witness the transformation of raw desert silt into functional art pieces — water jars that keep contents cool in the midday heat, and incense burners (mabkharas) that have carried the scent of frankincense across trade routes for millennia.",
    ],
    mapLat: 15.9258,
    mapLng: 48.6267,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        alt: 'Potter at work',
      },
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'Pottery displayed on shelves',
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        alt: 'Artisan detail work',
      },
      {
        url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
        alt: 'Fired clay vessels',
      },
    ],
  },
  {
    id: 2,
    slug: 'hadrami-music-night',
    imageUrl:
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Fatima Al-Kathiri',
    authorImage: 'https://i.pravatar.cc/150?img=5',
    location: 'Tarim, Hadhramout',
    venue: 'Al-Mihdhar Mosque Courtyard',
    venueDetail: 'Tarim City Centre, Hadhramout Governorate',
    date: 'November 3, 2024',
    dateRange: 'Nov 3, 2024',
    title: 'Hadrami Music Night Under the Stars',
    tag: 'Music & Arts',
    category: 'Cultural',
    admission: 'Free Entry',
    description: [
      "Beneath a canopy of desert stars and the silhouette of Tarim's legendary minarets, Hadrami Music Night brings together the soulful sounds of the oud, the haunting melodies of traditional mawwal, and the rhythmic pulse of the mirfa drum.",
      "Local musicians and invited artists from across the Gulf gather to preserve and celebrate the Hadrami musical tradition — a tradition that travelled with the Hadrami diaspora to Indonesia, East Africa, and beyond, weaving itself into the musical fabric of three continents.",
    ],
    mapLat: 16.0479,
    mapLng: 48.9773,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
        alt: 'Traditional music performance',
      },
      {
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80',
        alt: 'Oud player at dusk',
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        alt: 'Night sky over Tarim',
      },
      {
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        alt: 'Audience gathering',
      },
    ],
  },
  {
    id: 3,
    slug: 'wadi-doan-hiking',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Khalid Al-Amri',
    authorImage: 'https://i.pravatar.cc/150?img=15',
    location: 'Wadi Doan, Hadhramout',
    venue: 'Wadi Doan Trail Head',
    venueDetail: 'Al-Qarn Village, Hadhramout Governorate',
    date: 'December 7, 2024',
    dateRange: 'Dec 7 – Dec 8, 2024',
    title: 'Wadi Doan Canyon Hiking Expedition',
    tag: 'Outdoor Adventure',
    category: 'Natural',
    admission: 'Registration Required',
    description: [
      "Join an expert-guided two-day trek through the breathtaking canyon of Wadi Doan — one of the most dramatic landscapes on the Arabian Peninsula. Walk beneath towering ochre cliffs, past ancient cliff-top villages and lush date-palm groves, and discover the living culture of the valley's residents.",
      "The expedition includes overnight camping under the stars, a visit to a local Sidr honey producer, and sunrise yoga on the canyon rim. All experience levels welcome; guides will tailor the pace to the group.",
    ],
    mapLat: 15.7731,
    mapLng: 48.4589,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        alt: 'Wadi Doan canyon',
      },
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
        alt: 'Sunrise hike',
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        alt: 'Palm grove in the valley',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        alt: 'Canyon cliff villages',
      },
    ],
  },
  {
    id: 4,
    slug: 'hadrami-food-fair',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Nora Al-Saqqaf',
    authorImage: 'https://i.pravatar.cc/150?img=47',
    location: 'Al Mukalla, Hadhramout',
    venue: 'Al Mukalla Corniche',
    venueDetail: 'Corniche Road, Al Mukalla City',
    date: 'January 18, 2025',
    dateRange: 'Jan 18 – Jan 20, 2025',
    title: 'Hadrami Food & Spice Fair',
    tag: 'Food & Culture',
    category: 'Cultural',
    admission: 'Free Entry',
    description: [
      "The Hadrami Food & Spice Fair transforms the Al Mukalla Corniche into a fragrant open-air market celebrating the rich culinary heritage of Hadhramout. Dozens of family vendors offer traditional dishes — from the tender slow-cooked saltah stew to the aromatic rice dish of zurbian — alongside rows of spice merchants whose wares trace ancient trade routes.",
      "Visitors can attend live cooking demonstrations, learn the art of qishr preparation (Yemen's spiced ginger coffee), and browse hand-crafted incense burners and woven goods from artisans across the governorate.",
    ],
    mapLat: 14.5322,
    mapLng: 49.1241,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        alt: 'Traditional Hadrami dishes',
      },
      {
        url: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=800&q=80',
        alt: 'Spice market stall',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Al Mukalla corniche',
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
        alt: 'Cooking demonstration',
      },
    ],
  },
  {
    id: 5,
    slug: 'heritage-photography-workshop',
    imageUrl:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Omar Al-Hadhrami',
    authorImage: 'https://i.pravatar.cc/150?img=33',
    location: 'Shibam, Hadhramout',
    venue: 'Shibam Heritage Centre',
    venueDetail: 'Old City, Shibam, Hadhramout',
    date: 'February 14, 2025',
    dateRange: 'Feb 14 – Feb 16, 2025',
    title: 'Heritage Photography Workshop',
    tag: 'Photography',
    category: 'Cultural',
    admission: 'Workshop Fee: $45',
    description: [
      "Capture the living architecture of Shibam through the lens of a professional camera in this intensive three-day photography workshop led by acclaimed travel photographer Aisha Al-Rimi. Participants will explore light, composition, and storytelling techniques tailored to architectural and street photography.",
      "The workshop includes golden-hour shoots on the Shibam city walls, portrait sessions with local craftspeople, and evening post-processing masterclasses. Each participant leaves with a curated portfolio and lifelong skills.",
    ],
    mapLat: 15.9258,
    mapLng: 48.6267,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
        alt: 'Photography workshop',
      },
      {
        url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        alt: 'Shibam skyline',
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        alt: 'Detail photography',
      },
      {
        url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=80',
        alt: 'Artisan portrait',
      },
    ],
  },
  {
    id: 6,
    slug: 'date-harvest-celebration',
    imageUrl:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1600&q=80',
    authorName: 'Mariam Bin Yahya',
    authorImage: 'https://i.pravatar.cc/150?img=23',
    location: 'Wadi Hadhramout',
    venue: 'Al-Qatn Date Farms',
    venueDetail: 'Al-Qatn District, Hadhramout Governorate',
    date: 'September 5, 2025',
    dateRange: 'Sep 5 – Sep 6, 2025',
    title: 'Date Harvest & Honey Festival',
    tag: 'Agriculture',
    category: 'Natural',
    admission: 'Free Entry',
    description: [
      "Every autumn, the palms of Wadi Hadhramout bend heavy with ripening dates, and Al-Qatn comes alive with the Date Harvest & Honey Festival. Farmers from across the wadi gather to celebrate the season's bounty, offering freshly harvested Mejdool, Sukkari, and Hadrami date varieties alongside the region's prized Sidr honey.",
      "Visitors are invited to climb with the farmers, learn traditional harvesting techniques, and participate in communal feasts where dates are served every way imaginable — stuffed with nuts, pressed into date molasses, or simply fresh from the palm.",
    ],
    mapLat: 15.7884,
    mapLng: 48.4312,
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
        alt: 'Date harvest',
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        alt: 'Palm groves',
      },
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
        alt: 'Wadi sunrise',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        alt: 'Wadi Hadhramout',
      },
    ],
  },
]
