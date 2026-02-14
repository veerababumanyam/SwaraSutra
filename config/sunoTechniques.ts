
export const SUNO_TECHNIQUES = {
  structure: [
    { tag: "[Intro]", description: "Sets the mood. Instrumental or light atmospheric vocals." },
    { tag: "[Verse]", description: "Main storytelling section. Lower energy than chorus." },
    { tag: "[Pre-Chorus]", description: "Builds tension. Rising melody leading to the drop/chorus." },
    { tag: "[Chorus]", description: "The main hook. High energy, catchy, repetitive. The core message." },
    { tag: "[Hook]", description: "A short, earworm phrase repeated for impact." },
    { tag: "[Bridge]", description: "A shift in melody, tempo, or perspective. Emotional peak or twist." },
    { tag: "[Interlude]", description: "Instrumental break between sections." },
    { tag: "[Solo]", description: "Instrumental spotlight (Guitar, Sannai, Violin)." },
    { tag: "[Drop]", description: "High energy instrumental climax, common in EDM/Mass numbers." },
    { tag: "[Outro]", description: "Fading out or final conclusion." },
    { tag: "[End]", description: "A distinct, hard stop to the track." }
  ],
  performance: [
    { tag: "[Spoken]", description: "Clear spoken word, narration, or cinematic dialogue." },
    { tag: "[Whisper]", description: "Quiet, intimate, ASMR-style, or eerie vocals." },
    { tag: "[Shout]", description: "High volume, aggressive, rallying cry." },
    { tag: "[Scream]", description: "Extreme intensity, metal or horror vocal style." },
    { tag: "[Growl]", description: "Deep, guttural, aggressive texture." },
    { tag: "[Rap]", description: "Rhythmic spoken flow, fast-paced delivery." },
    { tag: "[Melodic]", description: "Singing with clear pitch and melody." },
    { tag: "[Announcer]", description: "Radio DJ or Stadium Announcer persona." }
  ],
  vocals: [
    { tag: "[Male]", description: "Male vocalist." },
    { tag: "[Female]", description: "Female vocalist." },
    { tag: "[Duet]", description: "Two singers interacting." },
    { tag: "[Choir]", description: "Large group, grand, church or epic feel." },
    { tag: "[Crowd]", description: "Unorganized group shouting or cheering." },
    { tag: "[Children]", description: "Kids chorus, innocent or creepy depending on context." },
    { tag: "[Robot]", description: "Vocoded, synthetic, sci-fi texture." }
  ],
  dynamics: [
    { tag: "[Build Up]", description: "Gradual increase in tempo, volume, or complexity." },
    { tag: "[Bass Drop]", description: "Sudden introduction of heavy bass." },
    { tag: "[Silence]", description: "Complete pause for dramatic tension." },
    { tag: "[Stop]", description: "Abrupt halt to music and vocals." },
    { tag: "[Fade Out]", description: "Gradual decrease in volume at the end." },
    { tag: "[Pause]", description: "Short rhythmic break." }
  ],
  styling_rules: [
    "VOLUME CONTROL: Use UPPERCASE for lines that must be sung LOUD or SHOUTED (e.g., 'I AM THE FIRE').",
    "BACKGROUND VOCALS: Use (Parentheses) for echoes, ad-libs, or response vocals (e.g., 'Don't go (Don't go)').",
    "NO REPEAT TAGS: Never write '[Repeat Chorus]'. Always write out the full lyrics of the repeated section.",
    "TAG PLACEMENT: Place structural tags like [Verse] on their own line before the lyrics start."
  ]
};
