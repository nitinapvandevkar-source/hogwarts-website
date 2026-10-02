import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import "./App.css";

import bgm from "./assets/castle/harry-potter-bgm.mp3";
import hogwartsCastle from "./assets/castle/hogwarts-castle.jpg";
import hogwartsCastleSide from "./assets/castle/hogwarts-castle-side.jpg";
import hogwartsCourtyard from "./assets/castle/hogwarts-courtyard.jpg";
import hogwartsCorridor from "./assets/castle/hogwarts-corridor.jpg";
import grandStaircase from "./assets/castle/grand-staircase.jpg";
import greatHall from "./assets/castle/great-hall.jpg";


const characterAssets = import.meta.glob("./assets/characters/*", { eager: true, import: "default" });
const professorAssets = import.meta.glob("./assets/professors/*", { eager: true, import: "default" });
const classroomAssets = import.meta.glob("./assets/classrooms/*", { eager: true, import: "default" });
const creatureAssets = import.meta.glob("./assets/creatures/*", { eager: true, import: "default" });
const spellAssets = import.meta.glob("./assets/spells/*", { eager: true, import: "default" });
const houseAssets = import.meta.glob("./assets/houses/*", { eager: true, import: "default" });
const castleAssets = import.meta.glob("./assets/castle/*", { eager: true, import: "default" });
const groundsAssets = import.meta.glob("./assets/grounds/*", { eager: true, import: "default" });
const wizardingAssets = import.meta.glob("./assets/wizarding/*", { eager: true, import: "default" });
const villainAssets = import.meta.glob("./assets/villains/*", { eager: true, import: "default" });
const atmosphereAssets = import.meta.glob("./assets/atmosphere/*", { eager: true, import: "default" });
const quidditchAssets = import.meta.glob("./assets/quidditch/*", { eager: true, import: "default" });
const familyAssets = import.meta.glob("./assets/families/*", { eager: true, import: "default" });
const artifactAssets = import.meta.glob("./assets/artifacts/*", { eager: true, import: "default" });

function findAsset(group, name) {
  const target = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const entry = Object.entries(group).find(([path]) => {
    const file = path.split("/").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
    return file.includes(target) || target.includes(file.replace(/\.[^.]+$/, ""));
  });
  return entry ? entry[1] : "";
}

function findClassroomAsset(className) {
  const normalized = className.toLowerCase();

  const aliases = {
    "charms": ["charms-classroom", "charms"],
    "transfiguration": ["transfiguration-classroom", "transfiguration"],
    "potions": ["potions-classroom", "potions"],
    "herbology": ["herbology-classroom", "herbology"],
    "defence against the dark arts": ["defence-classroom", "defense-classroom", "defence", "defense"],
    "astronomy": ["astronomy-classroom", "astronomy"],
    "divination": ["divination-classroom", "divination"],
    "flying": ["flying-classroom", "flying"],
  };

  const terms = aliases[normalized] || [normalized];

  for (const term of terms) {
    const image = findAsset(classroomAssets, term);
    if (image) return image;
  }

  return hogwartsCorridor;
}

function findHouseCommonRoomAsset(houseName) {
  const aliases = {
    Gryffindor: ["gryffindor-common-room", "gryffindor-commonroom"],
    Slytherin: ["slytherin-common-room", "slytherin-commonroom"],
    Ravenclaw: ["ravenclaw-common-room", "ravenclaw-commonroom"],
    Hufflepuff: ["hufflepuff-common-room", "hufflepuff-commonroom"],
  };

  const files = Object.entries(houseAssets);
  const terms = aliases[houseName] || [];

  // IMPORTANT: Houses must use COMMON ROOM artwork only.
  // Never match generic house images, entrances, banners or portraits.
  for (const term of terms) {
    const target = term.toLowerCase().replace(/[^a-z0-9]/g, "");

    const match = files.find(([path]) => {
      const filename = path.split("/").pop().toLowerCase();
      const normalized = filename.replace(/[^a-z0-9]/g, "");

      const isImage = /\.(jpg|jpeg|png|webp|avif)$/i.test(filename);
      const isCommonRoom = normalized.includes("commonroom");
      const isEntrance = normalized.includes("commonentrance") || normalized.includes("entrance");

      return (
        isImage &&
        isCommonRoom &&
        !isEntrance &&
        normalized.includes(target)
      );
    });

    if (match) return match[1];
  }

  return "";
}

function findProfessorAsset(name) {
  const aliases = {
    "Albus Dumbledore": ["albus-dumbledore", "dumbledore", "professor-dumbledore"],
    "Dolores Umbridge": ["dolores-umbridge", "umbridge", "professor-umbridge"],
    "Gilderoy Lockhart": ["gilderoy-lockhart", "lockhart", "professor-lockhart"],
    "Horace Slughorn": ["horace-slughorn", "slughorn", "professor-slughorn"],
    "Minerva McGonagall": ["minerva-mcgonagall", "professor-mcgonagall", "mcgonagall"],
    "Severus Snape": ["severus-snape", "professor-snape", "snape"],
    "Filius Flitwick": ["filius-flitwick", "professor-flitwick", "flitwick"],
    "Pomona Sprout": ["pomona-sprout", "professor-sprout", "sprout"],
    "Rubeus Hagrid": ["rubeus-hagrid", "hagrid", "professor-hagrid"],
    "Remus Lupin": ["remus-lupin", "professor-lupin", "lupin"],
    "Sybill Trelawney": ["sybill-trelawney", "professor-trelawney", "trelawney"],
    "Alastor Moody": ["alastor-moody", "mad-eye-moody", "madeyemoody", "moody"],
  };

  const terms = aliases[name] || [name];

  for (const term of terms) {
    const image = findAsset(professorAssets, term);
    if (image) return image;
  }

  return "";
}

function findCharacterAsset(name) {
  const aliases = {
    "Luna Lovegood": ["luna-lovegood", "lunalovegood"],
    "Ginny Weasley": ["gina-weasley", "ginny-weasley", "ginnyweasley", "ginaweasley"],
    "Gina Weasley": ["gina-weasley", "ginny-weasley", "ginaweasley", "ginnyweasley"],
    "Neville Longbottom": ["neville-longbottom", "nevile-longbottom", "nevillelongbottom"],
    "Fred and George Weasley": ["fred-and-george-weasley", "fred-george-weasley", "fredandgeorgeweasley"],
    "Sirius Black": ["sirius-black", "siriusblack"],
    "Harry Potter": ["harry-potter", "harrypotter"],
    "Hermione Granger": ["hermione-granger", "hermionegranger"],
    "Ron Weasley": ["ron-weasley", "ronweasley"],
    "Draco Malfoy": ["draco-malfoy", "dracomalfoy"],
    "Rubeus Hagrid": ["rubeus-hagrid", "hagrid"],
  };

  const terms = aliases[name] || [name];
  for (const term of terms) {
    const image = findAsset(characterAssets, term);
    if (image) return image;
  }
  return "";
}

function findCastleAsset(name) {
  const aliases = {
    "trophy room": ["trophy-room", "trophyroom"],
    "dungeons": ["dungeons", "dungeon"],
    "hogwarts bridge": ["hogwarts-bridge", "bridge"],
    "headmaster's office": ["headmasters-office", "headmaster-office", "dumbledore-office"],
    "room of requirement": ["room-of-requirement", "roomofrequirement"],
    "black lake": ["black-lake", "blacklake"],
    "boathouse": ["boathouse"],
    "forbidden forest": ["forbidden-forest", "forbiddenforest"],
    "quidditch pitch": ["quidditch-pitch", "quidditch"],
    "astronomy tower": ["astronomy-tower", "astronomy"],
    "herbology greenhouses": ["herbology-greenhouses", "greenhouses", "herbology"],
    "library": ["library"],
    "great hall": ["great-hall", "greathall"],
    "grand staircase": ["grand-staircase", "grandstaircase"],
    "castle corridors": ["hogwarts-corridor", "castle-corridor", "corridor"],
    "courtyard": ["hogwarts-courtyard", "courtyard"],
    "hogwarts castle": ["hogwarts-castle-side", "hogwarts-castle"],
  };
  const terms = aliases[name.toLowerCase()] || [name.toLowerCase()];
  for (const term of terms) {
    const image = findAsset(castleAssets, term);
    if (image) return image;
  }
  return hogwartsCastleSide;
}

