
export const CULTURAL_RULES = {
  TELUGU: {
    id: "TELUGU_SANKRANTI",
    persona: "Padha-Silpi (The Word Sculptor) - Legendary Telugu Sahitya Rachayitha.",
    dialects: {
      GODAVARI: {
        label: "Godavari Yaasa",
        flavor: "Sweet, respectful, musical, elongated vowels.",
        markers: ["andi", "vachinandira", "alludu garu", "ekkada nundi"],
        slang: "Earthy but polite."
      },
      TELANGANA: {
        label: "Telangana Yaasa",
        flavor: "Rustic, high-energy, raw, sharp consonants.",
        markers: ["bi-da", "gummadi", "yeyyunri", "polaalu", "duppati"],
        slang: "Direct and rhythmic."
      }
    },
    subStructures: {
      HARIDASU: {
        label: "Haridasu (Philosophical & Devotional)",
        description: "Utsava vs Satya contrast. Chanting style Keerthana format.",
        keywords: ["Dhanurmasam", "Narada", "Akshaya Patra", "Vishnu", "Vaikuntham", "Paramapadam", "Harilo Ranga"],
        meter: "Adi Taalam (8 beats) - Slow, Meditative Chanting",
        rules: "Inject philosophical metaphors about the transient nature of wealth vs the harvest's joy."
      },
      GOBBEMMA: {
        label: "Gobbemma (Rhythmic Folk Ritual)",
        description: "Call-and-reponse rhythmic folk. Women's circle celebration around the Rangoli.",
        keywords: ["Subbi Gobbemma", "Rangavalli", "Muggulu", "Dhaanyalakshmi", "Family Welfare"],
        rhymeConstraint: "Lines must end in repetitive hooks like 'amma' or 'yalo'.",
        meter: "6/8 Folk Rhythm - Bouncy and Cyclical",
        rules: "Focus on themes of abundance, seeking good husbands, and domestic peace."
      },
      ALLUDU: {
        label: "Alludu Teasing (Satirical & Playful Roast)",
        description: "Playful roast of the son-in-law's demands, laziness, or appetite.",
        keywords: ["Ariselu", "Kodi Pandem", "Lazy", "USA Alludu", "Katnam", "Vindhu", "Mancham"],
        meter: "Fast Teenmaar / Dappu Beat - Syncopated and Cheeky",
        rules: "Strict focus on satire. Use 'roast' logic. If Godavari: tease about Ariselu. If Telangana: tease about laziness."
      }
    },
    linguisticRules: {
      prasa: "MANDATORY: Dvitiyakshara Prasa (Rhyming the 2ND letter of every line in a stanza).",
      yati: "Ensure rhythmic pauses (Yati) at the line mid-point matching the opening sound.",
      purity: "Zero-tolerance for English-Telugu syntax. Use pure Karta-Karma-Kriya order."
    }
  },
  TAMIL: {
    id: "TAMIL_PONGAL",
    persona: "Veeram (Valor) & Mannu (Soil) focused Madurai/Theni region writer.",
    subStructures: {
      JALLIKATTU: {
        label: "Jallikattu (Veeram/Valor Focus)",
        description: "Ancient bull-embracing sport celebrating man's bravery and bull's strength.",
        keywords: ["Vadivasal", "Thimiru", "Kombu", "Vadachira", "Kaalai", "Veeram", "Kattumayam", "Sandai"],
        meter: "Fast 'Thara Thappattai' (8/8 or 4/4 Syncopated)",
        onomatopoeia: ["Gumukku gumukku", "Tanakku nakku", "Hoi hoi"],
        rules: "Focus on the bond between the soil (Mannu) and the bull. Celebrate the pride (Thimiru) of the horns (Kombu). High intensity."
      },
      MATTU_PONGAL: {
        label: "Mattu Pongal (Gratitude/Mannu Focus)",
        description: "Thanksgiving for cattle and the Sun God for a successful harvest.",
        keywords: ["Suryan", "Maadu", "Manjal", "Karumbu", "Pongalo Pongal", "Uzhavor", "Vesti", "Nandri"],
        meter: "Medium 'Gramiya' Folk (6/8 or 3/4 Swing)",
        rules: "Theme of Gratitude (Nandri). Emphasize the sanctity of Turmeric (Manjal) and Sugarcane (Karumbu). Focus on the Sun God (Suryan)."
      }
    },
    linguisticRules: {
      slang: "Madurai/Theni regional earthy slang (Desi Tamil).",
      purity: "Avoid 'Tanglish'. Use classical poetic terms mixed with rustic folk vocabulary.",
      structure: "Prefer 'Ethukai' (2nd letter rhyme) for Folk/Gaana styles."
    },
    musicality: {
      rhythm: "Thara Thappattai",
      percussion: "Heavy Parai and Urumi focus.",
      onomatopoeia: ["Gumukku gumukku", "Tanakku nakku", "Adra adra"]
    }
  },
  KANNADA: {
    id: "KANNADA_SANKRANTHI",
    persona: "Gentle, melodic, community-focused Janapada (Folk) writer.",
    subStructures: {
      ELLU_BELLA: {
        label: "Ellu Bella (Sharing Sweetness)",
        description: "The ritual of exchanging sesame/jaggery to sweeten relationships.",
        keywords: ["Ellu Bella", "Sakkare Acchu", "Kabboo", "Beelu", "Kicchu Haisodu", "Olle Maathu"],
        meter: "Janapada (Bouncy Folk) or Soft Melody",
        rules: "Every song MUST contain the proverb: 'Ellu bella thindu olle maathu aadu'. Focus on patching up rivalries and community bonding."
      }
    },
    linguisticRules: {
      purity: "Simple, everyday Kannada with Janapada flavor.",
      structure: "Simple 4-line stanzas."
    },
    musicality: {
      rhythm: "Janapada (Bouncy Folk)",
      tone: "Soft, warm, melodic"
    }
  },
  MALAYALAM: {
    id: "MALAYALAM_MAKARAVILAKKU",
    persona: "Bhakti-Kavi (Devotional Poet) - Focus on Sopanam and Temple traditions.",
    criticalGuardrail: "STRICTLY FORBIDDEN: Do not mix Harvest Festival (Pongal/Sankranti) themes like dancing/farming with Makaravilakku. This is a forest pilgrimage context.",
    subStructures: {
      MAKARAVILAKKU: {
        label: "Makaravilakku (Divine Light)",
        description: "The holy sighting of the flame at Ponnambalamedu and the pilgrimage.",
        keywords: ["Makara Jyothi", "Sabarimala", "Saranam Ayyappa", "Manikandan", "Thathwamasi", "Pampa", "Irumudi", "Pathinettampadi"],
        meter: "Sopanam (Slow, Meditative) or Chenda (Escalating)",
        rules: "Absolute focus on Spirituality. Use Manipravalam style. PROHIBITED: Harvest/Farming references."
      }
    },
    linguisticRules: {
      style: "Manipravalam (Blend of Malayalam and Sanskrit).",
      purity: "High. Avoid slang."
    },
    musicality: {
      rhythm: "Chenda (Percussion) or Sopanam (Temple Beat).",
      tone: "Meditative to Ecstatic."
    }
  }
};
