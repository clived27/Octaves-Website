/* ─── data/archivesData.js ─── */
/*
  ARCHIVES_EVENTS: Top-level event cards for the gallery view.
  - type: 'single' | 'multi'
  - For 'single': dataKey points to a key in ARCHIVES_PERFORMANCES
  - For 'multi':  years[] lists { label, dataKey, comingSoon }
  - thumbnail: image to display on the card
*/

var ARCHIVES_EVENTS = [
  {
    id: "euphoria",
    name: "Euphoria",
    type: "single",
    dataKey: "euphoria_2026",
    thumbnail: "images/euphoria_thumb.jpg",
    year: "2026",
    description: "The annual flagship concert"
  },
  {
    id: "freshers",
    name: "Freshers",
    type: "multi",
    thumbnail: "images/card_roster.png",
    description: "Welcome performances for the new batch",
    years: [
      { label: "2025", dataKey: "freshers_2025", comingSoon: false },
      { label: "2026", dataKey: "freshers_2026", comingSoon: true  }
    ]
  },
  {
    id: "cultnite",
    name: "Cultnite",
    type: "multi",
    thumbnail: "images/cultnite_thumb.jpg",
    description: "Cultural night extravaganza",
    years: [
      { label: "2025", dataKey: "cultnite_2025", comingSoon: false },
      { label: "2026", dataKey: "cultnite_2026", comingSoon: false }
    ]
  },
  {
    id: "independence_day",
    name: "Independence Day",
    type: "single",
    dataKey: "independence_day_2026",
    thumbnail: "images/independece_thumb.jpg",
    year: "2026",
    description: "Goonj-e-Azadi — Patriotic musical tribute"
  },
  {
    id: "jhankaar",
    name: "Jhankaar IG",
    type: "single",
    dataKey: "jhankaar_2026",
    thumbnail: "images/drm3.jpg",
    year: "2026",
    description: "Inter-genre departmental showcase"
  },
  {
    id: "republic_day",
    name: "Republic Day",
    type: "single",
    dataKey: "republic_day_2026",
    thumbnail: "images/republic_thumb.jpg",
    year: "2026",
    description: "Patriotic celebration & live performances"
  }
];