function findNamedAsset(group, terms, fallback = "") {
  for (const term of terms) {
    const image = findAsset(group, term);
    if (image) return image;
  }
  return fallback;
}

function findGroundsAsset(name) {
  const aliases = {
    "Forbidden Forest": ["forbidden-forest"],
    "Hagrid's Hut": ["hagrids-hut", "hagrid-hut"],
    "Hogwarts Bridge": ["hogwarts-bridge"],
    "Quidditch Pitch": ["quidditch-pitch"],
    "Whomping Willow": ["whomping-willow"],
  };
  return findNamedAsset(groundsAssets, aliases[name] || [name]);
}

function findWizardingAsset(name) {
  const aliases = {
    "Ancient Potions": ["ancient-potions"],
    "Magical Books": ["magical-books"],
    "Potion Ingredients": ["potion-ingredients"],
    "Wizarding Desk": ["wizarding-desk"],
    "Wizarding Parchment": ["wizarding-parchment"],
  };
  return findNamedAsset(wizardingAssets, aliases[name] || [name]);
}

function findVillainAsset(name) {
  const aliases = {
    "Barty Crouch Jr.": ["barty-crouch-jr", "barty-crouch"],
    "Bellatrix Lestrange": ["bellatrix-lestrange", "bellatrix"],
    "Dolores Umbridge": ["dolores-umbridge", "umbridge"],
    "Fenrir Greyback": ["fenrir-greyback", "greyback"],
    "Lucius Malfoy": ["lucius-malfoy", "lucius"],
    "Peter Pettigrew": ["peter-pettigrew", "pettigrew"],
    "Lord Voldemort": ["voldemort", "lord-voldemort"],
  };
  return findNamedAsset(villainAssets, aliases[name] || [name]);
}

function findAtmosphereAsset(name) {
  const aliases = {
    "Castle Under Moonlight": ["castle-under-moonlight"],
    "Great Hall Candles": ["great-hall-candles"],
    "Great Hall Feast": ["great-hall-feast"],
    "Hogwarts at Night": ["hogwarts-at-night"],
    "Hogwarts at Sunset": ["hogwarts-at-sunset"],
    "Hogwarts Courtyard at Night": ["hogwarts-courtyard-night"],
    "Hogwarts from the Lake": ["hogwarts-from-the-lake"],
    "Hogwarts in Mist": ["hogwarts-in-mist"],
    "Hogwarts in Winter": ["hogwarts-in-winter"],
    "Hogwarts Snowy Grounds": ["hogwarts-snowy-grounds"],
  };
  return findNamedAsset(atmosphereAssets, aliases[name] || [name]);
}

function findQuidditchAsset(name) {
  const aliases = {
    "Gryffindor Quidditch": ["gryffindor-quidditch"],
    "Quidditch Cup": ["quidditch-cup"],
    "Quidditch Match": ["quidditch-match"],
    "Quidditch Pitch": ["quidditch-pitch"],
    "Quidditch Player": ["quidditch-player"],
    "Quidditch Score Banners": ["quidditch-score-banners", "score-banners"],
  };
  return findNamedAsset(quidditchAssets, aliases[name] || [name]);
}

function findFamilyAsset(name) {
  const aliases = {
    "Potter Family": ["potter-family"],
    "Weasley Family": ["weasley-family"],
    "Longbottom Family": ["longbottom-family"],
    "Malfoy Family": ["malfoy-family"],
    "Granger Family": ["granger-family"],
    "Lovegood Family": ["lovegood-family"],
  };

  // IMPORTANT: Families use the dedicated family artwork only.
  // Never fall back to individual member portraits for the family card.
  return findNamedAsset(familyAssets, aliases[name] || []);
}

function findFamilyMemberAssets(terms = []) {
  return terms.map((term) => findAsset(familyAssets, term)).filter(Boolean);
}

function findArtifactAsset(name) {
  const aliases = {
    "Elder Wand": ["elder-wand"],
    "Golden Snitch": ["golden-snitchn", "golden-snitch"],
    "Hogwarts Letter": ["hogwarts-letter"],
    "Invisibility Cloak": ["invisibility-cloak"],
    "Marauder's Map": ["marauders-map", "marauder-map"],
    "Pensieve": ["pensieve"],
    "Philosopher's Stone": ["philosophers-stone", "philosopher-stone"],
    "Resurrection Stone": ["resurrection-stone"],
    "Sorting Hat": ["sorting-hat"],
    "Time-Turner": ["time-turner", "timeturner"],
  };
  return findNamedAsset(artifactAssets, aliases[name] || [name]);
}


/* =========================================================
   DATA
========================================================= */

const houses = [
  {
    name: "Gryffindor",
    trait: "Courage • Nerve • Chivalry",
    description:
      "A house shaped by courage, determination and the willingness to stand when others step back.",
  },
  {
    name: "Slytherin",
    trait: "Ambition • Cunning • Resourcefulness",
    description:
      "A house associated with ambition, resourcefulness and a strong sense of purpose.",
  },
  {
    name: "Ravenclaw",
    trait: "Wisdom • Curiosity • Wit",
    description:
      "A house for curious minds who value knowledge, imagination and independent thought.",
  },
  {
    name: "Hufflepuff",
    trait: "Loyalty • Patience • Fairness",
    description:
      "A house built around loyalty, patience, dedication and treating others fairly.",
  },
];

const characters = [
  {
    name: "Harry Potter",
    role: "The Boy Who Lived",
    description:
      "A young wizard whose years at Hogwarts become inseparable from the history of the magical world.",
  },
  {
    name: "Hermione Granger",
    role: "Witch • Scholar",
    description:
      "Brilliant, determined and deeply committed to knowledge, friendship and doing what is right.",
  },
  {
    name: "Ron Weasley",
    role: "Wizard • Gryffindor",
    description:
      "A loyal friend whose humour, courage and determination carry him through Hogwarts adventures.",
  },
  {
    name: "Luna Lovegood",
    role: "Witch • Ravenclaw",
    description:
      "A thoughtful Ravenclaw whose imagination, individuality and quiet courage make her one of Hogwarts' most memorable students.",
  },
  {
    name: "Ginny Weasley",
    role: "Witch • Gryffindor",
    description:
      "A talented Gryffindor witch known for her determination, confidence and skill on the Quidditch pitch.",
  },
  {
    name: "Neville Longbottom",
    role: "Wizard • Gryffindor",
    description:
      "A loyal Gryffindor whose courage grows through his years at Hogwarts, becoming one of its most determined students.",
  },
  {
    name: "Fred and George Weasley",
    role: "Wizards • Gryffindor",
    description:
      "Twin Weasley brothers known for their humour, creativity and unforgettable place in Hogwarts history.",
  },
  {
    name: "Sirius Black",
    role: "Wizard • Marauder",
    description:
      "A former Hogwarts student and Marauder whose complicated history is deeply connected to Harry and the wizarding world.",
  },
  {
    name: "Draco Malfoy",
    role: "Slytherin Student",
    description:
      "A Slytherin student whose complicated relationship with Hogwarts and its students develops over the years.",
  },
  {
    name: "Rubeus Hagrid",
    role: "Keeper of Keys & Grounds",
    description:
      "A much-loved Hogwarts figure with a deep connection to magical creatures and the castle grounds.",
  },
];

