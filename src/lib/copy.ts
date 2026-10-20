export const TAGLINES: Record<string, string> = {
  "demon-slayer-kimetsu-no-yaiba": "It is the bond between Tanjiro and Nezuko that can never be severed.",
  "attack-on-titan": "If you win, you live. If you lose, you die. If you don't fight, you can't win!",
  "jujutsu-kaisen": "Cursed energy flows where negative emotions gather.",
  "chainsaw-man": "He gave his heart to a chainsaw devil.",
  "spy-x-family": "A spy, an assassin, and a telepath walk into a school.",
  "death-note": "The human whose name is written in this note shall die.",
  "hunter-x-hunter": "To find what you seek, you must become a Hunter.",
  "my-hero-academia": "You too can become a hero.",
  "neon-genesis-evangelion": "Man fears the darkness, and so he scrapes away at the edges with fire.",
  "your-name": "Treasure the experience. Dreams fade away after you wake up.",
};

export const EPISODE_OVERVIEWS: Record<string, string[]> = {
  "demon-slayer-kimetsu-no-yaiba": [
    "Tanjiro returns home to find his family slaughtered by a demon and Nezuko transformed.",
    "Tanjiro and Nezuko head toward Mt. Sagiri under Giyu Tomioka's instruction.",
    "Tanjiro trains relentlessly for two years under Urokodaki to prepare for the Final Selection.",
    "On Mt. Fujikasane, Tanjiro faces the Hand Demon to survive the Final Selection.",
    "Tanjiro crafts his Nichirin blade and receives his first assignment as a demon slayer.",
    "Tanjiro travels to a town where young girls are mysteriously disappearing every night.",
    "In Asakusa, Tanjiro catches a distinctive scent: Muzan Kibutsuji, the progenitor of all demons.",
    "Lady Tamayo and Yushiro aid Tanjiro in understanding demon biology and curing Nezuko.",
  ],
  "attack-on-titan": [
    "A peaceful day turns into an inferno when the Colossal Titan kicks down Wall Maria.",
    "Eren, Mikasa, and Armin witness their world collapse as refugees flee to Wall Rose.",
    "Five years later, Eren enlists in the 104th Training Corps to reclaim humanity's pride.",
    "Graduation night turns to dread when lightning strikes again behind Eren.",
    "The 104th is thrown into sudden combat in the Trost District with catastrophic casualties.",
    "Mikasa confronts her despair when rumor of Eren's fall spreads across the vanguard.",
  ],
};

export function getTagline(slug: string): string | null {
  return TAGLINES[slug] ?? null;
}

export function getEpisodeOverview(slug: string, ep: number): string | null {
  return EPISODE_OVERVIEWS[slug]?.[ep - 1] ?? null;
}