/* ─── Performances keyed by dataKey ─── */
var ARCHIVES_PERFORMANCES = {

  euphoria_2026: {
    title: "Euphoria",
    subtitle: "2026",
    performances: [
      { slotName: "Legends Never Die",        youtubeUrl: "https://www.youtube.com/embed/viLfwAuGHiM" },
      { slotName: "Fifi",                      youtubeUrl: "https://www.youtube.com/embed/LD4CkZbh_a4" },
      { slotName: "Kill Dill",                 youtubeUrl: "https://www.youtube.com/embed/3tTT48iRwXo" },
      { slotName: "Kal Chaudhvin ki Raat",     youtubeUrl: "https://www.youtube.com/embed/romRo6NYHAY" },
      { slotName: "Colours",                   youtubeUrl: "https://www.youtube.com/embed/QQhMLejvyxY" },
      { slotName: "Aaj ki Raat",               youtubeUrl: "https://www.youtube.com/embed/99sjfud7X2U" },
      { slotName: "Zinda",                     youtubeUrl: "https://www.youtube.com/embed/RdrlYppzGh4" },
      { slotName: "End of Beginning",          youtubeUrl: "https://www.youtube.com/embed/VIXR3Yutyno" },
      { slotName: "Ye Dil Tum Bin",            youtubeUrl: "https://www.youtube.com/embed/G_lLo-yVGtU" },
      { slotName: "Old Bollywood Slot",        youtubeUrl: "https://www.youtube.com/embed/y6JkVrByH8c" },
      { slotName: "New Bollywood Slot",        youtubeUrl: "https://www.youtube.com/embed/YHkt2rscfzc" },
      { slotName: "Saraswati Vandana",         youtubeUrl: "https://www.youtube.com/embed/DrP_tUponxA" },
      { slotName: "Locha e Ulfat",             youtubeUrl: "https://www.youtube.com/embed/R5afTZECZM4" },
      { slotName: "Mohabbat Buri Bimari",      youtubeUrl: "https://www.youtube.com/embed/lbsLrsG0XUc" },
      { slotName: "Abhi Abhi and Saiyaan",     youtubeUrl: "https://www.youtube.com/embed/-VVXdxbCwOU" },
      { slotName: "Qawwali",                   youtubeUrl: "https://www.youtube.com/embed/de2dnAKSZFA" }
    ]
  },

  freshers_2025: {
    title: "Freshers",
    subtitle: "2025",
    performances: [
      { slotName: "Semi Classical",  youtubeUrl: "https://www.youtube.com/embed/jxlSQ8W4lCs" },
      { slotName: "Rock",            youtubeUrl: "https://www.youtube.com/embed/mNOF7nHvzF8" },
      { slotName: "Soft Bollywood",  youtubeUrl: "https://www.youtube.com/embed/ZkIiEW4uJYc" }
    ]
  },

  freshers_2026: {
    title: "Freshers",
    subtitle: "2026",
    performances: []  /* Coming soon — no content yet */
  },

  cultnite_2025: {
    title: "Cultnite",
    subtitle: "2025",
    performances: [
      { slotName: "Die with a Smile",          youtubeUrl: "https://www.youtube.com/embed/d0TsxEQJr-4"  },
      { slotName: "Koi Mil Gaya X Jiya Jiya",  youtubeUrl: "https://www.youtube.com/embed/aVinaheHqoo"  },
      { slotName: "Zamana Lage",               youtubeUrl: "https://www.youtube.com/embed/ozqV3y1LF1k"  }
    ]
  },

  cultnite_2026: {
    title: "Cultnite",
    subtitle: "2026",
    performances: [
      { slotName: "Ae Dil Hai Mushkil",  youtubeUrl: "https://www.youtube.com/embed/iToM3ZRFltQ" },
      { slotName: "Har Kisi Ko",         youtubeUrl: "https://www.youtube.com/embed/GBlGPdaespk" },
      { slotName: "Allah Duhai Hai",     youtubeUrl: "https://www.youtube.com/embed/7Fq-DT8LkkY" },
      { slotName: "Hey Rama",            youtubeUrl: "https://www.youtube.com/embed/JWu7JQZOwJc" }
    ]
  },

  independence_day_2026: {
    title: "Goonj-e-Azadi",
    subtitle: "Independence Day 2026",
    performances: [
      { slotName: "Opening Slot",    youtubeUrl: "https://www.youtube.com/embed/aLOxww6rbVw" },
      { slotName: "Emotional Slot",  youtubeUrl: "https://www.youtube.com/embed/vzwUFJUKnOo" },
      { slotName: "Rock Slot",       youtubeUrl: "https://www.youtube.com/embed/YBBILcjUZxY" },
      { slotName: "Patriotic Slot",  youtubeUrl: "https://www.youtube.com/embed/qFMmwQEhfFI" },
      { slotName: "Victory Slot",    youtubeUrl: "https://www.youtube.com/embed/6MQYLmyhALI" }
    ]
  },

  jhankaar_2026: {
    title: "Jhankaar IG",
    subtitle: "2026",
    performances: [
      { slotName: "Mechanical",                  youtubeUrl: "https://www.youtube.com/embed/nS4j0xnw4OU" },
      { slotName: "Electrical",                  youtubeUrl: "https://www.youtube.com/embed/cChhfhFUvUo" },
      { slotName: "Metallurgy and Materials",    youtubeUrl: "https://www.youtube.com/embed/ME_6ds8k49c" },
      { slotName: "Architecture",                youtubeUrl: "https://www.youtube.com/embed/79KUqKB7JG8" },
      { slotName: "Computer Science",            youtubeUrl: "https://www.youtube.com/embed/kgpgeYEfQr4" },
      { slotName: "Chemical Mining",             youtubeUrl: "https://www.youtube.com/embed/VfFfCtsp52M" },
      { slotName: "Electronics & Communication", youtubeUrl: "https://www.youtube.com/embed/jtXJI_z2lw8" },
      { slotName: "Civil",                       youtubeUrl: "https://www.youtube.com/embed/dIAe4_JSA3I" }
    ]
  },

  republic_day_2026: {
    title: "Republic Day",
    subtitle: "2026",
    performances: [
      { slotName: "Chunar",          youtubeUrl: "https://www.youtube.com/embed/mXMG-gkw260" },
      { slotName: "Dhano Dhano",     youtubeUrl: "https://www.youtube.com/embed/q3VyY8lHqP8" },
      { slotName: "Jai Ho",          youtubeUrl: "https://www.youtube.com/embed/SaRWDQZ559o" },
      { slotName: "Maa Tujhe Salam", youtubeUrl: "https://www.youtube.com/embed/QfxWlqSNMWE" }
    ]
  }

};