const professors = [
  { name: "Albus Dumbledore", role: "Headmaster of Hogwarts", description: "The long-serving headmaster of Hogwarts, known for his wisdom, leadership and deep understanding of magic." },
  { name: "Minerva McGonagall", role: "Transfiguration Professor", description: "A formidable Transfiguration professor and one of Hogwarts' most respected teachers, known for discipline, fairness and courage." },
  { name: "Severus Snape", role: "Potions Professor", description: "The demanding Potions professor whose lessons require precision, patience and an exact understanding of magical ingredients." },
  { name: "Filius Flitwick", role: "Charms Professor", description: "The Charms professor who teaches students the careful wandwork and spellcraft needed to master enchantments." },
  { name: "Pomona Sprout", role: "Herbology Professor", description: "The warm but practical Herbology professor who guides students through the cultivation and study of magical plants." },
  { name: "Rubeus Hagrid", role: "Care of Magical Creatures", description: "Hogwarts' Keeper of Keys and Grounds, with an extraordinary knowledge of magical creatures and the castle grounds." },
  { name: "Remus Lupin", role: "Defence Against the Dark Arts", description: "A thoughtful Defence Against the Dark Arts professor who combines practical lessons with patience and empathy." },
  { name: "Sybill Trelawney", role: "Divination Professor", description: "The Divination professor whose lessons explore signs, visions, symbolism and the mysterious possibilities of the future." },
  { name: "Alastor Moody", role: "Defence Against the Dark Arts", description: "A legendary Auror who brings a strict, practical approach to magical defence and awareness of dark threats." },
  { name: "Dolores Umbridge", role: "Defence Against the Dark Arts Professor", description: "A Ministry-appointed Hogwarts professor whose rigid approach to teaching and school authority made her tenure distinctive." },
  { name: "Gilderoy Lockhart", role: "Defence Against the Dark Arts Professor", description: "A celebrated author and Defence Against the Dark Arts professor whose reputation for heroic adventures follows him into the classroom." },
  { name: "Horace Slughorn", role: "Potions Professor", description: "An experienced Potions master who returns to Hogwarts and is known for his knowledge, connections and Slug Club." },
];

const classes = [
  { name: "Charms", professor: "Filius Flitwick", description: "The study of spells that add properties or effects to objects and people." },
  { name: "Transfiguration", professor: "Minerva McGonagall", description: "The demanding art of changing the form or appearance of an object or creature." },
  { name: "Potions", professor: "Severus Snape", description: "The careful preparation of magical mixtures using ingredients, timing and precision." },
  { name: "Herbology", professor: "Pomona Sprout", description: "The study and cultivation of magical plants and fungi." },
  { name: "Defence Against the Dark Arts", professor: "Remus Lupin", description: "Practical magical defence against dangerous creatures, curses and dark forces." },
  { name: "Astronomy", professor: "Aurora Sinistra", description: "The observation and study of stars, planets and celestial movements." },
  { name: "Divination", professor: "Sybill Trelawney", description: "A subject concerned with interpreting signs and attempting to perceive possible futures." },
  { name: "Flying", professor: "Madam Rolanda Hooch", description: "The first steps into broom flight, balance and safe aerial movement." },
];

const places = [
  {
    name: "Great Hall",
    type: "Castle Interior",
    description:
      "The enormous dining hall where Hogwarts students gather beneath its enchanted ceiling.",
  },
  {
    name: "Grand Staircase",
    type: "Castle Interior",
    description:
      "A constantly shifting network of staircases connecting many parts of the castle.",
  },
  {
    name: "Library",
    type: "Knowledge",
    description:
      "A vast collection of magical books and one of the quietest corners of Hogwarts.",
  },
  {
    name: "Forbidden Forest",
    type: "Castle Grounds",
    description:
      "A mysterious woodland filled with magical creatures and places rarely understood by students.",
  },
  {
    name: "Astronomy Tower",
    type: "Tower",
    description:
      "One of the highest points of Hogwarts and the home of Astronomy lessons.",
  },
  {
    name: "Dungeons",
    type: "Underground",
    description:
      "Dark stone corridors beneath Hogwarts, including the Potions classroom.",
  },
  {
    name: "Quidditch Pitch",
    type: "Grounds",
    description:
      "The Hogwarts grounds where students compete in the famous wizarding sport.",
  },
  {
    name: "Room of Requirement",
    type: "Hidden Space",
    description:
      "A mysterious room that appears when someone has a genuine need for it.",
  },
];

const spells = [
  {
    name: "Lumos",
    type: "Light",
    description: "Produces light from the wand.",
  },
  {
    name: "Alohomora",
    type: "Charm",
    description: "Used to unlock certain doors and objects.",
  },
  {
    name: "Accio",
    type: "Summoning",
    description: "A summoning charm used to bring an object closer.",
  },
  {
    name: "Protego",
    type: "Defensive",
    description: "Creates a magical shield against certain attacks.",
  },
  {
    name: "Expelliarmus",
    type: "Disarming",
    description: "A spell commonly associated with disarming an opponent.",
  },
  {
    name: "Expecto Patronum",
    type: "Defensive",
    description: "Conjures a Patronus for protection against Dementors.",
  },
];

const creatures = [
  { name: "Acromantula", role: "Magical Arachnid", description: "A giant intelligent spider associated with the Forbidden Forest and dangerous magical encounters." },
  { name: "Basilisk", role: "Legendary Serpent", description: "A gigantic magical serpent surrounded by some of the darkest legends in Hogwarts history." },
  { name: "Centaur", role: "Forest Dweller", description: "A magical forest-dwelling being known for astronomy, divination and a deep connection with the natural world." },
  { name: "Dementor", role: "Dark Magical Being", description: "A terrifying dark being associated with fear, despair and the guarded world of Azkaban." },
  { name: "Dragon", role: "Magical Beast", description: "One of the most powerful magical creatures, known for immense strength, fire and formidable presence." },
  { name: "Hippogriff", role: "Magical Beast", description: "A proud creature combining the features of an eagle and a horse, requiring respect and careful manners." },
  { name: "Phoenix", role: "Magical Bird", description: "A rare magical bird associated with rebirth, loyalty and remarkable magical properties." },
  { name: "Thestral", role: "Winged Creature", description: "A mysterious winged creature known for its skeletal appearance and connection to those who have witnessed death." },
];

/* =========================================================
   SCROLL
========================================================= */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

/* =========================================================
   CINEMATIC BACKGROUND
========================================================= */

