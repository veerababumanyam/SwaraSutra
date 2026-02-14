







export interface CeremonyDefinition {
  id: string;
  label: string;
  promptContext: string;
  defaultMood: string;
  suggestedKeywords: string[];
  defaultStyle: string;
  defaultSinger: string;
  defaultComplexity: "Simple" | "Poetic" | "Complex" | "Classical/Grandhika" | "Toddler (0-3 yrs)" | "Kids (4-8 yrs)" | "Viral Hook (Punchy)";
  defaultRhyme: string;
}

export interface CategoryDefinition {
  id: string;
  label: string;
  events: CeremonyDefinition[];
}

export const SCENARIO_KNOWLEDGE_BASE: CategoryDefinition[] = [
  {
    id: "social_shorts",
    label: "Social Media / Shorts",
    events: [
      {
        id: "viral_life_hack",
        label: "Viral Life Hack / Tip",
        promptContext: "Context: A 40-second viral reel. 0-5s: 'Did you know?' Hook. 5-20s: The Problem explanation. 20-35s: The Solution (Payoff). 35-40s: 'Follow for more'. Catchy, fast, rhythmic.",
        defaultMood: "Viral / Attention Grabbing",
        suggestedKeywords: ["Secret", "Hack", "Problem", "Solution", "Magic", "Easy", "Try This"],
        defaultStyle: "Electronic/EDM",
        defaultSinger: "Male Rap",
        defaultComplexity: "Viral Hook (Punchy)",
        defaultRhyme: "AABB"
      },
      {
        id: "mini_story_time",
        label: "Mini Story Time",
        promptContext: "Context: A 40-second emotional rollercoaster. 0-5s: 'I almost died today...'. 5-20s: The incident details. 20-35s: The Twist/Lesson. 35-40s: Question to audience.",
        defaultMood: "Mysterious",
        suggestedKeywords: ["Story", "Scary", "Funny", "Lesson", "Twist", "Wait for it"],
        defaultStyle: "Lo-Fi/Chill",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "Free Verse"
      },
      {
        id: "motivational_clip",
        label: "Motivational 40s Clip",
        promptContext: "Context: High energy pump-up. 0-5s: 'Stop scrolling!'. 5-20s: Why you are failing (The Pain). 20-35s: The Mindset Shift (The Glory). 35-40s: 'Get up now!'.",
        defaultMood: "Inspirational",
        suggestedKeywords: ["Grind", "Hustle", "Pain", "Glory", "Wake Up", "Win"],
        defaultStyle: "Anthem",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "kids_viral_zone",
    label: "Kids & Viral Rhymes",
    events: [
      {
        id: "baby_shark_viral",
        label: "The Viral Family (Shark Style)",
        promptContext: "Context: Based on the 16B+ view 'Baby Shark' structure. MUST use Suno Tags for structure. 1. [Intro] Family (Baby, Mommy...). 2. [Verse: Hunt] (Let's Go Hunt). 3. [Bridge: Tempo Up] (Run Away). 4. [Verse: Safe] (Safe at Last). 5. [Outro: Celebration] (It's the End). Viral Formula: Accelerating Tempo + Hand Gestures.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Baby", "Mommy", "Daddy", "Grandpa", "Hunt", "Run Away", "Safe", "Happy"],
        defaultStyle: "Kids Pop",
        defaultSinger: "Child Vocals",
        defaultComplexity: "Toddler (0-3 yrs)",
        defaultRhyme: "AAAA"
      },
      {
        id: "surprise_naughty",
        label: "The Naughty Surprise (Johnny Johnny)",
        promptContext: "Context: A call-and-response between a parent and a child who is doing something naughty (eating sugar/mud) but cute. Viral Formula: Suspense -> Lie -> Truth -> Laughter (Ha Ha Ha). Use [Spoken] tags for dialogue.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Eating", "Sugar", "No Papa", "Telling Lies", "Open Mouth", "Ha Ha Ha"],
        defaultStyle: "Nursery Rhyme",
        defaultSinger: "Duet",
        defaultComplexity: "Toddler (0-3 yrs)",
        defaultRhyme: "AABB"
      },
      {
        id: "motor_skills_action",
        label: "Action Song (Wheels on Bus)",
        promptContext: "Context: A song designed to make kids move. Instructions must be clear: 'Clap hands', 'Stomp feet', 'Turn around'. Viral Formula: Physical engagement + Onomatopoeia (Swish Swish, Beep Beep). Use [Action] tags.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Clap", "Jump", "Spin", "Up", "Down", "Round and Round", "Beep Beep"],
        defaultStyle: "Kids Pop",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Toddler (0-3 yrs)",
        defaultRhyme: "AABB"
      },
      {
        id: "phonics_learning",
        label: "Phonics & Learning (A for Apple)",
        promptContext: "Context: Educational but catchy. Associating letters or numbers with objects. Rhythmic chanting. Viral Formula: Alliteration + Visual associations.",
        defaultMood: "Happy",
        suggestedKeywords: ["Apple", "Ball", "Cat", "Dog", "One", "Two", "Red", "Blue"],
        defaultStyle: "Nursery Rhyme",
        defaultSinger: "Female Solo",
        defaultComplexity: "Kids (4-8 yrs)",
        defaultRhyme: "AABB"
      },
      {
        id: "bedtime_lullaby",
        label: "Soothing Lullaby (Chanda Mama)",
        promptContext: "Context: Putting the baby to sleep. Moon, stars, clouds, dreams. Soft, slow tempo, whispering vocals. Viral Formula: Repetitive comforting phrases + Warmth.",
        defaultMood: "Peaceful",
        suggestedKeywords: ["Sleep", "Moon", "Stars", "Dream", "Hush", "Baby", "Night"],
        defaultStyle: "Lullaby",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "animal_sounds",
        label: "Animal Sounds (Old MacDonald)",
        promptContext: "Context: Visiting a farm or jungle. Focus on distinct animal sounds. Viral Formula: Cumulative memory game + Funny sounds (Moo, Quack, Roar). Use [Sound Effect] tags.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Farm", "Cow", "Moo", "Duck", "Quack", "Jungle", "Lion", "Roar"],
        defaultStyle: "Folk",
        defaultSinger: "Male Solo",
        defaultComplexity: "Toddler (0-3 yrs)",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "motivation_success",
    label: "Motivation & Success",
    events: [
      {
        id: "sports_anthem",
        label: "Sports & Training Anthem",
        promptContext: "Context: The training montage. Waking up at 4 AM, sweating in the gym, running on tracks. Pain is temporary, glory is forever. High energy, percussion-heavy, adrenaline-pumping.",
        defaultMood: "Inspirational",
        suggestedKeywords: ["Sadhana", "Guri", "Lakshyam", "Gelupu", "Sweadam", "Ragaluthunna", "Agni", "Power"],
        defaultStyle: "Anthem",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "underdog_rise",
        label: "Underdog Victory",
        promptContext: "Context: Rising from the ashes. He was mocked, poor, and beaten down. Now he stands tall. Revenge through success. Powerful, emotional, building up tempo.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Kinda Nunchi", "Simham", "Edhugu", "Debba", "Kasi", "Samrajyam", "Rebel"],
        defaultStyle: "Rock",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "dream_chaser",
        label: "Chasing Dreams",
        promptContext: "Context: A starry-eyed youth moving to the big city (Hyderabad/Chennai/Mumbai) to make it big in films or business. Hopeful, energetic, montage of struggles and small wins.",
        defaultMood: "Inspirational",
        suggestedKeywords: ["Cinema", "City", "Kalalu", "Parugu", "Aasha", "Star", "Journey"],
        defaultStyle: "Pop Rock",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "women_empowerment",
        label: "Women Empowerment",
        promptContext: "Context: Breaking shackles. Modern woman rising against patriarchy or obstacles. Fearless, divine feminine energy (Kali/Durga vibes) or Corporate Boss Lady.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Shakti", "Aadadhi", "Gontu", "Marp", "Swatantram", "Rani", "Durga", "Nari"],
        defaultStyle: "Anthem",
        defaultSinger: "Female Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "career_struggle",
        label: "Career & Exam Struggle",
        promptContext: "Context: The student's war. Sleepless nights, books, pressure, parents' dreams. The hunger to achieve a rank or job. Serious and focused.",
        defaultMood: "Philosophical",
        suggestedKeywords: ["Pustakam", "Nidra", "Kala", "Bhavishyathu", "Rank", "Parugu", "Gamyam"],
        defaultStyle: "Pop Rock",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "friendship_nostalgia",
    label: "Friendship & Nostalgia",
    events: [
      {
        id: "class_reunion",
        label: "Class Reunion",
        promptContext: "Context: Meeting school/college friends after 10-20 years. Gray hair, different jobs, but same old laughter. Reliving classroom memories, crushes, and punishments. Bittersweet joy. Style: Melodic Acoustic.",
        defaultMood: "Nostalgic",
        suggestedKeywords: ["Gnapakam", "Classroom", "Bench", "Teacher", "Signature", "Old Photo", "Time Machine"],
        defaultStyle: "Acoustic Melody",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "childhood_friends",
        label: "Childhood Friends (Chaddi Dost)",
        promptContext: "Context: Friends since kindergarten. Playing cricket in gullies, stealing mangoes, sharing tiffin. Pure innocence and lifelong bond. Style: Playful Folk.",
        defaultMood: "Happy",
        suggestedKeywords: ["Chaddi Dost", "Gully Cricket", "Donga Police", "Cycle", "Ice Cream", "Balyam"],
        defaultStyle: "Folk/Pop Mix",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "bestie_bond",
        label: "Best Friends Forever",
        promptContext: "Context: The one friend who knows everything. Late night calls, relationship advice, support system. 'Tera Yaar Hoon Main' vibes. Style: Emotional Ballad.",
        defaultMood: "Emotional",
        suggestedKeywords: ["Pranam", "Thodu", "Secret", "Partner in Crime", "Soulmate", "Dosth"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "hostel_life",
        label: "Hostel Life Diaries",
        promptContext: "Context: Life in the hostel. Bad food, borrowing soaps, night outs, warden trouble, room fights. Chaotic fun and freedom.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Mess Food", "Warden", "Roommate", "Night Out", "Maggi", "Exam Night"],
        defaultStyle: "Pop Rock",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "cinematic_tropes",
    label: "Cinematic Tropes (Action)",
    events: [
      {
        id: "hero_intro",
        label: "Hero Entry",
        promptContext: "Context: The protagonist arrives. High elevation. Dust storm, slow-motion, roaring crowds. Focus on power, lion/tiger metaphors, and changing the era. Style: Mass Beat, High Energy.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Simham", "Puli", "Thunder", "Sensation", "Ruler", "Sahanam", "Rebel", "Box Office"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Male Solo",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      },
      {
        id: "revenge_paga",
        label: "Revenge Anthem",
        promptContext: "Context: The hero takes a vow of revenge after a tragedy. Intense, blood-boiling, darker emotion. Sharp, violent metaphors about fire and blood. High tempo rock fusion.",
        defaultMood: "Angry (Raudra)",
        suggestedKeywords: ["Paga", "Prathikaram", "Raktham", "Shapadham", "Agni", "Samharam", "Head", "Hunt"],
        defaultStyle: "Rock/Metal",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "don_gangster",
        label: "Gangster Theme",
        promptContext: "Context: The rise of the underworld kingpin. Stylish, slow-motion, sunglasses, cigars. Fear and respect from the city. 'Bhaai' vibes with electronic/trap beats.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Bhaai", "Don", "Hukum", "Power", "City", "Salaam", "Gun", "Sarkar"],
        defaultStyle: "Electronic/Trap",
        defaultSinger: "Male Rap",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "villain_theme",
        label: "Villain Theme",
        promptContext: "Context: Dark, brooding, intimidating presence. Focus on shadow, ruthlessness, and an impending storm. Heavy bass, echoing vocals.",
        defaultMood: "Angry (Raudra)",
        suggestedKeywords: ["Cheekati", "Prabhanjanam", "Fear", "Eclipse", "Rakshasa", "Samharam", "Yama"],
        defaultStyle: "Techno/Industrial",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "Free Verse"
      },
      {
        id: "interval_bang",
        label: "Interval Twist",
        promptContext: "Context: The turning point of the film. High tension, shocking truth revealed, hero/villain face-off. Escalating percussion. A cliffhanger moment.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Nijam", "Kshanam", "Yuddham", "Samayam", "Viswaroopam", "Jagratha"],
        defaultStyle: "Anthem",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      },
      {
        id: "climax_sacrifice",
        label: "Climax Sacrifice",
        promptContext: "Context: The hero or key character sacrifices themselves for the greater good. Highly emotional, epic, orchestral. Tears and pride mixed.",
        defaultMood: "Triumphant",
        suggestedKeywords: ["Amaram", "Swasam", "Raktham", "Charitra", "Maranam", "Gelupu"],
        defaultStyle: "Anthem",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "police_cop",
        label: "Cop Theme",
        promptContext: "Context: Honest or Ruthless police officer. Sirens, duty, khaki uniform, cleaning up the system. Fast paced, aggressive.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Khaki", "Duty", "Siren", "Encounter", "System", "Dhummu"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "romance_tropes",
    label: "Romance",
    events: [
      {
        id: "proposal_love",
        label: "The Proposal",
        promptContext: "Context: Nervous hero trying to confess feelings. Stuttering, heart beating loud, friends hiding and prompting him. Cute, innocent, momentous. Can be comedic or sincere.",
        defaultMood: "Romantic (Shringara)",
        suggestedKeywords: ["Cheppalenu", "Bhayam", "I Love You", "Gunde", "Dairyam", "Rose", "Yes"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "dream_duet",
        label: "Dream Duet",
        promptContext: "Context: Sudden shift to a foreign location (Swiss Alps/Grand Canyon). Surreal costumes, floating in air. Gravity-defying romance. Pure fantasy and visual grandeur. Hero and Heroine singing about eternal love.",
        defaultMood: "Romantic (Shringara)",
        suggestedKeywords: ["Aakasam", "Chandamama", "Paravasam", "Swargam", "Devatha", "Kalala", "Angel", "Seven Wonders"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "ego_clash",
        label: "Ego Battle",
        promptContext: "Context: Hero and Heroine start off hating each other or in a competition. Trading witty insults, showing attitude. 'Nuvva Nena' (You vs Me) dynamic. Playful rivalry.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Pogaru", "Thimiru", "Pantham", "Challenge", "Mondi", "Queen", "King", "War"],
        defaultStyle: "Folk/Pop Mix",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "heroine_intro",
        label: "Heroine Intro",
        promptContext: "Context: First appearance of the female lead. Breezy, colorful, surrounded by nature or friends. Establishing her as either an 'Angel' or a 'Modern Diva'.",
        defaultMood: "Happy",
        suggestedKeywords: ["Angel", "Butterfly", "Andham", "Soku", "Merupu", "Colourful", "Swapnam"],
        defaultStyle: "Melody",
        defaultSinger: "Female Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "first_sight",
        label: "Love at First Sight",
        promptContext: "Context: The moment the hero sees the heroine. Time stops. Wind blows. Orchestral swells. Pure magic.",
        defaultMood: "Romantic (Shringara)",
        suggestedKeywords: ["Magic", "Eyes", "Wind", "Destiny", "Tholakari", "Kala", "Paravasam"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "teasing_banter",
        label: "Teasing & Flirting",
        promptContext: "Context: Playful teasing between hero and heroine. Witty comebacks, chasing, slightly naughty but harmless. Street style or College backdrop.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Gilli", "Kajal", "Kurradu", "Pilla", "Nakkilu", "Signal", "Line", "Tingari"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "soup_song",
        label: "Heartbreak Anthem",
        promptContext: "Context: 'Soup Song' style. Playful sorrow. Drinking with friends, complaining about modern love and heartbreaks. Satirical and catchy. Rhythm: Mid-tempo folk/pop.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Breakup", "Mandhu", "Gundey", "Devadasu", "Whatsapp", "Katnam", "Love Failure", "Darling"],
        defaultStyle: "Folk/Pop Mix",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "one_side_love",
        label: "One-Sided Love",
        promptContext: "Context: Silent suffering. Loving from a distance. Pain of not being able to express. Melancholic and deep.",
        defaultMood: "Sad (Pathos)",
        suggestedKeywords: ["Mounam", "Dhooram", "Need", "Cheppaleni", "Gunde Chappudu"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "travel_nature",
    label: "Travel & Nature",
    events: [
      {
        id: "road_trip",
        label: "Road Trip",
        promptContext: "Context: Friends on bikes or open-top jeep. Wind in hair, highway stretching endlessly. Freedom, youth, no worries. Breezy and acoustic.",
        defaultMood: "Happy",
        suggestedKeywords: ["Rahadari", "Gali", "Sneham", "Dhooram", "Chakra", "Parugu", "Zindagi"],
        defaultStyle: "Pop",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "solo_wanderer",
        label: "Solo Wanderer",
        promptContext: "Context: The hero exploring the world alone. Backpack, mountains, forests. Searching for oneself. Spiritual yet adventurous. Finding peace in solitude.",
        defaultMood: "Peaceful",
        suggestedKeywords: ["Ontari", "Prapancham", "Aanandam", "Kondalu", "Nadhi", "Vethuku", "Traveler"],
        defaultStyle: "World Fusion",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "dance_energy",
    label: "Dance & Energy",
    events: [
      {
        id: "item_song",
        label: "Party Special",
        promptContext: "Context: Item Song style. Glitzy party number. Catchy hooks, double-meaning metaphors (optional but rhythmic), high-energy dance cues. Seductive but rhythmic.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Jathara", "Bling", "Step-u", "Rangu", "Chinnadana", "Kalkandu", "Bottle", "Kirrak"],
        defaultStyle: "Electronic/EDM",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "kuthu_song",
        label: "Street Dance",
        promptContext: "Context: Raw, rustic street dance. Teenmaar or Dappu beat. Local slang, celebrating a local festival or just joy. Very high tempo.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Dappu", "Teenmaar", "Mass", "Chindhu", "Oora Mass", "Whistle"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "sangeet_dance",
        label: "Wedding Sangeet",
        promptContext: "Context: Family dance battle. Groom side vs Bride side. Fun, colorful, teasing, mashup of styles. Bollywood influence.",
        defaultMood: "Happy",
        suggestedKeywords: ["Nachore", "Dhol", "Baraat", "Hungama", "Dance", "Jodi"],
        defaultStyle: "Pop",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "club_banger",
        label: "Club Banger",
        promptContext: "Context: Modern nightlife. Neon lights, DJ music, bass drops. Youth having fun, losing control, living for the weekend. Very modern slang.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Party", "Music", "Bass", "Night", "Vibe", "Cheers", "Weekend"],
        defaultStyle: "Electronic/EDM",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "horror_thriller",
    label: "Thriller & Action",
    events: [
       {
           id: "cat_mouse_chase",
           label: "The Hunt",
           promptContext: "Context: Hero hunting the villain or vice versa. High stakes, brain games, traps. Fast paced, suspenseful. Montage of investigation and tracking.",
           defaultMood: "Mysterious",
           suggestedKeywords: ["Veta", "Trap", "Target", "Lock", "Key", "Game", "Shadow", "Run"],
           defaultStyle: "Electronic/EDM",
           defaultSinger: "Male Solo",
           defaultComplexity: "Simple",
           defaultRhyme: "AABB"
       },
       {
           id: "horror_theme",
           label: "Horror Theme",
           promptContext: "Context: Eerie silence, creeping shadows, broken dolls. A ghost's presence. Whispers, screams, sudden loud bangs. Dark and atmospheric.",
           defaultMood: "Fear/Horror",
           suggestedKeywords: ["Dheyyam", "Cheekati", "Arupu", "Raktham", "Need", "Maranam", "Nishabdham"],
           defaultStyle: "Dark/Ambient",
           defaultSinger: "Female Solo",
           defaultComplexity: "Simple",
           defaultRhyme: "Free Verse"
       },
       {
           id: "detective_hunt",
           label: "Detective Mystery",
           promptContext: "Context: Solving a crime. Fast paced thinking, clues, chasing a suspect in a rainy night. Jazz noir or fast techno influence. Cerebral.",
           defaultMood: "Mysterious",
           suggestedKeywords: ["Veta", "Aachuki", "Nijam", "Mask", "Game", "Puzzle", "Shadow"],
           defaultStyle: "Jazz",
           defaultSinger: "Male Rap",
           defaultComplexity: "Complex",
           defaultRhyme: "AABB"
       }
    ]
  },
  {
    id: "family_sentiment",
    label: "Family Sentiment",
    events: [
      {
        id: "mother_sentiment",
        label: "Mother's Love",
        promptContext: "Context: Deep emotional bond. Flashback to childhood, sacrifice, and unconditional love. The 'God on Earth' trope. Melodic and tear-jerking.",
        defaultMood: "Sad (Pathos)",
        suggestedKeywords: ["Amma", "Lali", "Deepam", "Kanneru", "Thyagam", "Devatha", "Janma"],
        defaultStyle: "Melody",
        defaultSinger: "Male/Female Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "father_sentiment",
        label: "Father's Struggle",
        promptContext: "Context: The silent struggle of a father. Often realized late by the son. Focus on his hidden tears, sweat, and being the 'Backbone' of the family. Respectful and heavy.",
        defaultMood: "Philosophical",
        suggestedKeywords: ["Nanna", "Bapu", "Appa", "Srama", "Gunde", "Aakasam", "Hero", "Baruvu"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "sister_sentiment",
        label: "Sister Sentiment",
        promptContext: "Context: Pure affection between brother and sister. Childhood memories, protection (Raksha), or the emotional farewell during her wedding.",
        defaultMood: "Melancholic",
        suggestedKeywords: ["Chelli", "Akka", "Thangachi", "Rakhi", "Pasam", "Bangaram", "Kaanuka"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "brother_sentiment",
        label: "Brother Sentiment",
        promptContext: "Context: Unbreakable bond between brothers. Shared blood, rivalry turned into loyalty, or sacrifice for one another.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Thammudu", "Anna", "Raktam", "Thodu", "Need", "Soldier"],
        defaultStyle: "Anthem",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "atta_sentiment",
        label: "Mother-in-Law Satire",
        promptContext: "Context: Playful rivalry or teasing between Son-in-law and Mother-in-law. Or sometimes deep respect. Usually folk/satirical context.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Atta", "Alludu", "Garam", "Marthandam", "Respect"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "grandparents_love",
        label: "Grandparents Love",
        promptContext: "Context: The pure love of grandparents. Bedtime stories, wrinkles showing experience, spoiling the grandkids. Nostalgic and warm.",
        defaultMood: "Peaceful",
        suggestedKeywords: ["Thatha", "Bamma", "Katha", "Chandamama", "Anubandham", "Muddhu"],
        defaultStyle: "Melody",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "rural_folk",
    label: "Rural & Folk",
    events: [
      {
        id: "village_politics",
        label: "Village Politics",
        promptContext: "Context: Satirical or serious take on village elders, panchayat decisions, and local elections. Earthy sarcasm, raw dialect.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Rachabanda", "Sarpanch", "Theerpu", "Ooru", "Rajakeeyam"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "farmer_anthem",
        label: "Farmer Anthem",
        promptContext: "Context: The backbone of the nation. Earthy, respectful, emotional. Focus on the plow, soil (Mannu), rain, and the hardship of farming.",
        defaultMood: "Philosophical",
        suggestedKeywords: ["Rytu", "Nagali", "Mannu", "Varsham", "Panta", "Annadatha", "Sweadam"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "rain_song",
        label: "Rain Song",
        promptContext: "Context: First rain of the season. Romantic or joyful. Peacocks dancing, wet soil smell (Mrittika), greenery. Cinematic visuals.",
        defaultMood: "Romantic (Shringara)",
        suggestedKeywords: ["Varsham", "Chinuku", "Mabbulu", "Nemali", "Thadi", "Matti Vasana"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "bonalu_jathara",
        label: "Fierce Folk Festival",
        promptContext: "Context: Telangana/Rural festival worshiping the Mother Goddess (Yellamma/Poshamma). Trance, drums, raw energy, turmeric, neem leaves.",
        defaultMood: "Devotional (Bhakti)",
        suggestedKeywords: ["Amma", "Bonam", "Saka", "Vepa Aku", "Shivasatthulu", "Pothuraju"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "festivals_desi",
    label: "Indian Festivals",
    events: [
      {
        id: "ganesh_nimajjanam",
        label: "Ganesh Chaturthi",
        promptContext: "Context: The Grand Immersion Procession. Mumbai/Hyderabad street style. High-energy 'Teenmaar' or 'Nashik Dhol'. Colors (Gulal), dancing in the rain, chanting 'Ganpati Bappa Morya'. Emotional farewell + High Energy.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Ganpati Bappa", "Morya", "Nimajjanam", "Laddu", "Boondi", "Jai Bolo", "Dhol", "Visarjan"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "diwali_lights",
        label: "Diwali Festival",
        promptContext: "Context: Festival of Lights. Victory of light over darkness. Lighting Diyas, fireworks (Pataka), family reunion, Lakshmi Puja. Can be Melodious (Family) or Anthem (Victory).",
        defaultMood: "Happy",
        suggestedKeywords: ["Deepam", "Velugu", "Lakshmi", "Pataka", "Dhamaka", "Panduga", "Kanthi"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "holi_colors",
        label: "Holi Celebration",
        promptContext: "Context: Playful splashing of colors. Radha-Krishna flirting trope or friends going wild with 'Bhang'. High tempo, chaotic joy. 'Rang Barse' vibe.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Rangu", "Vasantham", "Holi", "Pichkari", "Bhang", "Jalandhar", "Chinnadana"],
        defaultStyle: "Folk/Pop Mix",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "eid_mubarak",
        label: "Eid Celebration",
        promptContext: "Context: Sighting the moon (Chand). Ending the fast. Brotherhood (Gale Lagna), sharing Biryani/Sheer Khurma. Sufi undertones or celebratory Qawwali.",
        defaultMood: "Happy",
        suggestedKeywords: ["Eid Mubarak", "Chand", "Bhaijaan", "Dua", "Dawat", "Gale Lag", "Ibadat"],
        defaultStyle: "Ghazal/Sufi",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "navratri_dandiya",
        label: "Navratri Garba",
        promptContext: "Context: Garba night. Rhythmic clinking of sticks (Dandiya). Colorful Chaniya Choli. Flirting through dance glances. High energy folk beat.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Dandiya", "Garba", "Dholida", "Devi", "Navaratri", "Gajjal", "Gol Gol"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "durga_puja_pujo",
        label: "Durga Puja",
        promptContext: "Context: The arrival of Ma Durga. The sound of 'Dhak' drums. Dhunuchi dance with fire. The emotional farewell (Sindoor Khela). Powerful, divine, and rhythmic.",
        defaultMood: "Devotional (Bhakti)",
        suggestedKeywords: ["Ma Durga", "Shakti", "Dhak", "Sindoor", "Mahishasura Mardini", "Devi", "Jaya"],
        defaultStyle: "Anthem",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      },
      {
        id: "ugadi_new_year",
        label: "New Year (Ugadi/Gudi Padwa)",
        promptContext: "Context: Telugu/Kannada/Marathi New Year. Eating 'Ugadi Pachadi' (Six Tastes of Life). Philosophical metaphor: Life is a mix of sweet, sour, and bitter.",
        defaultMood: "Philosophical",
        suggestedKeywords: ["Ugadi", "Pachadi", "Shadruchulu", "Vepa Puvvu", "Bella", "Kotha Jeevitham", "Swagatham"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "onam_kerala",
        label: "Onam Harvest",
        promptContext: "Context: Kerala's grand harvest festival. Pookalam (Flower rangoli), Vallam Kali (Boat Race), Sadya feast. Welcoming King Mahabali. Lush greenery.",
        defaultMood: "Happy",
        suggestedKeywords: ["Onam", "Pookalam", "Mahabali", "Vanchi Pattu", "Sadya", "Keralam", "Thumbi"],
        defaultStyle: "Folk",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "rakhi_purnima",
        label: "Raksha Bandhan",
        promptContext: "Context: The bond of protection. Sister tying the thread, brother promising safety. Emotional, sweet, and nostalgic.",
        defaultMood: "Melancholic",
        suggestedKeywords: ["Rakhi", "Dhaaga", "Anna", "Chelli", "Raksha", "Bandham", "Kaanuka"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "sankranti_haridasu",
        label: "Sankranti: Philosophical",
        promptContext: "Context: Wandering Haridasu singing about Lord Vishnu. Metaphors of the harvest being a divine gift. Chanting 'Harilo Ranga'. Meditative rhythm.",
        defaultMood: "Devotional",
        suggestedKeywords: ["Harilo Ranga", "Akshaya Patra", "Dhanurmasam", "Vishnu", "Vaikuntham"],
        defaultStyle: "Classical",
        defaultSinger: "Male Solo",
        defaultComplexity: "Complex",
        defaultRhyme: "Prasa"
      },
      {
        id: "sankranti_gobbemma",
        label: "Sankranti: Folk Ritual",
        promptContext: "Context: Women's ritual around Gobbemmalu and Rangoli. Bouncy, rhythmic call-and-response. Focus on family abundance.",
        defaultMood: "Happy",
        suggestedKeywords: ["Subbi Gobbemma", "Muggulu", "Amma", "Yalo", "Rangavalli"],
        defaultStyle: "Folk",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "sankranti_alludu",
        label: "Sankranti: Satire",
        promptContext: "Context: Playfully teasing the son-in-law (Alludu) about his laziness and appetite for Ariselu. High energy Teenmaar beat.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Alludu", "Ariselu", "Lazy", "USA Alludu", "Kodi Pandem", "Vindhu"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "pongal_jallikattu",
        label: "Pongal: Bull Sport",
        promptContext: "Context: The traditional bull-embracing sport of Tamil Nadu. High intensity, brave youth vs fierce bulls. Focus on Vadivasal, soil, and ancestry. Rhythm: Thara Thappattai.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Vadivasal", "Thimiru", "Kombu", "Kaalai", "Veeram", "Mannu"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Male Solo",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      },
      {
        id: "pongal_mattu",
        label: "Pongal: Harvest Gratitude",
        promptContext: "Context: Celebration of cattle and the Sun God. Gratitude for the harvest. Colorful horns, turmeric-washed cows. Focus on Mannu (Soil) and family prosperity.",
        defaultMood: "Happy",
        suggestedKeywords: ["Suryan", "Maadu", "Manjal", "Karumbu", "Pongalo Pongal", "Uzhavor"],
        defaultStyle: "Folk",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "sankranthi_ellu_bella",
        label: "Sankranthi: Sharing Sweetness",
        promptContext: "Context: The Kannada tradition of exchanging sesame and jaggery. Young girls visiting houses, spreading joy. Symbolizes speaking good words and strengthening bonds.",
        defaultMood: "Happy",
        suggestedKeywords: ["Ellu Bella", "Sakkare Acchu", "Olle Maathu", "Snehitha", "Bandhavya"],
        defaultStyle: "Melody",
        defaultSinger: "Female Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "makaravilakku_sabarimala",
        label: "Pilgrimage Devotional",
        promptContext: "Context: The holy pilgrimage to Sabarimala. The sight of Makara Jyothi. The chanting of 'Saranam Ayyappa'. Deep devotion, trekking through forests, and the 18 holy steps.",
        defaultMood: "Devotional",
        suggestedKeywords: ["Makara Jyothi", "Sabarimala", "Saranam Ayyappa", "Manikandan", "Pampa", "Irumudi"],
        defaultStyle: "Sopanam",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "college_youth",
    label: "College & Youth",
    events: [
      {
        id: "bachelors_anthem",
        label: "Bachelor's Anthem",
        promptContext: "Context: Celebrating single life. Anti-marriage sentiments. Fun, freedom, parties. 'Why buy a cow when milk is free' type of humor (kept decent). 'No tension, no pension'.",
        defaultMood: "Energetic",
        suggestedKeywords: ["Single", "King", "Freedom", "No Tension", "Party", "Enjoy", "Mandhu"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "freshers_intro",
        label: "College Freshers",
        promptContext: "Context: Entering college. Seniors bullying juniors (fun way) or juniors looking at seniors in awe. Campus atmosphere, canteen, bunking classes. Youthful energy.",
        defaultMood: "Playful (Kids)",
        suggestedKeywords: ["Senior", "Junior", "Ragging", "Campus", "Canteen", "Bunk", "Lecturer", "Crush"],
        defaultStyle: "Pop Rock",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "friendship_anthem",
        label: "Friendship Anthem",
        promptContext: "Context: Celebration of friendship. Ride or die. 'Mithrama' sentiment. High energy, group dancing, loyalty over everything.",
        defaultMood: "Happy",
        suggestedKeywords: ["Dosth", "Sneham", "Mithrama", "Pranam", "Journey", "Gang", "Bhai"],
        defaultStyle: "Fast Beat/Mass",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "college_farewell",
        label: "College Farewell",
        promptContext: "Context: Last day of college. Signatures on shirts, tears, remembering the benches, canteen, and crush. Nostalgic.",
        defaultMood: "Melancholic",
        suggestedKeywords: ["Farewell", "Gnapakalu", "Campus", "Canteen", "Friends", "Vidudhalai"],
        defaultStyle: "Melody",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "social_philosophy",
    label: "Life & Society",
    events: [
      {
        id: "middle_class_woes",
        label: "Middle Class Struggles",
        promptContext: "Context: The daily grind of the common man. Budget issues, EMI, traffic, petrol prices, rising tomato rates. Satirical yet relatable pain. Comedy-Tragedy mix.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Middle Class", "Budget", "EMI", "Loan", "Salary", "Traffic", "Adjust", "Petrol"],
        defaultStyle: "Folk",
        defaultSinger: "Male Solo",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "corporate_life",
        label: "Corporate Life",
        promptContext: "Context: The IT employee struggle. Weekend waiting, Manager torture, deadlines, night shifts. 'Log-in, Log-out' cycle. Robotic life.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Software", "Manager", "Deadline", "Weekend", "Log-in", "Bug", "Salary", "Robot"],
        defaultStyle: "Techno/Pop",
        defaultSinger: "Male Rap",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "life_philosophy",
        label: "Life Philosophy",
        promptContext: "Context: The protagonist realizes the truth of life. Wandering, learning, overcoming failure. Motivational or cynical.",
        defaultMood: "Philosophical",
        suggestedKeywords: ["Jeevitam", "Payanam", "Gamyam", "Velugu", "Cheekati", "Sathyam"],
        defaultStyle: "Melody",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "satirical_social",
        label: "Social Satire",
        promptContext: "Context: Making fun of societal issues, politics, money, or the 'System'. Burrakatha style or Folk Fusion. Witty, sarcastic, and hard-hitting.",
        defaultMood: "Funny (Hasya)",
        suggestedKeywords: ["Samajam", "Vote", "Note", "System", "Politrics", "Broker", "Duniya"],
        defaultStyle: "Folk (Teenmaar/Jaanapada)",
        defaultSinger: "Male Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "patriotic_desh",
        label: "Patriotic Anthem",
        promptContext: "Context: Love for the nation. Soldiers at the border, the flag, sacrifice for the soil. Goosebumps inducing.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Desam", "Jenda", "Matti", "Jai Hind", "Sainika", "Thyagam"],
        defaultStyle: "Anthem",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "divine_devotion",
    label: "Divine & Spiritual",
    events: [
      {
        id: "dandakam",
        label: "Fierce Chanting (Dandakam)",
        promptContext: "Context: A high-intensity, rhythmic prose-poem praising a Deity's power. Flowing, complex Sanskrit-heavy compounds. Breathless delivery. Focus on Power (Shakti) and Protection (Raksha). Example: Anjaneya Dandakam.",
        defaultMood: "Courageous (Veera)",
        suggestedKeywords: ["Namasthe", "Vajra Deha", "Maha Veera", "Raksha Raksha", "Agni", "Prachanda"],
        defaultStyle: "Classical Fusion",
        defaultSinger: "Male Solo",
        defaultComplexity: "Classical/Grandhika",
        defaultRhyme: "Prasa"
      },
      {
        id: "suprabhatam",
        label: "Morning Awakening (Suprabhatam)",
        promptContext: "Context: Early morning hymn to wake up the Deity. Peaceful, auspicious, describing nature (birds, flowers, sunrise) and the glory of the God waiting to bless devotees.",
        defaultMood: "Peaceful",
        suggestedKeywords: ["Kausalya", "Purva Sandhya", "Uthishta", "Kamala", "Mangalam", "Aruna"],
        defaultStyle: "Classical (Carnatic/Hindustani)",
        defaultSinger: "Male/Female Solo",
        defaultComplexity: "Poetic",
        defaultRhyme: "Prasa"
      },
      {
        id: "aarti_harathi",
        label: "Divine Offering (Aarti)",
        promptContext: "Context: The climax of worship. Offering camphor flame to the Deity. Rhythmic bells, ecstatic devotion, asking for the removal of darkness/evil eye.",
        defaultMood: "Devotional (Bhakti)",
        suggestedKeywords: ["Karpoora", "Jyothi", "Neerajanam", "Jaya Jaya", "Divya", "Teja"],
        defaultStyle: "Devotional/Bhajan",
        defaultSinger: "Group Chorus",
        defaultComplexity: "Simple",
        defaultRhyme: "AABB"
      },
      {
        id: "sufi_qawwali",
        label: "Sufi Qawwali",
        promptContext: "Context: Mystical devotion. Seeking union with the Divine Beloved (The Creator). Metaphors of wine, intoxication, veils, and the heart's longing. Tabla and clapping focus.",
        defaultMood: "Devotional (Bhakti)",
        suggestedKeywords: ["Maula", "Ishq", "Noor", "Sajda", "Parda", "Mast", "Rang"],
        defaultStyle: "Ghazal/Sufi",
        defaultSinger: "Qawwali Group",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      }
    ]
  },
  {
    id: "wedding_rituals",
    label: "Wedding Rituals",
    events: [
      {
        id: "jeelakarra_bellam",
        label: "Wedding: Sacred Union",
        promptContext: "Context: The core ritual where the bride and groom place cumin and jaggery on each other's heads. Symbolic of sweetness and medicine merging. Shahnai (Sannayi) focus.",
        defaultMood: "Devotional",
        suggestedKeywords: ["Sumuhurtham", "Sannayi", "Agni", "Sapthapadi", "Kanyadanam"],
        defaultStyle: "Classical Fusion",
        defaultSinger: "Female Solo",
        defaultComplexity: "Complex",
        defaultRhyme: "Prasa"
      },
      {
        id: "talambralu",
        label: "Wedding: Playful Blessing",
        promptContext: "Context: Ritual of pouring turmeric-mixed rice. Playful, joyful, and slightly competitive. Fast-paced melodic rhythm.",
        defaultMood: "Happy",
        suggestedKeywords: ["Muthiyala", "Akshathalu", "Navvulu", "Sambaram"],
        defaultStyle: "Melody",
        defaultSinger: "Duet",
        defaultComplexity: "Poetic",
        defaultRhyme: "AABB"
      },
      {
        id: "appagintalu",
        label: "Wedding: Bride's Farewell",
        promptContext: "Context: The emotional moment the bride leaves her parents' home. Tears, heavy hearts, promises to stay in touch. Pathos-heavy melody.",
        defaultMood: "Sad (Pathos)",
        suggestedKeywords: ["Vellipoke", "Kannillu", "Putthillu", "Atthillu", "Pappu-Annam"],
        defaultStyle: "Melody",
        defaultSinger: "Female Solo",
        defaultComplexity: "Complex",
        defaultRhyme: "AABB"
      }
    ]
  }
];