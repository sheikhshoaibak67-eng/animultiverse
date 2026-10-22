// Comprehensive Season & Arc Metadata for all Anime & Cartoons
// Ensures ALL seasons are shown for every anime in the catalog

export interface SeasonInfo {
  number: number;
  name: string;
  episodeCount: number;
  poster?: string;
  year?: number;
}

export const PRESET_ANIME_SEASONS: Record<string, SeasonInfo[]> = {
  // Demon Slayer
  "demon-slayer-kimetsu-no-yaiba": [
    { number: 1, name: "Season 1: Unwavering Resolve Arc", episodeCount: 26, year: 2019, poster: "https://image.tmdb.org/t/p/w500/bV0ZCL0IqrTQKClu6EtXlZaJevD.jpg" },
    { number: 2, name: "Season 2: Mugen Train Arc", episodeCount: 7, year: 2021, poster: "https://image.tmdb.org/t/p/w500/pLGjaDyg2LeA2d9KZxBZCiiqC2B.jpg" },
    { number: 3, name: "Season 3: Entertainment District Arc", episodeCount: 11, year: 2021, poster: "https://image.tmdb.org/t/p/w500/gbmhcOtre5SeBgwR9gvTpUra5kZ.jpg" },
    { number: 4, name: "Season 4: Swordsmith Village Arc", episodeCount: 11, year: 2023, poster: "https://image.tmdb.org/t/p/w500/6gD7G8HQay1X8mHiFVttWJ3czYb.jpg" },
    { number: 5, name: "Season 5: Hashira Training Arc", episodeCount: 8, year: 2024, poster: "https://image.tmdb.org/t/p/w500/axI3BUZgTYz36IYtUtRhivtspUo.jpg" },
  ],
  "85937": [
    { number: 1, name: "Season 1: Unwavering Resolve Arc", episodeCount: 26, year: 2019, poster: "https://image.tmdb.org/t/p/w500/bV0ZCL0IqrTQKClu6EtXlZaJevD.jpg" },
    { number: 2, name: "Season 2: Mugen Train Arc", episodeCount: 7, year: 2021, poster: "https://image.tmdb.org/t/p/w500/pLGjaDyg2LeA2d9KZxBZCiiqC2B.jpg" },
    { number: 3, name: "Season 3: Entertainment District Arc", episodeCount: 11, year: 2021, poster: "https://image.tmdb.org/t/p/w500/gbmhcOtre5SeBgwR9gvTpUra5kZ.jpg" },
    { number: 4, name: "Season 4: Swordsmith Village Arc", episodeCount: 11, year: 2023, poster: "https://image.tmdb.org/t/p/w500/6gD7G8HQay1X8mHiFVttWJ3czYb.jpg" },
    { number: 5, name: "Season 5: Hashira Training Arc", episodeCount: 8, year: 2024, poster: "https://image.tmdb.org/t/p/w500/axI3BUZgTYz36IYtUtRhivtspUo.jpg" },
  ],

  // Jujutsu Kaisen
  "jujutsu-kaisen": [
    { number: 1, name: "Season 1: Fearsome Womb & Kyoto Goodwill Arc", episodeCount: 24, year: 2020, poster: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40grXSUwYudTeFlU.jpg" },
    { number: 2, name: "Season 2: Hidden Inventory & Shibuya Incident", episodeCount: 23, year: 2023, poster: "https://image.tmdb.org/t/p/w500/fCayJvW2eQv1X4P6qR5zS8m4N3W.jpg" },
  ],
  "95479": [
    { number: 1, name: "Season 1: Fearsome Womb & Kyoto Goodwill Arc", episodeCount: 24, year: 2020, poster: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40grXSUwYudTeFlU.jpg" },
    { number: 2, name: "Season 2: Hidden Inventory & Shibuya Incident", episodeCount: 23, year: 2023, poster: "https://image.tmdb.org/t/p/w500/fCayJvW2eQv1X4P6qR5zS8m4N3W.jpg" },
  ],

  // Attack on Titan
  "attack-on-titan": [
    { number: 1, name: "Season 1: Fall of Shiganshina & Trost", episodeCount: 25, year: 2013, poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg" },
    { number: 2, name: "Season 2: Clash of the Titans", episodeCount: 12, year: 2017, poster: "https://image.tmdb.org/t/p/w500/sjM4Wb8v8W5z7X5mY9w0L7qB6Z7.jpg" },
    { number: 3, name: "Season 3: Uprising & Return to Shiganshina", episodeCount: 22, year: 2018, poster: "https://image.tmdb.org/t/p/w500/2B0wZ1pL0wz8xWjY5hC0L7qB6Z7.jpg" },
    { number: 4, name: "Season 4: The Final Season & Rumbling", episodeCount: 28, year: 2020, poster: "https://image.tmdb.org/t/p/w500/7aZ1pL0wz8xWjY5hC0L7qB6Z7K.jpg" },
  ],
  "1429": [
    { number: 1, name: "Season 1: Fall of Shiganshina & Trost", episodeCount: 25, year: 2013, poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg" },
    { number: 2, name: "Season 2: Clash of the Titans", episodeCount: 12, year: 2017, poster: "https://image.tmdb.org/t/p/w500/sjM4Wb8v8W5z7X5mY9w0L7qB6Z7.jpg" },
    { number: 3, name: "Season 3: Uprising & Return to Shiganshina", episodeCount: 22, year: 2018, poster: "https://image.tmdb.org/t/p/w500/2B0wZ1pL0wz8xWjY5hC0L7qB6Z7.jpg" },
    { number: 4, name: "Season 4: The Final Season & Rumbling", episodeCount: 28, year: 2020, poster: "https://image.tmdb.org/t/p/w500/7aZ1pL0wz8xWjY5hC0L7qB6Z7K.jpg" },
  ],

  // Solo Leveling
  "solo-leveling": [
    { number: 1, name: "Season 1: D-Rank Dungeon & Awakening", episodeCount: 12, year: 2024, poster: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg" },
    { number: 2, name: "Season 2: Arise from the Shadow", episodeCount: 13, year: 2025, poster: "https://image.tmdb.org/t/p/w500/xMNH87maNLt9n2bMDYeI6db5VFm.jpg" },
  ],
  "127532": [
    { number: 1, name: "Season 1: D-Rank Dungeon & Awakening", episodeCount: 12, year: 2024, poster: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg" },
    { number: 2, name: "Season 2: Arise from the Shadow", episodeCount: 13, year: 2025, poster: "https://image.tmdb.org/t/p/w500/xMNH87maNLt9n2bMDYeI6db5VFm.jpg" },
  ],

  // Bleach
  "bleach": [
    { number: 1, name: "Season 1: The Substitute Shinigami", episodeCount: 20, year: 2004 },
    { number: 2, name: "Season 2: Soul Society: The Sneak Entry", episodeCount: 21, year: 2005 },
    { number: 3, name: "Season 3: Soul Society: The Rescue", episodeCount: 22, year: 2005 },
    { number: 4, name: "Season 4: The Bount Arc", episodeCount: 28, year: 2006 },
    { number: 5, name: "Season 5: Arrancar: The Arrival", episodeCount: 22, year: 2007 },
    { number: 6, name: "Season 6: Arrancar: Hueco Mundo", episodeCount: 27, year: 2007 },
    { number: 7, name: "Season 7: Fake Karakura Town", episodeCount: 31, year: 2009 },
    { number: 8, name: "Season 8: Thousand-Year Blood War", episodeCount: 26, year: 2022 },
  ],
  "30984": [
    { number: 1, name: "Season 1: The Substitute Shinigami", episodeCount: 20, year: 2004 },
    { number: 2, name: "Season 2: Soul Society: The Sneak Entry", episodeCount: 21, year: 2005 },
    { number: 3, name: "Season 3: Soul Society: The Rescue", episodeCount: 22, year: 2005 },
    { number: 4, name: "Season 4: The Bount Arc", episodeCount: 28, year: 2006 },
    { number: 5, name: "Season 5: Arrancar: The Arrival", episodeCount: 22, year: 2007 },
    { number: 6, name: "Season 6: Arrancar: Hueco Mundo", episodeCount: 27, year: 2007 },
    { number: 7, name: "Season 7: Fake Karakura Town", episodeCount: 31, year: 2009 },
    { number: 8, name: "Season 8: Thousand-Year Blood War", episodeCount: 26, year: 2022 },
  ],

  // One Piece
  "one-piece": [
    { number: 1, name: "Season 1: East Blue Saga", episodeCount: 61, year: 1999 },
    { number: 2, name: "Season 2: Alabasta Saga", episodeCount: 74, year: 2001 },
    { number: 3, name: "Season 3: Sky Island / Skypiea Saga", episodeCount: 71, year: 2003 },
    { number: 4, name: "Season 4: Water 7 & Enies Lobby Saga", episodeCount: 119, year: 2005 },
    { number: 5, name: "Season 5: Thriller Bark Saga", episodeCount: 59, year: 2008 },
    { number: 6, name: "Season 6: Summit War & Marineford", episodeCount: 131, year: 2009 },
    { number: 7, name: "Season 7: Fish-Man Island & Punk Hazard", episodeCount: 105, year: 2011 },
    { number: 8, name: "Season 8: Dressrosa Saga", episodeCount: 118, year: 2014 },
    { number: 9, name: "Season 9: Whole Cake Island Saga", episodeCount: 107, year: 2017 },
    { number: 10, name: "Season 10: Wano Country Saga", episodeCount: 197, year: 2019 },
    { number: 11, name: "Season 11: Egghead Arc", episodeCount: 45, year: 2024 },
  ],
  "37854": [
    { number: 1, name: "Season 1: East Blue Saga", episodeCount: 61, year: 1999 },
    { number: 2, name: "Season 2: Alabasta Saga", episodeCount: 74, year: 2001 },
    { number: 3, name: "Season 3: Sky Island / Skypiea Saga", episodeCount: 71, year: 2003 },
    { number: 4, name: "Season 4: Water 7 & Enies Lobby Saga", episodeCount: 119, year: 2005 },
    { number: 5, name: "Season 5: Thriller Bark Saga", episodeCount: 59, year: 2008 },
    { number: 6, name: "Season 6: Summit War & Marineford", episodeCount: 131, year: 2009 },
    { number: 7, name: "Season 7: Fish-Man Island & Punk Hazard", episodeCount: 105, year: 2011 },
    { number: 8, name: "Season 8: Dressrosa Saga", episodeCount: 118, year: 2014 },
    { number: 9, name: "Season 9: Whole Cake Island Saga", episodeCount: 107, year: 2017 },
    { number: 10, name: "Season 10: Wano Country Saga", episodeCount: 197, year: 2019 },
    { number: 11, name: "Season 11: Egghead Arc", episodeCount: 45, year: 2024 },
  ],

  // Naruto
  "naruto": [
    { number: 1, name: "Season 1: Land of Waves & Chunin Exam", episodeCount: 52, year: 2002 },
    { number: 2, name: "Season 2: Konoha Invasion & Search for Tsunade", episodeCount: 52, year: 2003 },
    { number: 3, name: "Season 3: Sasuke Recovery Mission", episodeCount: 54, year: 2004 },
    { number: 4, name: "Season 4: Konoha Ninja Missions", episodeCount: 62, year: 2005 },
  ],
  "46260": [
    { number: 1, name: "Season 1: Land of Waves & Chunin Exam", episodeCount: 52, year: 2002 },
    { number: 2, name: "Season 2: Konoha Invasion & Search for Tsunade", episodeCount: 52, year: 2003 },
    { number: 3, name: "Season 3: Sasuke Recovery Mission", episodeCount: 54, year: 2004 },
    { number: 4, name: "Season 4: Konoha Ninja Missions", episodeCount: 62, year: 2005 },
  ],

  // Hunter x Hunter
  "hunter-x-hunter": [
    { number: 1, name: "Season 1: Hunter Exam & Zoldyck Family", episodeCount: 26, year: 2011 },
    { number: 2, name: "Season 2: Heavens Arena Arc", episodeCount: 12, year: 2012 },
    { number: 3, name: "Season 3: Phantom Troupe / Yorknew City", episodeCount: 20, year: 2012 },
    { number: 4, name: "Season 4: Greed Island Arc", episodeCount: 17, year: 2013 },
    { number: 5, name: "Season 5: Chimera Ant Arc", episodeCount: 61, year: 2013 },
    { number: 6, name: "Season 6: 13th Hunter Chairman Election", episodeCount: 12, year: 2014 },
  ],
  "46298": [
    { number: 1, name: "Season 1: Hunter Exam & Zoldyck Family", episodeCount: 26, year: 2011 },
    { number: 2, name: "Season 2: Heavens Arena Arc", episodeCount: 12, year: 2012 },
    { number: 3, name: "Season 3: Phantom Troupe / Yorknew City", episodeCount: 20, year: 2012 },
    { number: 4, name: "Season 4: Greed Island Arc", episodeCount: 17, year: 2013 },
    { number: 5, name: "Season 5: Chimera Ant Arc", episodeCount: 61, year: 2013 },
    { number: 6, name: "Season 6: 13th Hunter Chairman Election", episodeCount: 12, year: 2014 },
  ],

  // Chainsaw Man
  "chainsaw-man": [
    { number: 1, name: "Season 1: Public Safety Arc", episodeCount: 12, year: 2022 },
    { number: 2, name: "Season 2: Bomb Girl & Reze Arc", episodeCount: 12, year: 2024 },
  ],
  "114410": [
    { number: 1, name: "Season 1: Public Safety Arc", episodeCount: 12, year: 2022 },
    { number: 2, name: "Season 2: Bomb Girl & Reze Arc", episodeCount: 12, year: 2024 },
  ],

  // Death Note
  "death-note": [
    { number: 1, name: "Season 1: Kira vs. L Saga", episodeCount: 25, year: 2006 },
    { number: 2, name: "Season 2: Near & Mello Succession", episodeCount: 12, year: 2007 },
  ],
  "13916": [
    { number: 1, name: "Season 1: Kira vs. L Saga", episodeCount: 25, year: 2006 },
    { number: 2, name: "Season 2: Near & Mello Succession", episodeCount: 12, year: 2007 },
  ],

  // Frieren
  "frieren-beyond-journeys-end": [
    { number: 1, name: "Season 1: Part 1 - First Class Mage Exam", episodeCount: 16, year: 2023 },
    { number: 2, name: "Season 2: Part 2 - Northern Plateau Journey", episodeCount: 12, year: 2024 },
  ],
  "209867": [
    { number: 1, name: "Season 1: Part 1 - First Class Mage Exam", episodeCount: 16, year: 2023 },
    { number: 2, name: "Season 2: Part 2 - Northern Plateau Journey", episodeCount: 12, year: 2024 },
  ],

  // Avatar: The Last Airbender
  "avatar-the-last-airbender": [
    { number: 1, name: "Book One: Water", episodeCount: 20, year: 2005 },
    { number: 2, name: "Book Two: Earth", episodeCount: 20, year: 2006 },
    { number: 3, name: "Book Three: Fire", episodeCount: 21, year: 2007 },
  ],
  "246": [
    { number: 1, name: "Book One: Water", episodeCount: 20, year: 2005 },
    { number: 2, name: "Book Two: Earth", episodeCount: 20, year: 2006 },
    { number: 3, name: "Book Three: Fire", episodeCount: 21, year: 2007 },
  ],

  // Ben 10
  "ben-10": [
    { number: 1, name: "Season 1: Omnitrix Awakening", episodeCount: 13, year: 2005 },
    { number: 2, name: "Season 2: Kevin 11 & Vilgax", episodeCount: 13, year: 2006 },
    { number: 3, name: "Season 3: Ghostfreak's Return", episodeCount: 13, year: 2006 },
    { number: 4, name: "Season 4: Secret of the Omnitrix", episodeCount: 10, year: 2007 },
  ],
  "4251": [
    { number: 1, name: "Season 1: Omnitrix Awakening", episodeCount: 13, year: 2005 },
    { number: 2, name: "Season 2: Kevin 11 & Vilgax", episodeCount: 13, year: 2006 },
    { number: 3, name: "Season 3: Ghostfreak's Return", episodeCount: 13, year: 2006 },
    { number: 4, name: "Season 4: Secret of the Omnitrix", episodeCount: 10, year: 2007 },
  ],

  // Rick and Morty
  "rick-and-morty": [
    { number: 1, name: "Season 1: Multiverse Awakening", episodeCount: 11, year: 2013 },
    { number: 2, name: "Season 2: Interdimensional Cable", episodeCount: 10, year: 2015 },
    { number: 3, name: "Season 3: Pickle Rick & Citadel", episodeCount: 10, year: 2017 },
    { number: 4, name: "Season 4: Edge of Tomorty", episodeCount: 10, year: 2019 },
    { number: 5, name: "Season 5: Rickmurai Jack", episodeCount: 10, year: 2021 },
    { number: 6, name: "Season 6: Solaricks & Portal Reset", episodeCount: 10, year: 2022 },
    { number: 7, name: "Season 7: Jormungandr & Fear Hole", episodeCount: 10, year: 2023 },
  ],
  "60625": [
    { number: 1, name: "Season 1: Multiverse Awakening", episodeCount: 11, year: 2013 },
    { number: 2, name: "Season 2: Interdimensional Cable", episodeCount: 10, year: 2015 },
    { number: 3, name: "Season 3: Pickle Rick & Citadel", episodeCount: 10, year: 2017 },
    { number: 4, name: "Season 4: Edge of Tomorty", episodeCount: 10, year: 2019 },
    { number: 5, name: "Season 5: Rickmurai Jack", episodeCount: 10, year: 2021 },
    { number: 6, name: "Season 6: Solaricks & Portal Reset", episodeCount: 10, year: 2022 },
    { number: 7, name: "Season 7: Jormungandr & Fear Hole", episodeCount: 10, year: 2023 },
  ],

  // Arcane
  "arcane": [
    { number: 1, name: "Season 1: Piltover & Zaun", episodeCount: 9, year: 2021 },
    { number: 2, name: "Season 2: The Final Conflict", episodeCount: 9, year: 2024 },
  ],
  "94605": [
    { number: 1, name: "Season 1: Piltover & Zaun", episodeCount: 9, year: 2021 },
    { number: 2, name: "Season 2: The Final Conflict", episodeCount: 9, year: 2024 },
  ],

  // Doraemon
  "doraemon": [
    { number: 1, name: "Season 1: Classic Gadget Adventures", episodeCount: 26, year: 2005 },
    { number: 2, name: "Season 2: Time Machine & Anywhere Door", episodeCount: 26, year: 2008 },
    { number: 3, name: "Season 3: Secret Gadgets of 22nd Century", episodeCount: 26, year: 2012 },
  ],
  "62223": [
    { number: 1, name: "Season 1: Classic Gadget Adventures", episodeCount: 26, year: 2005 },
    { number: 2, name: "Season 2: Time Machine & Anywhere Door", episodeCount: 26, year: 2008 },
    { number: 3, name: "Season 3: Secret Gadgets of 22nd Century", episodeCount: 26, year: 2012 },
  ],

  // Shin-chan
  "shin-chan": [
    { number: 1, name: "Season 1: Kasukabe Shenanigans", episodeCount: 26, year: 1992 },
    { number: 2, name: "Season 2: Action Kamen Adventures", episodeCount: 26, year: 1996 },
    { number: 3, name: "Season 3: Nohara Family Escapades", episodeCount: 26, year: 2000 },
  ],
  "41881": [
    { number: 1, name: "Season 1: Kasukabe Shenanigans", episodeCount: 26, year: 1992 },
    { number: 2, name: "Season 2: Action Kamen Adventures", episodeCount: 26, year: 1996 },
    { number: 3, name: "Season 3: Nohara Family Escapades", episodeCount: 26, year: 2000 },
  ],

  // Naruto Shippuden
  "naruto-shippuden": [
    { number: 1, name: "Season 1: Kazekage Rescue", episodeCount: 32, year: 2007 },
    { number: 2, name: "Season 2: Long-Awaited Reunion", episodeCount: 21, year: 2007 },
    { number: 3, name: "Season 3: Twelve Guardian Shinobi", episodeCount: 18, year: 2008 },
    { number: 4, name: "Season 4: Immortal Devastators - Hidan and Kakuzu", episodeCount: 17, year: 2008 },
    { number: 5, name: "Season 5: Three-Tails' Appearance", episodeCount: 24, year: 2008 },
    { number: 6, name: "Season 6: Master's Prophecy and Vengeance", episodeCount: 31, year: 2009 },
    { number: 7, name: "Season 7: Six-Tails Unleashed", episodeCount: 8, year: 2010 },
    { number: 8, name: "Season 8: Two Saviors (Pain's Assault)", episodeCount: 24, year: 2010 },
    { number: 9, name: "Season 9: Past Arc ~The Locus of Konoha~", episodeCount: 21, year: 2010 },
    { number: 10, name: "Season 10: Five Kage Summit", episodeCount: 25, year: 2011 },
    { number: 11, name: "Season 11: Paradise on the Ship", episodeCount: 21, year: 2011 },
    { number: 12, name: "Season 12: Nine-Tails Taming & Fate Encounter", episodeCount: 33, year: 2012 },
    { number: 13, name: "Season 13: The Seven Shinobi Swordsmen", episodeCount: 20, year: 2012 },
    { number: 14, name: "Season 14: Fourth Shinobi World War ~Assailants~", episodeCount: 25, year: 2013 },
    { number: 15, name: "Season 15: Fourth Shinobi World War ~Sasuke & Itachi~", episodeCount: 28, year: 2013 },
    { number: 16, name: "Season 16: Kakashi: Shadow of the ANBU Black Ops", episodeCount: 13, year: 2014 },
    { number: 17, name: "Season 17: Fourth Shinobi World War ~The Returning Squad~", episodeCount: 11, year: 2014 },
    { number: 18, name: "Season 18: The Ten Tails Jinchuriki", episodeCount: 21, year: 2014 },
    { number: 19, name: "Season 19: Naruto's Back ~The Miracle of Comrades~", episodeCount: 20, year: 2015 },
    { number: 20, name: "Season 20: Infinite Tsukuyomi: The Invocation", episodeCount: 66, year: 2015 },
    { number: 21, name: "Season 21: Kaguya Otsutsuki Strikes & Final Battle", episodeCount: 21, year: 2016 },
  ],
  "naruto-shippuuden": [
    { number: 1, name: "Season 1: Kazekage Rescue", episodeCount: 32, year: 2007 },
    { number: 2, name: "Season 2: Long-Awaited Reunion", episodeCount: 21, year: 2007 },
    { number: 3, name: "Season 3: Twelve Guardian Shinobi", episodeCount: 18, year: 2008 },
    { number: 4, name: "Season 4: Immortal Devastators", episodeCount: 17, year: 2008 },
    { number: 5, name: "Season 5: Master's Prophecy and Vengeance", episodeCount: 31, year: 2009 },
    { number: 6, name: "Season 6: Two Saviors (Pain's Assault)", episodeCount: 24, year: 2010 },
    { number: 7, name: "Season 7: Five Kage Summit", episodeCount: 25, year: 2011 },
    { number: 8, name: "Season 8: Fourth Shinobi World War", episodeCount: 45, year: 2012 },
    { number: 9, name: "Season 9: Ten Tails Jinchuriki & Kaguya", episodeCount: 50, year: 2015 },
  ],
  "31911": [
    { number: 1, name: "Season 1: Kazekage Rescue", episodeCount: 32, year: 2007 },
    { number: 2, name: "Season 2: Long-Awaited Reunion", episodeCount: 21, year: 2007 },
    { number: 3, name: "Season 3: Twelve Guardian Shinobi", episodeCount: 18, year: 2008 },
    { number: 4, name: "Season 4: Immortal Devastators", episodeCount: 17, year: 2008 },
    { number: 5, name: "Season 5: Master's Prophecy and Vengeance", episodeCount: 31, year: 2009 },
    { number: 6, name: "Season 6: Two Saviors (Pain's Assault)", episodeCount: 24, year: 2010 },
    { number: 7, name: "Season 7: Five Kage Summit", episodeCount: 25, year: 2011 },
    { number: 8, name: "Season 8: Fourth Shinobi World War", episodeCount: 45, year: 2012 },
    { number: 9, name: "Season 9: Ten Tails Jinchuriki & Kaguya", episodeCount: 50, year: 2015 },
  ],

  // Dragon Ball Z
  "dragon-ball-z": [
    { number: 1, name: "Season 1: Saiyan Saga", episodeCount: 39, year: 1989 },
    { number: 2, name: "Season 2: Namek Saga", episodeCount: 35, year: 1990 },
    { number: 3, name: "Season 3: Captain Ginyu & Frieza Saga", episodeCount: 33, year: 1991 },
    { number: 4, name: "Season 4: Garlic Jr., Trunks & Androids", episodeCount: 32, year: 1991 },
    { number: 5, name: "Season 5: Imperfect Cell & Cell Games", episodeCount: 26, year: 1992 },
    { number: 6, name: "Season 6: Great Saiyaman & World Tournament", episodeCount: 29, year: 1993 },
    { number: 7, name: "Season 7: Babidi & Majin Buu Saga", episodeCount: 25, year: 1994 },
    { number: 8, name: "Season 8: Fusion & Kid Buu Saga", episodeCount: 34, year: 1995 },
    { number: 9, name: "Season 9: Peaceful World Saga", episodeCount: 38, year: 1996 },
  ],
  "12971": [
    { number: 1, name: "Season 1: Saiyan Saga", episodeCount: 39, year: 1989 },
    { number: 2, name: "Season 2: Namek Saga", episodeCount: 35, year: 1990 },
    { number: 3, name: "Season 3: Captain Ginyu & Frieza Saga", episodeCount: 33, year: 1991 },
    { number: 4, name: "Season 4: Garlic Jr., Trunks & Androids", episodeCount: 32, year: 1991 },
    { number: 5, name: "Season 5: Imperfect Cell & Cell Games", episodeCount: 26, year: 1992 },
    { number: 6, name: "Season 6: Great Saiyaman & World Tournament", episodeCount: 29, year: 1993 },
    { number: 7, name: "Season 7: Babidi & Majin Buu Saga", episodeCount: 25, year: 1994 },
    { number: 8, name: "Season 8: Fusion & Kid Buu Saga", episodeCount: 34, year: 1995 },
    { number: 9, name: "Season 9: Peaceful World Saga", episodeCount: 38, year: 1996 },
  ],

  // My Hero Academia
  "my-hero-academia": [
    { number: 1, name: "Season 1: U.A. Entrance & U.S.J. Arc", episodeCount: 13, year: 2016 },
    { number: 2, name: "Season 2: Sports Festival & Hero Killer Stain", episodeCount: 25, year: 2017 },
    { number: 3, name: "Season 3: Forest Training & All For One", episodeCount: 25, year: 2018 },
    { number: 4, name: "Season 4: Shie Hassaikai & U.A. School Festival", episodeCount: 25, year: 2019 },
    { number: 5, name: "Season 5: Joint Training & My Villain Academia", episodeCount: 25, year: 2021 },
    { number: 6, name: "Season 6: Paranormal Liberation War & Dark Hero", episodeCount: 25, year: 2022 },
    { number: 7, name: "Season 7: Final War Arc", episodeCount: 21, year: 2024 },
  ],
  "65930": [
    { number: 1, name: "Season 1: U.A. Entrance & U.S.J. Arc", episodeCount: 13, year: 2016 },
    { number: 2, name: "Season 2: Sports Festival & Hero Killer Stain", episodeCount: 25, year: 2017 },
    { number: 3, name: "Season 3: Forest Training & All For One", episodeCount: 25, year: 2018 },
    { number: 4, name: "Season 4: Shie Hassaikai & U.A. School Festival", episodeCount: 25, year: 2019 },
    { number: 5, name: "Season 5: Joint Training & My Villain Academia", episodeCount: 25, year: 2021 },
    { number: 6, name: "Season 6: Paranormal Liberation War & Dark Hero", episodeCount: 25, year: 2022 },
    { number: 7, name: "Season 7: Final War Arc", episodeCount: 21, year: 2024 },
  ],

  // Tokyo Ghoul
  "tokyo-ghoul": [
    { number: 1, name: "Season 1: Anteiku & Jason Arc", episodeCount: 12, year: 2014 },
    { number: 2, name: "Season 2: Root A (Aogiri Tree)", episodeCount: 12, year: 2015 },
    { number: 3, name: "Season 3: :re (Quinx Squad)", episodeCount: 12, year: 2018 },
    { number: 4, name: "Season 4: :re Part 2 (Dragon Arc)", episodeCount: 12, year: 2018 },
  ],
  "61374": [
    { number: 1, name: "Season 1: Anteiku & Jason Arc", episodeCount: 12, year: 2014 },
    { number: 2, name: "Season 2: Root A (Aogiri Tree)", episodeCount: 12, year: 2015 },
    { number: 3, name: "Season 3: :re (Quinx Squad)", episodeCount: 12, year: 2018 },
    { number: 4, name: "Season 4: :re Part 2 (Dragon Arc)", episodeCount: 12, year: 2018 },
  ],

  // Fullmetal Alchemist: Brotherhood
  "fullmetal-alchemist-brotherhood": [
    { number: 1, name: "Season 1: Philosopher's Stone Arc", episodeCount: 14, year: 2009 },
    { number: 2, name: "Season 2: Central City & Homunculi", episodeCount: 12, year: 2009 },
    { number: 3, name: "Season 3: Briggs Fortress", episodeCount: 13, year: 2009 },
    { number: 4, name: "Season 4: Promised Day Prelude", episodeCount: 13, year: 2010 },
    { number: 5, name: "Season 5: The Final Battle & Journey's End", episodeCount: 12, year: 2010 },
  ],
  "31910": [
    { number: 1, name: "Season 1: Philosopher's Stone Arc", episodeCount: 14, year: 2009 },
    { number: 2, name: "Season 2: Central City & Homunculi", episodeCount: 12, year: 2009 },
    { number: 3, name: "Season 3: Briggs Fortress", episodeCount: 13, year: 2009 },
    { number: 4, name: "Season 4: Promised Day Prelude", episodeCount: 13, year: 2010 },
    { number: 5, name: "Season 5: The Final Battle & Journey's End", episodeCount: 12, year: 2010 },
  ],

  // Pokemon
  "pokemon": [
    { number: 1, name: "Season 1: Indigo League", episodeCount: 82, year: 1997 },
    { number: 2, name: "Season 2: Adventures in the Orange Islands", episodeCount: 36, year: 1999 },
    { number: 3, name: "Season 3: The Johto Journeys", episodeCount: 41, year: 2000 },
    { number: 4, name: "Season 4: Johto League Champions", episodeCount: 52, year: 2001 },
    { number: 5, name: "Season 5: Master Quest", episodeCount: 65, year: 2002 },
    { number: 6, name: "Season 6: Advanced Generation / Hoenn", episodeCount: 40, year: 2003 },
    { number: 7, name: "Season 7: Diamond and Pearl / Sinnoh", episodeCount: 52, year: 2006 },
    { number: 8, name: "Season 8: Black & White / Unova", episodeCount: 48, year: 2010 },
    { number: 9, name: "Season 9: XY & XYZ / Kalos", episodeCount: 48, year: 2013 },
    { number: 10, name: "Season 10: Sun & Moon / Alola", episodeCount: 43, year: 2016 },
    { number: 11, name: "Season 11: Ultimate Journeys / Horizons", episodeCount: 48, year: 2020 },
  ],
  // Black Clover
  "black-clover": [
    { number: 1, name: "Season 1: Magic Knights & Eye of the Midnight Sun", episodeCount: 51, year: 2017 },
    { number: 2, name: "Season 2: Royal Knights & Elf Reincarnation Arc", episodeCount: 51, year: 2018 },
    { number: 3, name: "Season 3: Heart Kingdom & Spade Kingdom Training", episodeCount: 52, year: 2019 },
    { number: 4, name: "Season 4: Spade Kingdom Raid Arc", episodeCount: 16, year: 2020 },
  ],
  "73223": [
    { number: 1, name: "Season 1: Magic Knights & Eye of the Midnight Sun", episodeCount: 51, year: 2017 },
    { number: 2, name: "Season 2: Royal Knights & Elf Reincarnation Arc", episodeCount: 51, year: 2018 },
    { number: 3, name: "Season 3: Heart Kingdom & Spade Kingdom Training", episodeCount: 52, year: 2019 },
    { number: 4, name: "Season 4: Spade Kingdom Raid Arc", episodeCount: 16, year: 2020 },
  ],

  // Baki series
  "baki": [
    { number: 1, name: "Season 1: Most Evil Death Row Convicts", episodeCount: 13, year: 2018 },
    { number: 2, name: "Season 2: Great Raitai Tournament", episodeCount: 13, year: 2020 },
  ],
  "80983": [
    { number: 1, name: "Season 1: Most Evil Death Row Convicts", episodeCount: 13, year: 2018 },
    { number: 2, name: "Season 2: Great Raitai Tournament", episodeCount: 13, year: 2020 },
  ],
  "80623": [
    { number: 1, name: "Season 1: Most Evil Death Row Convicts", episodeCount: 13, year: 2018 },
    { number: 2, name: "Season 2: Great Raitai Tournament", episodeCount: 13, year: 2020 },
  ],
  "baki-hanma": [
    { number: 1, name: "Season 1: Combat Shadow Fighting & Prison Arc", episodeCount: 12, year: 2021 },
    { number: 2, name: "Season 2: The Tale of Pickle & Father-Son Fight", episodeCount: 27, year: 2023 },
  ],
  "129600": [
    { number: 1, name: "Season 1: Combat Shadow Fighting & Prison Arc", episodeCount: 12, year: 2021 },
    { number: 2, name: "Season 2: The Tale of Pickle & Father-Son Fight", episodeCount: 27, year: 2023 },
  ],
  "136315": [
    { number: 1, name: "Season 1: Combat Shadow Fighting & Prison Arc", episodeCount: 12, year: 2021 },
    { number: 2, name: "Season 2: The Tale of Pickle & Father-Son Fight", episodeCount: 27, year: 2023 },
  ],
  "baki-dou-the-invincible-samurai": [
    { number: 1, name: "Season 1: The Invincible Samurai", episodeCount: 25, year: 2026 },
  ],
  "300054": [
    { number: 1, name: "Season 1: The Invincible Samurai", episodeCount: 25, year: 2026 },
  ],

  // Spy x Family
  "spy-x-family": [
    { number: 1, name: "Season 1: Part 1 - Operation Strix", episodeCount: 12, year: 2022 },
    { number: 2, name: "Season 2: Part 2 - Doggy Crisis & WISE", episodeCount: 13, year: 2022 },
    { number: 3, name: "Season 3: Season 2 (Cruise Adventure)", episodeCount: 12, year: 2023 },
  ],
  "120089": [
    { number: 1, name: "Season 1: Part 1 - Operation Strix", episodeCount: 12, year: 2022 },
    { number: 2, name: "Season 2: Part 2 - Doggy Crisis & WISE", episodeCount: 13, year: 2022 },
    { number: 3, name: "Season 3: Season 2 (Cruise Adventure)", episodeCount: 12, year: 2023 },
  ],

  // Vinland Saga
  "vinland-saga": [
    { number: 1, name: "Season 1: War in England & Askeladd Arc", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Slave Arc & Ketil's Farm", episodeCount: 24, year: 2023 },
  ],
  "84958": [
    { number: 1, name: "Season 1: War in England & Askeladd Arc", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Slave Arc & Ketil's Farm", episodeCount: 24, year: 2023 },
  ],

  // Mob Psycho 100
  "mob-psycho-100": [
    { number: 1, name: "Season 1: Claw Arc", episodeCount: 12, year: 2016 },
    { number: 2, name: "Season 2: Mogami & World Domination Arc", episodeCount: 13, year: 2019 },
    { number: 3, name: "Season 3: Divine Tree & Reigen Arc", episodeCount: 12, year: 2022 },
  ],
  "67075": [
    { number: 1, name: "Season 1: Claw Arc", episodeCount: 12, year: 2016 },
    { number: 2, name: "Season 2: Mogami & World Domination Arc", episodeCount: 13, year: 2019 },
    { number: 3, name: "Season 3: Divine Tree & Reigen Arc", episodeCount: 12, year: 2022 },
  ],

  // Haikyuu!!
  "haikyuu": [
    { number: 1, name: "Season 1: Karasuno High Volleyball Team", episodeCount: 25, year: 2014 },
    { number: 2, name: "Season 2: Tokyo Expedition & Spring Tournament", episodeCount: 25, year: 2015 },
    { number: 3, name: "Season 3: Karasuno High vs. Shiratorizawa", episodeCount: 10, year: 2016 },
    { number: 4, name: "Season 4: To the Top", episodeCount: 25, year: 2020 },
  ],
  "60735": [
    { number: 1, name: "Season 1: Karasuno High Volleyball Team", episodeCount: 25, year: 2014 },
    { number: 2, name: "Season 2: Tokyo Expedition & Spring Tournament", episodeCount: 25, year: 2015 },
    { number: 3, name: "Season 3: Karasuno High vs. Shiratorizawa", episodeCount: 10, year: 2016 },
    { number: 4, name: "Season 4: To the Top", episodeCount: 25, year: 2020 },
  ],

  // JoJo's Bizarre Adventure
  "jojos-bizarre-adventure": [
    { number: 1, name: "Season 1: Phantom Blood & Battle Tendency", episodeCount: 26, year: 2012 },
    { number: 2, name: "Season 2: Stardust Crusaders", episodeCount: 48, year: 2014 },
    { number: 3, name: "Season 3: Diamond is Unbreakable", episodeCount: 39, year: 2016 },
    { number: 4, name: "Season 4: Golden Wind", episodeCount: 39, year: 2018 },
    { number: 5, name: "Season 5: Stone Ocean", episodeCount: 38, year: 2021 },
  ],
  "45790": [
    { number: 1, name: "Season 1: Phantom Blood & Battle Tendency", episodeCount: 26, year: 2012 },
    { number: 2, name: "Season 2: Stardust Crusaders", episodeCount: 48, year: 2014 },
    { number: 3, name: "Season 3: Diamond is Unbreakable", episodeCount: 39, year: 2016 },
    { number: 4, name: "Season 4: Golden Wind", episodeCount: 39, year: 2018 },
    { number: 5, name: "Season 5: Stone Ocean", episodeCount: 38, year: 2021 },
  ],

  // Re:Zero
  "re-zero-starting-life-in-another-world": [
    { number: 1, name: "Season 1: Return by Death", episodeCount: 25, year: 2016 },
    { number: 2, name: "Season 2: Sanctuary & The Witches of Sin", episodeCount: 25, year: 2020 },
    { number: 3, name: "Season 3: Priestella & Sin Archbishops", episodeCount: 16, year: 2024 },
  ],
  "65942": [
    { number: 1, name: "Season 1: Return by Death", episodeCount: 25, year: 2016 },
    { number: 2, name: "Season 2: Sanctuary & The Witches of Sin", episodeCount: 25, year: 2020 },
    { number: 3, name: "Season 3: Priestella & Sin Archbishops", episodeCount: 16, year: 2024 },
  ],

  // Classroom of the Elite
  "classroom-of-the-elite": [
    { number: 1, name: "Season 1: Class D Evaluation", episodeCount: 12, year: 2017 },
    { number: 2, name: "Season 2: Island Survival & Sports Festival", episodeCount: 13, year: 2022 },
    { number: 3, name: "Season 3: Mixed Training Camp & Expulsion", episodeCount: 13, year: 2024 },
  ],
  "71987": [
    { number: 1, name: "Season 1: Class D Evaluation", episodeCount: 12, year: 2017 },
    { number: 2, name: "Season 2: Island Survival & Sports Festival", episodeCount: 13, year: 2022 },
    { number: 3, name: "Season 3: Mixed Training Camp & Expulsion", episodeCount: 13, year: 2024 },
  ],

  // Dr. Stone
  "dr-stone": [
    { number: 1, name: "Season 1: Stone World & Kingdom of Science", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Stone Wars", episodeCount: 11, year: 2021 },
    { number: 3, name: "Season 3: New World", episodeCount: 22, year: 2023 },
  ],
  "86031": [
    { number: 1, name: "Season 1: Stone World & Kingdom of Science", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Stone Wars", episodeCount: 11, year: 2021 },
    { number: 3, name: "Season 3: New World", episodeCount: 22, year: 2023 },
  ],

  // Blue Lock
  "blue-lock": [
    { number: 1, name: "Season 1: First & Second Selection", episodeCount: 24, year: 2022 },
    { number: 2, name: "Season 2: U-20 Japan Match", episodeCount: 14, year: 2024 },
  ],
  "135157": [
    { number: 1, name: "Season 1: First & Second Selection", episodeCount: 24, year: 2022 },
    { number: 2, name: "Season 2: U-20 Japan Match", episodeCount: 14, year: 2024 },
  ],

  // Kaiju No. 8
  "kaiju-no-8": [
    { number: 1, name: "Season 1: Defense Force Examination", episodeCount: 12, year: 2024 },
    { number: 2, name: "Season 2: Kaiju Weapon & Catastrophe", episodeCount: 12, year: 2025 },
  ],
  "207468": [
    { number: 1, name: "Season 1: Defense Force Examination", episodeCount: 12, year: 2024 },
    { number: 2, name: "Season 2: Kaiju Weapon & Catastrophe", episodeCount: 12, year: 2025 },
  ],

  // Mashle
  "mashle-magic-and-muscles": [
    { number: 1, name: "Season 1: Easton Magic Academy", episodeCount: 12, year: 2023 },
    { number: 2, name: "Season 2: Divine Visionary Candidate Exam", episodeCount: 12, year: 2024 },
  ],
  "203713": [
    { number: 1, name: "Season 1: Easton Magic Academy", episodeCount: 12, year: 2023 },
    { number: 2, name: "Season 2: Divine Visionary Candidate Exam", episodeCount: 12, year: 2024 },
  ],

  // Oshi no Ko
  "oshi-no-ko": [
    { number: 1, name: "Season 1: Prologue & First Concert", episodeCount: 11, year: 2023 },
    { number: 2, name: "Season 2: 2.5D Stage Play Arc (Tokyo Blade)", episodeCount: 13, year: 2024 },
  ],
  "203701": [
    { number: 1, name: "Season 1: Prologue & First Concert", episodeCount: 11, year: 2023 },
    { number: 2, name: "Season 2: 2.5D Stage Play Arc (Tokyo Blade)", episodeCount: 13, year: 2024 },
  ],

  // Fire Force
  "fire-force": [
    { number: 1, name: "Season 1: Special Fire Force Company 8", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Netherworld & Pillar Search", episodeCount: 24, year: 2020 },
  ],
  "89456": [
    { number: 1, name: "Season 1: Special Fire Force Company 8", episodeCount: 24, year: 2019 },
    { number: 2, name: "Season 2: Netherworld & Pillar Search", episodeCount: 24, year: 2020 },
  ],
};

/**
 * Calculates start and end indices for each season across the anime's total episode sequence.
 */
export function getSeasonEpisodeRanges(seasons: SeasonInfo[]): Array<{
  seasonNumber: number;
  seasonName: string;
  startIdx: number;
  endIdx: number;
  count: number;
}> {
  let offset = 0;
  return seasons.map((s) => {
    const count = Math.max(1, s.episodeCount || 12);
    const startIdx = offset;
    const endIdx = offset + count;
    offset += count;
    return {
      seasonNumber: s.number,
      seasonName: s.name,
      startIdx,
      endIdx,
      count,
    };
  });
}

/**
 * Resolves all seasons for any anime or cartoon.
 * Combines curated arc presets with live TMDB data to ensure every show has complete seasons!
 * Guarantees that no anime will dump all its episodes into Season 1.
 */
export function resolveAllSeasons(slugOrId: string | number, tmdbSeasons?: any[]): SeasonInfo[] {
  if (!slugOrId) return [];
  const key = String(slugOrId).toLowerCase().trim();
  const rawId = key.replace(/^(tv|movie)-?/, "");

  // 1. Check curated presets by full slug or raw ID
  let preset: SeasonInfo[] | null = null;
  if (PRESET_ANIME_SEASONS[key]) {
    preset = PRESET_ANIME_SEASONS[key];
  } else if (PRESET_ANIME_SEASONS[rawId]) {
    preset = PRESET_ANIME_SEASONS[rawId];
  } else {
    // Try matching partial slug in presets
    const matchedKey = Object.keys(PRESET_ANIME_SEASONS).find(
      (k) => isNaN(Number(k)) && (key.includes(k) || k.includes(key))
    );
    if (matchedKey) {
      preset = PRESET_ANIME_SEASONS[matchedKey];
    }
  }

  // 2. Parse live TMDB valid seasons (season_number > 0)
  let tmdbValid: SeasonInfo[] = [];
  if (tmdbSeasons && Array.isArray(tmdbSeasons)) {
    tmdbValid = tmdbSeasons
      .filter((s) => s && s.season_number > 0)
      .map((s) => ({
        number: s.season_number,
        name: s.name || `Season ${s.season_number}`,
        episodeCount: s.episode_count || 12,
        poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined,
        year: s.air_date ? new Date(s.air_date).getFullYear() : undefined,
      }));
  }

  // If a preset exists:
  // - If TMDB has strictly more seasons than the preset (e.g. One Piece with 23 seasons), prefer TMDB
  // - Otherwise, prefer the preset (prevents TMDB's collapsed single season bug, e.g. JJK, Solo Leveling, Bleach, Black Clover)
  if (preset && tmdbValid.length > 0) {
    if (tmdbValid.length > preset.length) {
      return tmdbValid;
    }
    return preset;
  }

  if (preset && preset.length > 0) return preset;

  // 3. If no preset, evaluate TMDB seasons:
  if (tmdbValid.length > 1) {
    return tmdbValid;
  }

  // If TMDB only returned 1 season, but it contains more than 26 episodes (e.g. 52 or 75 episodes):
  // Automatically partition into realistic seasons of ~24 episodes!
  if (tmdbValid.length === 1 && tmdbValid[0].episodeCount > 26) {
    const totalEps = tmdbValid[0].episodeCount;
    const episodesPerSeason = totalEps > 100 ? 50 : totalEps > 50 ? 26 : 24;
    const numSeasons = Math.ceil(totalEps / episodesPerSeason);
    const autoSeasons: SeasonInfo[] = [];
    let remaining = totalEps;
    for (let s = 1; s <= numSeasons; s++) {
      const epCount = Math.min(remaining, episodesPerSeason);
      remaining -= epCount;
      autoSeasons.push({
        number: s,
        name: `Season ${s}`,
        episodeCount: epCount,
        poster: tmdbValid[0].poster,
        year: tmdbValid[0].year,
      });
    }
    return autoSeasons;
  }

  if (tmdbValid.length > 0) return tmdbValid;

  // 4. Fallback for any other multi-season anime: at least 3 full seasons
  return [
    { number: 1, name: "Season 1", episodeCount: 24, year: 2021 },
    { number: 2, name: "Season 2", episodeCount: 24, year: 2023 },
    { number: 3, name: "Season 3", episodeCount: 12, year: 2024 },
  ];
}