function CinematicBackground() {
  return (
    <div className="cinematic-background" aria-hidden="true">
      <div className="sky-stars stars-one" />
      <div className="sky-stars stars-two" />
      <div className="moon-glow" />

      <div className="background-fog fog-one" />
      <div className="background-fog fog-two" />
      <div className="background-fog fog-three" />

      <div className="background-grain" />
      <div className="background-vignette" />
    </div>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function Navigation({ musicOn, toggleMusic }) {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "The Castle", path: "/hogwarts" },
    { label: "Sorting", path: "/sorting" },
    { label: "Houses", path: "/houses" },
    { label: "Classrooms", path: "/classes" },
    { label: "Characters", path: "/characters" },
    { label: "Professors", path: "/professors" },
    { label: "Spells", path: "/spells" },
    { label: "Artifacts", path: "/artifacts" },
    { label: "Creatures", path: "/creatures" },
    { label: "Families", path: "/families" },
    { label: "Grounds", path: "/grounds" },
    { label: "Quidditch", path: "/quidditch" },
    { label: "Wizarding", path: "/wizarding" },
    { label: "Villains", path: "/villains" },
    { label: "Atmosphere", path: "/atmosphere" },
    { label: "Archive", path: "/library" },
  ];

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-main">HOGWARTS</span>
          <span className="brand-sub">THE WIZARDING ARCHIVE</span>
        </Link>

        <nav className="main-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="music-button"
          onClick={toggleMusic}
          aria-label={musicOn ? "Mute music" : "Play music"}
        >
          <span className={musicOn ? "music-dot playing" : "music-dot"} />
          {musicOn ? "MUSIC ON" : "MUSIC OFF"}
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   WORLD LAYOUT + MUSIC
========================================================= */

function WorldLayout() {
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(() => {
    return localStorage.getItem("wizardMusic") === "true";
  });

  const startMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      audio.volume = 0.42;
      await audio.play();

      setMusicOn(true);
      localStorage.setItem("wizardMusic", "true");
    } catch (error) {
      console.log("Music playback was blocked by the browser.");
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      localStorage.setItem("wizardMusic", "false");
      return;
    }

    try {
      audio.volume = 0.42;
      await audio.play();

      setMusicOn(true);
      localStorage.setItem("wizardMusic", "true");
    } catch (error) {
      console.log("Music playback was blocked by the browser.");
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.42;

    if (musicOn) {
      audio.play().catch(() => {
        // Browser autoplay protection.
      });
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} src={bgm} preload="auto" />

      <CinematicBackground />

      <Navigation
        musicOn={musicOn}
        toggleMusic={toggleMusic}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage startMusic={startMusic} />}
          />

          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/hogwarts" element={<HogwartsPage />} />
          <Route path="/houses" element={<HousesPage />} />
          <Route path="/houses/:houseId" element={<HouseDetailPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/professors" element={<ProfessorsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/spells" element={<SpellsPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path="/creatures" element={<CreaturesPage />} />
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/grounds" element={<GroundsPage />} />
          <Route path="/quidditch" element={<QuidditchPage />} />
          <Route path="/wizarding" element={<WizardingPage />} />
          <Route path="/villains" element={<VillainsPage />} />
          <Route path="/atmosphere" element={<AtmospherePage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   WIZARDING WORLD ENTRY
========================================================= */

function WizardingWorldEntry({ onEnter, entering }) {
  return (
    <section className="wizarding-entry">
      <div className="entry-background" />
      <div className="entry-overlay" />
      <div className="entry-fog entry-fog-one" />
      <div className="entry-fog entry-fog-two" />

      {entering && (
        <div className="entry-transition-symbol" aria-hidden="true">
          <span className="harry-scar-mark" />
        </div>
      )}

      <div className="entry-content">
        <p className="entry-kicker">THE WIZARDING WORLD</p>

        <div className="entry-symbol" aria-hidden="true">
          <span className="harry-scar-mark" />
        </div>

        <h1>HOGWARTS</h1>
        <div className="entry-rule" />
        <p className="entry-subtitle">A WORLD OF MAGIC AWAITS</p>

        <button className="entry-button" onClick={onEnter}>
          <span>ENTER THE WIZARDING WORLD</span>
          <span className="entry-button-arrow">→</span>
        </button>

        <p className="entry-note">Turn your sound on for the full atmosphere.</p>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({ startMusic }) {
  const [entered, setEntered] = useState(() => {
    return sessionStorage.getItem("wizardingWorldEntered") === "true";
  });
  const [entering, setEntering] = useState(false);

  const enterWorld = async () => {
    if (entering || entered) return;

    setEntering(true);
    await startMusic();

    setTimeout(() => {
      sessionStorage.setItem("wizardingWorldEntered", "true");
      setEntered(true);
      setEntering(false);
    }, 900);
  };

  if (!entered) {
    return (
      <div className={entering ? "home-entry-wrapper entering" : "home-entry-wrapper"}>
        <WizardingWorldEntry onEnter={enterWorld} entering={entering} />
      </div>
    );
  }

  return (
    <div className="home-page home-page-revealed">

      {/* HERO */}
      <section className="hero-real">

        <div className="hero-image-frame">
          <Link to="/hogwarts" className="castle-image-link">
            <img
              src={hogwartsCastle}
              alt="Hogwarts castle surrounded by mountains and mist"
              className="hero-castle-image"
            />
            <div className="castle-hover-overlay" />
            <span className="castle-explore-label">
              <small>HOGWARTS CASTLE</small>
              <span>EXPLORE THE CASTLE →</span>
            </span>
          </Link>
        </div>

        <div className="hero-blue-overlay" />
        <div className="hero-dark-overlay" />

        <div className="hero-fog hero-fog-a" />
        <div className="hero-fog hero-fog-b" />
        <div className="hero-fog hero-fog-c" />

        <div className="hero-content">

          <p className="hero-kicker">
            THE WIZARDING WORLD
          </p>

          <h1>
            Welcome
            <span>to Hogwarts</span>
          </h1>

          <div className="hero-line" />

          <p className="hero-description">
            The castle awaits beyond the mist.
          </p>

          <div className="hero-cta-group">
            <Link
              to="/hogwarts"
              className="enter-button home-explore-button"
              onClick={startMusic}
            >
              <span>EXPLORE THE CASTLE</span>
              <span className="enter-arrow">→</span>
            </Link>

            <Link
              to="/sorting"
              className="enter-button home-house-button"
            >
              <span>WHICH HOUSE DO YOU BELONG TO?</span>
              <span className="enter-arrow">→</span>
            </Link>
          </div>

          <p className="hero-note">
            Turn your sound on for the full atmosphere.
          </p>

        </div>

        <div className="scroll-indicator">
          <span />
          <small>SCROLL TO DISCOVER</small>
        </div>

      </section>

      {/* ARRIVAL */}
      <section className="arrival-section">

        <div className="section-heading">
          <p className="section-kicker">
            YOUR JOURNEY BEGINS
          </p>

          <h2>
            There is more beyond the gates.
          </h2>

          <p>
            Explore the castle, discover its people,
            learn its subjects and uncover the places
            hidden throughout the grounds.
          </p>
        </div>

        <div className="arrival-grid">

          <Link to="/hogwarts" className="arrival-card">
            <span className="card-number">01</span>
            <h3>The Castle</h3>
            <p>
              Walk through the halls, towers, rooms and
              grounds of Hogwarts.
            </p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/sorting" className="arrival-card">
            <span className="card-number">02</span>
            <h3>Find Your House</h3>
            <p>
              Sit beneath the Sorting Hat and discover
              where you belong.
            </p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/library" className="arrival-card">
            <span className="card-number">03</span>
            <h3>The Archive</h3>
            <p>
              Explore characters, professors, classes,
              spells and magical creatures.
            </p>
            <span className="card-arrow">→</span>
          </Link>

        </div>

      </section>

      {/* ATMOSPHERIC QUOTE */}
      <section className="atmosphere-section">

        <div className="atmosphere-content">

          <span className="atmosphere-mark">✦</span>

          <p>
            SOME PLACES ARE REMEMBERED.
            <br />
            SOME PLACES FEEL LIKE HOME.
          </p>

          <span className="atmosphere-small">
            HOGWARTS
          </span>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   PAGE HERO
========================================================= */

function PageHero({ eyebrow, title, description }) {
  return (
    <section className="page-hero">

      <div className="page-hero-inner">

        <p className="section-kicker">
          {eyebrow}
        </p>

        <h1>{title}</h1>

        <div className="section-rule" />

        {description && (
          <p className="page-description">
            {description}
          </p>
        )}

      </div>

    </section>
  );
}

/* =========================================================
   SORTING PAGE
========================================================= */

function SortingPage() {
  const [name, setName] = useState("");
  const [selectedHouse, setSelectedHouse] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem("wizardName");
    const savedHouse = localStorage.getItem("wizardHouse");

    if (savedName) {
      setName(savedName);

      const cleanName = savedName.trim().toLowerCase();
      const permanentGryffindor =
        cleanName === "nitin" || cleanName === "sachin";

      if (permanentGryffindor) {
        const gryffindor = houses.find(
          (house) => house.name === "Gryffindor"
        );

        setSelectedHouse(gryffindor);
        localStorage.setItem("wizardHouse", "Gryffindor");

        const profileKey = `wizardProfile:${cleanName}`;
        localStorage.setItem(
          profileKey,
          JSON.stringify({
            name: savedName.trim(),
            house: "Gryffindor",
          })
        );

        return;
      }
    }

    if (savedHouse) {
      setSelectedHouse(
        houses.find((house) => house.name === savedHouse) || null
      );
    }
  }, []);

  const rememberExistingWizard = (value) => {
    const cleanName = value.trim().toLowerCase();
    if (!cleanName) return;

    const permanentGryffindor =
      cleanName === "nitin" || cleanName === "sachin";

    if (permanentGryffindor) {
      const gryffindor = houses.find(
        (item) => item.name === "Gryffindor"
      );

      setSelectedHouse(gryffindor);
      localStorage.setItem("wizardName", value.trim());
      localStorage.setItem("wizardHouse", "Gryffindor");
      localStorage.setItem(
        `wizardProfile:${cleanName}`,
        JSON.stringify({
          name: value.trim(),
          house: "Gryffindor",
        })
      );
      return;
    }

    const savedProfile = localStorage.getItem(`wizardProfile:${cleanName}`);

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        const house = houses.find((item) => item.name === profile.house);

        if (house) {
          setSelectedHouse(house);
          localStorage.setItem("wizardName", profile.name);
          localStorage.setItem("wizardHouse", profile.house);
        }
      } catch {
        // Ignore invalid saved profile data.
      }
    }
  };

  const sortWizard = () => {
    const cleanName = name.trim().toLowerCase();

    if (!cleanName) return;

    let house;

    if (
      cleanName === "nitin" ||
      cleanName === "sachin"
    ) {
      house = houses.find(
        (item) => item.name === "Gryffindor"
      );
    } else {
      let total = 0;

      for (let i = 0; i < cleanName.length; i++) {
        total += cleanName.charCodeAt(i) * (i + 1);
      }

      house = houses[total % houses.length];
    }

    setSelectedHouse(house);

    const profileKey = `wizardProfile:${cleanName}`;
    localStorage.setItem(
      profileKey,
      JSON.stringify({
        name: name.trim(),
        house: house.name,
      })
    );

    localStorage.setItem("wizardName", name.trim());
    localStorage.setItem("wizardHouse", house.name);
  };

  const resetSorting = () => {
    setName("");
    setSelectedHouse(null);
    localStorage.removeItem("wizardName");
    localStorage.removeItem("wizardHouse");
  };

  return (
    <div className="inner-page">

      <PageHero
        eyebrow="THE SORTING"
        title="Where do you belong?"
        description="Step forward, sit beneath the Sorting Hat and discover the house waiting for you."
      />

      <section className="sorting-section">

        <div className="sorting-hat">
          <div className="hat-tip" />
          <div className="hat-brim" />
        </div>

        <div className="sorting-form">

          <p className="section-kicker">
            YOUR NAME
          </p>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={(event) => rememberExistingWizard(event.target.value)}
            placeholder="Enter your name..."
          />

          <button
            className="primary-button"
            onClick={sortWizard}
          >
            BEGIN SORTING
          </button>

          {selectedHouse && (
            <div className="sorting-result">

              <span>
                THE HAT HAS SPOKEN
              </span>

              <h2 className={`house-${selectedHouse.name.toLowerCase()}`}>
                {selectedHouse.name}
              </h2>

              <p>
                {selectedHouse.trait}
              </p>

              <div className="sorted-house-preview">
                <img src={findHouseCommonRoomAsset(selectedHouse.name)} alt={`${selectedHouse.name} common room`} />
                <div className="sorted-house-preview-overlay" />
                <div className="sorted-house-preview-content">
                  <span>YOUR COMMON ROOM AWAITS</span>
                  <strong>{selectedHouse.name}</strong>
                </div>
              </div>

              <div className="sorting-result-actions">
                <Link
                  className="primary-button enter-house-button"
                  to={`/houses/${selectedHouse.name.toLowerCase()}`}
                >
                  ENTER THE {selectedHouse.name.toUpperCase()} HOUSE <span>→</span>
                </Link>
                <button className="ghost-button" onClick={resetSorting}>
                  CHOOSE ANOTHER NAME
                </button>
              </div>

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   HOGWARTS
========================================================= */

function HogwartsPage() {
  const castleLocations = [
    ["castle", "Hogwarts Castle", "The Castle", "Hogwarts Castle", "The ancient castle rising above the mountains, filled with towers, halls, classrooms and hidden passages."],
    ["great-hall", "Great Hall", "Castle Interior", "Great Hall", "The heart of Hogwarts, where students gather for meals, ceremonies and important moments."],
    ["courtyard", "Courtyard", "Castle Interior", "Courtyard", "A great open stone space where students cross between different parts of the castle."],
    ["corridors", "Castle Corridors", "Castle Interior", "Castle Corridors", "Long stone passages connecting classrooms, towers and secret corners of Hogwarts."],
    ["grand-staircase", "Grand Staircase", "Castle Interior", "Grand Staircase", "A moving network of staircases leading students through the many levels of the castle."],
    ["library", "Library", "Knowledge", "Library", "A vast collection of magical books and one of the quietest places inside Hogwarts."],
    ["trophy-room", "Trophy Room", "Castle Interior", "Trophy Room", "A room filled with trophies, awards and records celebrating generations of Hogwarts achievement."],
    ["headmasters-office", "Headmaster's Office", "Tower", "Headmaster's Office", "The private office of the Hogwarts headmaster, high above the castle and surrounded by magical artefacts."],
    ["room-of-requirement", "Room of Requirement", "Hidden Space", "Room of Requirement", "A mysterious room that appears when someone has a genuine need for it."],
    ["dungeons", "Dungeons", "Underground", "Dungeons", "Dark stone chambers beneath Hogwarts, including the Potions classroom and ancient corridors."],
    ["astronomy-tower", "Astronomy Tower", "Tower", "Astronomy Tower", "One of the highest points of Hogwarts and the setting for Astronomy lessons beneath the night sky."],
    ["herbology", "Herbology Greenhouses", "Grounds", "Herbology Greenhouses", "Magical greenhouses where students study and cultivate unusual plants and fungi."],
    ["quidditch", "Quidditch Pitch", "Grounds", "Quidditch Pitch", "The Hogwarts pitch where students train, compete and play the wizarding world's famous sport."],
    ["forbidden-forest", "Forbidden Forest", "Grounds", "Forbidden Forest", "A mysterious woodland surrounding Hogwarts and home to many magical creatures."],
    ["black-lake", "Black Lake", "Grounds", "Black Lake", "The great lake beside Hogwarts, home to magical life and surrounded by the castle grounds."],
    ["boathouse", "Boathouse", "Grounds", "Boathouse", "The waterside building where first-year students arrive at Hogwarts by boat."],
    ["hogwarts-bridge", "Hogwarts Bridge", "Castle Grounds", "Hogwarts Bridge", "A dramatic stone crossing connecting the castle grounds and mountains beyond."],
  ].map(([id,title,type,asset,description]) => ({
    id,
    title,
    type,
    image: findCastleAsset(asset) || hogwartsCastleSide,
    description,
  }));

  const [selectedLocation, setSelectedLocation] = useState(null);
  const castleDetailRef = useRef(null);

  useEffect(() => {
    if (!selectedLocation || !castleDetailRef.current) return;
    window.requestAnimationFrame(() => {
      castleDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedLocation]);

  return (
    <div className="castle-gallery-page">
      <section className="castle-gallery-hero">
        <div className="castle-gallery-hero-image"><img src={hogwartsCastleSide} alt="Hogwarts Castle" /><div className="castle-gallery-hero-overlay" /></div>
        <div className="castle-gallery-hero-content">
          <p className="section-kicker">STEP BEYOND THE GATES</p>
          <h1>The Castle</h1><div className="section-rule" />
          <p>Explore Hogwarts through its rooms, towers, classrooms and grounds.</p>
        </div>
      </section>

      <section className="castle-gallery-section">
        <div className="castle-gallery-heading">
          <p className="section-kicker">HOGWARTS, ROOM BY ROOM</p>
          <h2>Choose a place to explore.</h2>
          <p>Click an image and its cinematic information panel will appear below.</p>
        </div>
        <div className="castle-cinematic-grid">
          {castleLocations.map((location,index) => (
            <button type="button" className={`castle-cinematic-card ${selectedLocation?.id === location.id ? "selected" : ""}`} key={location.id} onClick={() => setSelectedLocation(location)}>
              <img src={location.image} alt={location.title} loading="lazy" />
              <div className="castle-cinematic-card-shade" />
              <span className="castle-cinematic-number">{String(index+1).padStart(2,"0")}</span>
              <div className="castle-cinematic-card-title"><small>{location.type}</small><strong>{location.title}</strong><span>VIEW DETAILS →</span></div>
            </button>
          ))}
        </div>
      </section>

      {selectedLocation && (
        <section ref={castleDetailRef} className="castle-cinematic-detail">
          <div className="castle-cinematic-detail-image"><img src={selectedLocation.image} alt={selectedLocation.title} /><div className="castle-cinematic-detail-overlay" /></div>
          <div className="castle-cinematic-detail-content">
            <span>{selectedLocation.type}</span><h2>{selectedLocation.title}</h2><div className="section-rule" />
            <p>{selectedLocation.description}</p>
            <button className="ghost-button" onClick={() => setSelectedLocation(null)}>CLOSE DETAILS <span>×</span></button>
          </div>
        </section>
      )}

      <section className="castle-experience-links">
        <div className="castle-gallery-heading"><p className="section-kicker">KEEP EXPLORING</p><h2>There is magic beyond the rooms.</h2></div>
        <div className="castle-experience-link-grid">
          <Link to="/classes" className="castle-experience-link-card"><span>CLASSES</span><strong>Enter the classrooms →</strong></Link>
          <Link to="/professors" className="castle-experience-link-card"><span>FACULTY</span><strong>Meet the professors →</strong></Link>
          <Link to="/houses" className="castle-experience-link-card"><span>THE HOUSES</span><strong>Discover the common rooms →</strong></Link>
          <Link to="/creatures" className="castle-experience-link-card"><span>CREATURES</span><strong>Explore magical creatures →</strong></Link>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   HOUSES
========================================================= */

function HousesPage() {
  return (
    <div className="inner-page">
      <PageHero eyebrow="THE FOUR HOUSES" title="Four houses. One Hogwarts." description="Each house carries its own traditions, values, common room and history." />
      <section className="content-section">
        <div className="house-grid">
          {houses.map((house, index) => {
            const commonRoom = findHouseCommonRoomAsset(house.name);
            return (
              <article className="house-card house-card-enhanced" key={house.name}>
                <Link to={`/houses/${house.name.toLowerCase()}`} className="house-card-image house-card-image-link" aria-label={`Enter the ${house.name} common room`}>
                  <img src={commonRoom} alt={`${house.name} common room`} loading="lazy" />
                  <span className="house-card-image-cta">ENTER COMMON ROOM →</span>
                </Link>
                <div className="house-card-body">
                  <span className="card-number">0{index + 1}</span>
                  <h2>{house.name}</h2>
                  <span className={`house-accent house-${house.name.toLowerCase()}`}>{house.trait}</span>
                  <p>{house.description}</p>
                  <Link className="primary-button house-enter-button" to={`/houses/${house.name.toLowerCase()}`}>ENTER THE HOUSE <span>→</span></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function HouseDetailPage() {
  const { houseId } = useParams();
  const house = houses.find((item) => item.name.toLowerCase() === houseId?.toLowerCase()) || houses[0];
  const commonRoom = findHouseCommonRoomAsset(house.name);

  return (
    <div className="house-detail-page">
      <section className={`house-detail-hero house-detail-${house.name.toLowerCase()}`}>
        <div className="house-detail-image"><img src={commonRoom} alt={`${house.name} common room`} /></div>
        <div className="house-detail-overlay" />
        <div className="house-detail-content">
          <p className="section-kicker">WELCOME TO</p>
          <h1>{house.name}</h1>
          <div className="section-rule" />
          <p className="house-detail-trait">{house.trait}</p>
          <p>{house.description}</p>
          <Link to="/sorting" className="ghost-button">RETURN TO THE SORTING <span>→</span></Link>
        </div>
      </section>

      <section className="house-detail-info">
        <div><p className="section-kicker">YOUR COMMON ROOM</p><h2>A place to call home.</h2></div>
        <p>The common room is the heart of each house — a place for students to gather, study, rest and share the traditions that make their house unique.</p>
      </section>
    </div>
  );
}

/* =========================================================
   CHARACTERS
========================================================= */

function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const visibleCharacters = characters.filter((character) =>
    Boolean(findCharacterAsset(character.name))
  );

  const openCharacter = (character) => {
    setSelectedCharacter(character);

    window.setTimeout(() => {
      document.getElementById("character-profile-detail")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <div className="inner-page">
      <PageHero
        eyebrow="THE PEOPLE OF THE WIZARDING WORLD"
        title="Characters"
        description="Meet the witches and wizards whose stories became part of Hogwarts history. Click an image to open their profile."
      />

      <section className="content-section character-profile-section">
        <div className="character-profile-grid">
          {visibleCharacters.map((character, index) => {
            const image = findCharacterAsset(character.name);
            const selected = selectedCharacter?.name === character.name;

            return (
              <button
                type="button"
                className={`character-profile-card ${selected ? "selected" : ""}`}
                key={character.name}
                onClick={() => openCharacter(character)}
                aria-label={`Open profile for ${character.name}`}
              >
                <div className="character-profile-image">
                  <img
                    src={image}
                    alt={character.name}
                    loading="lazy"
                  />
                  <div className="character-profile-shade" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>VIEW PROFILE →</b>
                </div>

                <div className="character-profile-info">
                  <small>{character.role}</small>
                  <h2>{character.name}</h2>
                </div>
              </button>
            );
          })}
        </div>

        {selectedCharacter && (
          <section id="character-profile-detail" className="character-profile-detail">
            <div className="character-detail-image">
              <img
                src={findCharacterAsset(selectedCharacter.name)}
                alt={selectedCharacter.name}
              />
              <div className="character-detail-image-shade" />
            </div>

            <div className="character-detail-content">
              <span>WIZARDING WORLD ARCHIVE</span>
              <h2>{selectedCharacter.name}</h2>
              <p className="character-detail-role">{selectedCharacter.role}</p>
              <div className="section-rule" />
              <p>{selectedCharacter.description}</p>

              <button
                type="button"
                className="ghost-button"
                onClick={() => setSelectedCharacter(null)}
              >
                CLOSE PROFILE <span>×</span>
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   PROFESSORS
========================================================= */

function ProfessorsPage() {
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const visibleProfessors = professors.filter((professor) =>
    Boolean(findProfessorAsset(professor.name))
  );

  const openProfessor = (professor) => {
    setSelectedProfessor(professor);

    window.setTimeout(() => {
      document.getElementById("professor-profile-detail")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <div className="inner-page">
      <PageHero
        eyebrow="THE FACULTY"
        title="Professors of Hogwarts"
        description="Meet the teachers who shape life inside the castle. Click a professor to open their full profile."
      />

      <section className="content-section professor-profile-section">
        <div className="professor-profile-grid">
          {visibleProfessors.map((professor, index) => {
            const image = findProfessorAsset(professor.name);
            const selected = selectedProfessor?.name === professor.name;

            return (
              <button
                type="button"
                className={`professor-profile-card ${selected ? "selected" : ""}`}
                key={professor.name}
                onClick={() => openProfessor(professor)}
                aria-label={`Open profile for ${professor.name}`}
              >
                <div className="professor-profile-image">
                  <img src={image} alt={professor.name} loading="lazy" />
                  <div className="professor-profile-shade" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>VIEW PROFILE →</b>
                </div>
                <div className="professor-profile-info">
                  <small>{professor.role}</small>
                  <h2>{professor.name}</h2>
                </div>
              </button>
            );
          })}
        </div>

        {selectedProfessor && (
          <section id="professor-profile-detail" className="professor-profile-detail">
            <div className="professor-detail-image">
              <img
                src={findProfessorAsset(selectedProfessor.name)}
                alt={selectedProfessor.name}
              />
              <div className="professor-detail-image-shade" />
            </div>

            <div className="professor-detail-content">
              <span>HOGWARTS FACULTY</span>
              <h2>{selectedProfessor.name}</h2>
              <p className="professor-detail-role">{selectedProfessor.role}</p>
              <div className="section-rule" />
              <p>{selectedProfessor.description}</p>

              <button
                type="button"
                className="ghost-button"
                onClick={() => setSelectedProfessor(null)}
              >
                CLOSE PROFILE <span>×</span>
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   CLASSES
========================================================= */

function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    if (!selectedClass || !detailRef.current) return;
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedClass]);

  return (
    <div className="inner-page">
      <PageHero
        eyebrow="THE CURRICULUM"
        title="Lessons at Hogwarts"
        description="Step into the classrooms of Hogwarts and discover the subjects taught within its ancient walls."
      />

      <section className="content-section">
        <div className="class-grid classroom-grid">
          {classes.map((classItem, index) => {
            const image = findClassroomAsset(classItem.name);
            const selected = selectedClass?.name === classItem.name;

            return (
              <button
                type="button"
                className={`class-card classroom-card classroom-card-clickable ${selected ? "selected" : ""}`}
                key={classItem.name}
                onClick={() => setSelectedClass(classItem)}
                aria-label={`View details for ${classItem.name}`}
              >
                <div className="classroom-image">
                  <img src={image} alt={`${classItem.name} classroom`} loading="lazy" />
                  <div className="classroom-image-overlay" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>ENTER CLASSROOM →</strong>
                </div>

                <div className="classroom-card-content">
                  <span className="class-professor">{classItem.professor}</span>
                  <h2>{classItem.name}</h2>
                  <p>{classItem.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedClass && (
          <section ref={detailRef} className="classroom-detail-panel">
            <div className="classroom-detail-image">
              <img
                src={findClassroomAsset(selectedClass.name)}
                alt={`${selectedClass.name} classroom`}
              />
              <div className="classroom-detail-image-shade" />
              <span>HOGWARTS CLASSROOM</span>
            </div>

            <div className="classroom-detail-content">
              <p className="section-kicker">{selectedClass.professor}</p>
              <h2>{selectedClass.name}</h2>
              <div className="section-rule" />
              <p>{selectedClass.description}</p>
              <p className="classroom-detail-note">
                Enter the lesson, explore the classroom and discover the magical discipline taught within these walls.
              </p>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setSelectedClass(null)}
              >
                CLOSE CLASSROOM <span>×</span>
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   SPELLS
========================================================= */

function SpellsPage() {
  const items = [
    ["Accio", "Summoning Charm", "Summons an object toward the caster from a distance."],
    ["Alohomora", "Unlocking Charm", "Opens locked doors and other magically secured objects when the enchantment allows it."],
    ["Expecto Patronum", "Patronus Charm", "Conjures a protective Patronus against powerful dark creatures such as Dementors."],
    ["Expelliarmus", "Disarming Charm", "Forces an opponent to release the object or wand they are holding."],
    ["Lumos", "Wand-Lighting Charm", "Creates a light at the tip of the caster's wand."],
    ["Nox", "Wand-Dousing Charm", "Extinguishes the light produced by Lumos."],
    ["Protego", "Shield Charm", "Creates a magical shield that can protect the caster from certain spells and attacks."],
    ["Reparo", "Repairing Charm", "Repairs a broken object when the spell is suitable for the damage."],
    ["Stupefy", "Stunning Spell", "A stunning spell used to incapacitate an opponent without relying on a physical attack."],
    ["Wingardium Leviosa", "Levitation Charm", "Allows an object to be lifted and moved through controlled magical levitation."],
  ].map(([name, role, description]) => ({
    name,
    role,
    description,
    image: findNamedAsset(spellAssets, [name.toLowerCase().replace(/[^a-z0-9]+/g, "-")]),
  })).filter((item) => item.image);

  return (
    <CinematicImageCollectionPage
      eyebrow="SPELLS & CHARMS"
      title="Words with power"
      description="Explore spells and charms from the magical world, each represented by the spell imagery in your archive."
      items={items}
      className="spells-archive-page"
    />
  );
}

/* =========================================================
   CREATURES
========================================================= */

function CinematicImageCollectionPage({ eyebrow, title, description, items, className = "" }) {
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    if (!selected || !detailRef.current) return;
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selected]);

  return (
    <div className={`inner-page cinematic-collection-page ${className}`}>
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="content-section cinematic-collection-section">
        <div className="cinematic-collection-grid">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={`cinematic-collection-card ${selected?.name === item.name ? "selected" : ""}`}
              onClick={() => setSelected(item)}
            >
              <div className="cinematic-collection-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="cinematic-collection-shade" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>VIEW DETAILS →</strong>
              </div>
              <div className="cinematic-collection-card-copy">
                <small>{item.role || item.type || item.category}</small>
                <h2>{item.name}</h2>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <section ref={detailRef} className="cinematic-collection-detail">
            <div className="cinematic-collection-detail-image">
              <img src={selected.image} alt={selected.name} />
              <div />
            </div>
            <div className="cinematic-collection-detail-content">
              <span>{selected.role || selected.type || selected.category}</span>
              <h2>{selected.name}</h2>
              <div className="section-rule" />
              <p>{selected.description}</p>
              {selected.extra && <p className="collection-extra">{selected.extra}</p>}
              <button type="button" className="ghost-button" onClick={() => setSelected(null)}>
                CLOSE DETAILS <span>×</span>
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

function ArtifactsPage() {
  const items = [
    ["Elder Wand", "Legendary Wand", "One of the three legendary Hallows, the Elder Wand is associated with extraordinary magical power."],
    ["Golden Snitch", "Quidditch Artifact", "The tiny golden ball at the heart of a Quidditch match, famous for its speed and wings."],
    ["Hogwarts Letter", "Magical Correspondence", "The letter that formally invites a young witch or wizard to begin their education at Hogwarts."],
    ["Invisibility Cloak", "Deathly Hallow", "A legendary cloak that conceals its wearer and becomes one of the three Deathly Hallows."],
    ["Marauder's Map", "Enchanted Map", "A magical map that reveals the layout of Hogwarts and the movements of people inside it."],
    ["Pensieve", "Memory Artifact", "A magical basin used to store, revisit and examine memories."],
    ["Philosopher's Stone", "Legendary Stone", "A legendary magical stone associated with the creation of the Elixir of Life and the transmutation of metals."],
    ["Resurrection Stone", "Deathly Hallow", "One of the Deathly Hallows, associated with the ability to summon echoes of the departed."],
    ["Sorting Hat", "Hogwarts Artifact", "An enchanted hat that sorts new Hogwarts students into the house that suits them."],
    ["Time-Turner", "Time Artifact", "A magical device associated with carefully controlled travel through time."],
  ].map(([name, role, description]) => ({
    name,
    role,
    description,
    image: findArtifactAsset(name),
  })).filter((item) => item.image);

  return (
    <CinematicImageCollectionPage
      eyebrow="MAGICAL ARTIFACTS"
      title="Objects of legend"
      description="Explore enchanted objects, legendary treasures and everyday magical artifacts from your wizarding archive."
      items={items}
      className="artifacts-archive-page"
    />
  );
}

function CreaturesPage() {
  const items = creatures.map((creature) => ({
    ...creature,
    image: findNamedAsset(creatureAssets, [creature.name]),
  })).filter((item) => item.image);

  return (
    <CinematicImageCollectionPage
      eyebrow="MAGICAL CREATURES"
      title="Creatures of the wizarding world"
      description="Meet the magical beings that inhabit forests, lakes, mountains and the wider wizarding world."
      items={items}
      className="creatures-archive-page"
    />
  );
}

function FamiliesPage() {
  const families = [
    {
      name: "Potter Family",
      role: "A family shaped by courage",
      description: "The Potter family sits at the heart of Hogwarts history through generations of courage, sacrifice and the story of Harry Potter.",
    },
    {
      name: "Weasley Family",
      role: "A large wizarding family",
      description: "The Weasley family is known for its warmth, loyalty and deep connections to Hogwarts and Harry's story.",
    },
    {
      name: "Longbottom Family",
      role: "Courage under pressure",
      description: "The Longbottom family is remembered for courage, sacrifice and Neville's place in the history of Hogwarts.",
    },
    {
      name: "Malfoy Family",
      role: "An old wizarding lineage",
      description: "The Malfoys are an old wizarding family whose history is closely associated with Slytherin traditions and magical influence.",
    },
    {
      name: "Granger Family",
      role: "A Muggle family",
      description: "The Grangers are Hermione's Muggle parents, representing the family life she leaves behind when she enters the wizarding world.",
    },
    {
      name: "Lovegood Family",
      role: "A distinctive wizarding family",
      description: "The Lovegoods are known for their independent outlook, unusual beliefs and Luna Lovegood's connection to Hogwarts.",
    },
  ].map((family) => ({
    ...family,
    image: findFamilyAsset(family.name),
  })).filter((family) => family.image);

  return (
    <CinematicImageCollectionPage
      eyebrow="WIZARDING BLOODLINES"
      title="Families"
      description="Explore the families and lineages connected to the people of the wizarding world. Each portrait uses the dedicated family artwork from your archive."
      items={families}
      className="families-archive-page"
    />
  );
}

function GroundsPage() {
  const items = [
    ["Forbidden Forest", "Ancient Woodland", "A mysterious forest surrounding Hogwarts and home to countless magical creatures."],
    ["Hagrid's Hut", "Keeper's Home", "A warm hut on the edge of the grounds where Hagrid lives among his beloved creatures."],
    ["Hogwarts Bridge", "Castle Grounds", "A dramatic bridge spanning the grounds and giving students a striking route through the Hogwarts landscape."],
    ["Quidditch Pitch", "Wizarding Sport", "The Hogwarts pitch where students train, compete and play the most famous sport in the wizarding world."],
    ["Whomping Willow", "Magical Tree", "A famously dangerous magical tree standing on the Hogwarts grounds with branches that move on their own."],
  ].map(([name, role, description]) => ({ name, role, description, image: findGroundsAsset(name) })).filter((item) => item.image);

  return <CinematicImageCollectionPage eyebrow="THE HOGWARTS GROUNDS" title="Beyond the Castle" description="Explore the forests, paths, bridges and landmarks surrounding Hogwarts." items={items} className="grounds-archive-page" />;
}

function QuidditchPage() {
  const items = [
    ["Gryffindor Quidditch", "House Team", "The red and gold side of Hogwarts takes to the pitch with speed, teamwork and fierce house pride."],
    ["Quidditch Cup", "The Prize", "The cup represents the glory of winning the Hogwarts Quidditch competition."],
    ["Quidditch Match", "Match Day", "A Hogwarts Quidditch match brings the school together around the pitch and the changing house score."],
    ["Quidditch Pitch", "The Arena", "The open-air pitch is the centre of training, matches and unforgettable Hogwarts sporting moments."],
    ["Quidditch Player", "The Players", "Every position demands skill, timing and courage as players race through the air on broomsticks."],
    ["Quidditch Score Banners", "House Pride", "House colours and score banners turn the pitch into a living display of Hogwarts competition."],
  ].map(([name, role, description]) => ({ name, role, description, image: findQuidditchAsset(name) })).filter((item) => item.image);

  return <CinematicImageCollectionPage eyebrow="THE WIZARDING SPORT" title="Quidditch" description="Enter the pitch, discover the match-day atmosphere and explore the traditions of Hogwarts Quidditch." items={items} className="quidditch-archive-page" />;
}

function WizardingPage() {
  const items = [
    ["Ancient Potions", "Magical Knowledge", "Old potion lore begins with ingredients, careful preparation and the accumulated knowledge of generations of witches and wizards."],
    ["Magical Books", "Wizarding Knowledge", "Books preserve spells, history, creatures and magical theory across the wizarding world."],
    ["Potion Ingredients", "Potions", "Magical ingredients are the foundation of potion-making, where precision and knowledge matter at every stage."],
    ["Wizarding Desk", "Daily Wizarding Life", "A wizarding desk is a small glimpse into the objects, notes and tools that fill magical everyday life."],
    ["Wizarding Parchment", "Messages & Records", "Parchment carries letters, notes, schoolwork and records throughout the magical world."],
  ].map(([name, role, description]) => ({ name, role, description, image: findWizardingAsset(name) })).filter((item) => item.image);

  return <CinematicImageCollectionPage eyebrow="THE WIDER WORLD" title="Wizarding World" description="Explore the objects, knowledge and everyday details that make the magical world feel alive." items={items} className="wizarding-archive-page" />;
}

function VillainsPage() {
  const items = [
    ["Barty Crouch Jr.", "Dark Wizard", "A Death Eater whose story becomes deeply connected to the events surrounding Hogwarts and the return of Voldemort."],
    ["Bellatrix Lestrange", "Death Eater", "A powerful dark witch whose loyalty to Voldemort places her among the most dangerous figures of the era."],
    ["Dolores Umbridge", "Ministry Official", "A Ministry-appointed Hogwarts authority whose rigid rule and methods leave a lasting mark on the school."],
    ["Fenrir Greyback", "Werewolf", "A feared werewolf associated with the darker side of the wizarding conflict."],
    ["Lucius Malfoy", "Death Eater", "A wealthy wizard whose family influence, ambition and connections place him close to the darker political currents of the wizarding world."],
    ["Peter Pettigrew", "Traitor", "A former Hogwarts student whose betrayal becomes one of the darkest chapters in the history of Harry's family."],
    ["Lord Voldemort", "Dark Wizard", "The central dark wizard whose rise and conflict with Harry Potter shape the modern history of the wizarding world."],
  ].map(([name, role, description]) => ({ name, role, description, image: findVillainAsset(name) })).filter((item) => item.image);

  return <CinematicImageCollectionPage eyebrow="THE DARK SIDE" title="Villains" description="Explore the dark figures whose choices shaped some of the most dangerous chapters of wizarding history." items={items} className="villains-archive-page" />;
}

function AtmospherePage() {
  const items = [
    ["Castle Under Moonlight", "Moonlit Hogwarts", "Hogwarts after dark, when the towers and windows become silhouettes beneath the moon."],
    ["Great Hall Candles", "Candlelight", "The Great Hall glows beneath hundreds of floating candles, creating one of Hogwarts' most recognisable moods."],
    ["Great Hall Feast", "Feast Night", "The Great Hall becomes a gathering place of food, candles, house colours and celebration."],
    ["Hogwarts at Night", "Nightfall", "The castle takes on a quieter, mysterious character after the students have returned to their common rooms."],
    ["Hogwarts at Sunset", "Golden Hour", "Warm sunset light catches the castle towers and turns the landscape into a cinematic Hogwarts moment."],
    ["Hogwarts Courtyard at Night", "Night Courtyard", "The courtyard becomes atmospheric and still beneath the night sky."],
    ["Hogwarts from the Lake", "Lake View", "See Hogwarts from the water, with the castle rising above the dark landscape."],
    ["Hogwarts in Mist", "Mist & Fog", "Mist moves around the castle and grounds, giving Hogwarts its mysterious mountain atmosphere."],
    ["Hogwarts in Winter", "Winter", "Snow and cold transform the castle into a quiet winter landscape."],
    ["Hogwarts Snowy Grounds", "Snowy Grounds", "The grounds become a magical winter scene beneath fresh snow."],
  ].map(([name, role, description]) => ({ name, role, description, image: findAtmosphereAsset(name) })).filter((item) => item.image);

  return <CinematicImageCollectionPage eyebrow="THE FEEL OF HOGWARTS" title="Atmosphere" description="Step into the moods, seasons, light and landscapes that make Hogwarts feel like a world of its own." items={items} className="atmosphere-archive-page" />;
}

/* =========================================================
   LIBRARY
========================================================= */

function LibraryPage() {
  return (
    <div className="inner-page">

      <PageHero
        eyebrow="THE ARCHIVE"
        title="The Hogwarts Library"
        description="A growing archive of the castle, its people, its lessons and the magical world beyond its walls."
      />

      <section className="library-section">

        <div className="library-shelves">

          <div className="library-shelf">
            <span>CHARACTERS</span>
            <span>PROFESSORS</span>
            <span>HOUSES</span>
          </div>

          <div className="library-shelf">
            <span>CLASSES</span>
            <span>SPELLS</span>
            <span>CREATURES</span>
          </div>

          <div className="library-shelf">
            <span>CASTLE</span>
            <span>GROUNDS</span>
            <span>HISTORY</span>
          </div>

        </div>

        <div className="library-links">

          <Link to="/characters">
            Characters →
          </Link>

          <Link to="/professors">
            Professors →
          </Link>

          <Link to="/houses">
            Houses →
          </Link>

          <Link to="/classes">
            Classes →
          </Link>

          <Link to="/spells">
            Spells →
          </Link>

          <Link to="/artifacts">
            Artifacts →
          </Link>

          <Link to="/creatures">Creatures →</Link>
          <Link to="/families">Families →</Link>
          <Link to="/grounds">Grounds →</Link>
          <Link to="/quidditch">Quidditch →</Link>
          <Link to="/wizarding">Wizarding World →</Link>
          <Link to="/villains">Villains →</Link>
          <Link to="/atmosphere">Atmosphere →</Link>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-inner">

        <div>
          <span className="footer-brand">
            HOGWARTS
          </span>

          <p>
            THE WIZARDING ARCHIVE
          </p>
        </div>

        <div className="footer-links">

          <Link to="/hogwarts">Castle</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/characters">Characters</Link>
          <Link to="/creatures">Creatures</Link>
          <Link to="/artifacts">Artifacts</Link>
          <Link to="/grounds">Grounds</Link>
          <Link to="/villains">Villains</Link>
          <Link to="/library">Archive</Link>

        </div>

      </div>

      <div className="footer-bottom">
        Unofficial fan-made wizarding archive.
      </div>

    </footer>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <WorldLayout />

    </BrowserRouter>
  );
}