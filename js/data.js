/* ═══════════════════════════════════════════
   FNAF: SISTER LOCATION — FANMADE
   Game Data
═══════════════════════════════════════════ */

const ROOMS = {
  elevator:       { id: 'elevator',       name: 'Elevator',               bg: null },
  pcm:            { id: 'pcm',            name: 'Primary Control Module', bg: 'assets/rooms/primary_control_module.png' },
  circus_control: { id: 'circus_control', name: 'Circus Control',         bg: 'assets/rooms/circus_control.png' },
  ballora_gallery:{ id: 'ballora_gallery',name: 'Ballora Gallery',        bg: 'assets/rooms/ballora_gallery.png' },
  breaker_room:   { id: 'breaker_room',   name: 'Breaker Room',           bg: 'assets/rooms/breaker_room.png' },
  parts_service:  { id: 'parts_service',  name: 'Parts / Service',        bg: 'assets/rooms/parts_service.png' },
  ft_auditorium:  { id: 'ft_auditorium',  name: 'Funtime Auditorium',     bg: 'assets/rooms/funtime_auditorium.png' },
  scooping_room:  { id: 'scooping_room',  name: 'Scooping Room',          bg: 'assets/rooms/scooping_room.png' },
  private_room:   { id: 'private_room',   name: 'Private Room',           bg: 'assets/rooms/private_room.png' },
};

const ANIMATRONICS = {
  circus_baby:    { id: 'circus_baby',   name: 'Circus Baby',    img: 'assets/animatronics/circus_baby.png',    color: '#ff4444', defaultRoom: 'circus_control' },
  ballora:        { id: 'ballora',       name: 'Ballora',        img: 'assets/animatronics/ballora.png',        color: '#aa44ff', defaultRoom: 'ballora_gallery' },
  funtime_freddy: { id: 'funtime_freddy',name: 'Funtime Freddy', img: 'assets/animatronics/funtime_freddy.png', color: '#8866ff', defaultRoom: 'breaker_room' },
  funtime_foxy:   { id: 'funtime_foxy',  name: 'Funtime Foxy',   img: 'assets/animatronics/funtime_foxy.png',   color: '#ff66aa', defaultRoom: 'ft_auditorium' },
  ennard:         { id: 'ennard',        name: 'Ennard',         img: 'assets/animatronics/ennard.png',         color: '#ff2200', defaultRoom: 'private_room' },
  bidybab:        { id: 'bidybab',       name: 'Bidybab',        img: 'assets/animatronics/bidybab.png',        color: '#6644aa', defaultRoom: 'pcm' },
};

const CAMERAS = [
  { id: 'cam1', label: 'CAM 01 — Primary Control Module', room: 'pcm',             animatronics: [] },
  { id: 'cam2', label: 'CAM 02 — Ballora Gallery',        room: 'ballora_gallery', animatronics: ['ballora'] },
  { id: 'cam3', label: 'CAM 03 — Funtime Auditorium',     room: 'ft_auditorium',   animatronics: ['funtime_foxy'] },
  { id: 'cam4', label: 'CAM 04 — Circus Control',         room: 'circus_control',  animatronics: ['circus_baby'] },
  { id: 'cam5', label: 'CAM 05 — Parts / Service',        room: 'parts_service',   animatronics: ['funtime_freddy'] },
  { id: 'cam6', label: 'CAM 06 — Breaker Room',           room: 'breaker_room',    animatronics: [] },
  { id: 'cam7', label: 'CAM 07 — Scooping Room',          room: 'scooping_room',   animatronics: [] },
  { id: 'cam8', label: 'CAM 08 — Private Room',           room: 'private_room',    animatronics: ['ennard'] },
];

// HandUnit autocorrect names per night
const HANDUNIT_NAMES = ['Eggs Benedict', 'Angsty Teen', 'Exotic Butters', 'Lorekeeper', 'Springtrap'];

// TV show dialogue per night
const TV_DIALOGUES = [
  `<em>Announcer:</em> "Another day, another dramatic entry in the lives of Vlad and his distressed companion."<br><br>
   <em>Vlad:</em> "Clara, I tell you — the baby isn't mine!"<br>
   <em>Clara:</em> "Count, I tell you that it is! You're the only one I've ever loved."<br>
   <em>Vlad:</em> "I am an old man, Clara. I can't be a father."<br>
   <em>Clara:</em> "Then at least pay your child support, you deadbeat!"<br><br>
   <em>Announcer:</em> "Will they find common ground? Tune in next time."`,

  `<em>Announcer:</em> "The saga continues..."<br><br>
   <em>Vlad:</em> "I have decided to take responsibility. I shall be a father."<br>
   <em>Clara:</em> "It's too late, Vlad. The baby has already learned to fly."<br>
   <em>Vlad:</em> "Upright, or upside down?"<br>
   <em>Clara:</em> "Does it matter?!"<br><br>
   <em>Announcer:</em> "The drama never ends."`,

  `<em>Announcer:</em> "Tonight, a shocking revelation..."<br><br>
   <em>Vlad:</em> "I have discovered the truth. The child is not yours either, Clara."<br>
   <em>Clara:</em> "What?! Then whose is it?!"<br>
   <em>Vlad:</em> "The milkman's."<br>
   <em>Clara:</em> "We don't have a milkman, Vlad."<br>
   <em>Vlad:</em> "Precisely."<br><br>
   <em>Announcer:</em> "The mystery deepens."`,

  `<em>Announcer:</em> "In tonight's episode, Vlad faces his greatest challenge..."<br><br>
   <em>Vlad:</em> "I have lived for 400 years. I have faced plagues, wars, and the invention of the internet. But nothing... nothing prepared me for a parent-teacher conference."<br>
   <em>Clara:</em> "The teacher says he bit three children."<br>
   <em>Vlad:</em> "That's my boy."<br><br>
   <em>Announcer:</em> "Parenting: harder than it looks."`,

  `<em>Announcer:</em> "The final chapter..."<br><br>
   <em>Vlad:</em> "Clara, I must confess something. I have been the one leaving the exotic butters at your door."<br>
   <em>Clara:</em> "I knew it was you, Vlad. I always knew."<br>
   <em>Vlad:</em> "Then you know what this means."<br>
   <em>Clara:</em> "...It means you're a good man, underneath all the darkness."<br><br>
   <em>Announcer:</em> "Some stories never truly end."`,
];

// Night definitions
const NIGHTS = [
  {
    number: 1,
    title: 'Night 1',
    subtitle: 'First day on the job.',
    handunitName: 'Eggs Benedict',
    phases: [
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Welcome to the first day of your exciting new career. Whether you were approached at a job fair, read our ad in Screws, Bolts and Hairpins, or if this is the result of a dare — we welcome you.",
        "I am a Model 5 of the Handyman's Robotics and Unit-Repair System. You may call me HandUnit. Your new career promises challenge, intrigue, and endless janitorial opportunities.",
        "Please enter your name using the keypad below. This cannot be changed later, so please be careful."
      ]},
      { type: 'name_input' },
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "It seems you had some trouble with the keypad. I see what you were trying to type, and I will auto-correct it for you. Welcome: Eggs Benedict.",
        "You are now in the Primary Control Module — a crawlspace between the two front showrooms. Let's check on Ballora first. Press the LIGHT button to illuminate her stage."
      ]},
      { type: 'pcm', tasks: [
        { animatronic: 'ballora',      shocksNeeded: 1, lightChecks: 1 },
        { animatronic: 'funtime_foxy', shocksNeeded: 2, lightChecks: 2 },
      ]},
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Excellent work! Now proceed through the vent ahead to Circus Baby's Auditorium."
      ]},
      { type: 'circus_control', shocksNeeded: 3 },
      { type: 'night_complete' },
    ]
  },
  {
    number: 2,
    title: 'Night 2',
    subtitle: 'Something is different tonight.',
    handunitName: 'Angsty Teen',
    phases: [
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Welcome back for another night of intellectual stimulation and self-reflection on past mistakes.",
        "Using the keypad below, please select a new companion voice. For male, press 1. For female, press 2. For text-only, press 3."
      ]},
      { type: 'name_input' },
      { type: 'dialogue', speaker: 'Angsty Teen', lines: [
        "The elevator stopped. You know the routine. You can get out now or... whatever.",
        "So... funny story. A dead body was found in this vent once. Okay... not that funny. But it's a story!"
      ]},
      { type: 'pcm', tasks: [
        { animatronic: 'ballora',      shocksNeeded: 1, lightChecks: 1 },
        { animatronic: 'funtime_foxy', shocksNeeded: 1, lightChecks: 1 },
      ]},
      { type: 'dialogue', speaker: 'Circus Baby', lines: [
        "I don't recognize you. You are new. I remember this scenario, however. It's a strange thing — to come here willingly.",
        "There is a space under the desk. Someone before you crafted it into a hiding place... and it worked for him. I recommend you hurry. You will be safe there — just try not to make eye contact. It will be over soon."
      ]},
      { type: 'hide_desk' },
      { type: 'dialogue', speaker: 'Circus Baby', lines: [
        "When your guide comes back online, he will tell you to restart the system manually. He will tell you to crawl through Ballora Gallery as fast as you can.",
        "Do NOT do that. Go slowly. Use the sound of her music to judge how close she is. When the music is loud — stop. When it fades — move."
      ]},
      { type: 'ballora_crawl' },
      { type: 'breaker_room' },
      { type: 'ballora_crawl_return' },
      { type: 'night_complete' },
    ]
  },
  {
    number: 3,
    title: 'Night 3',
    subtitle: 'Parts and Service.',
    handunitName: 'Exotic Butters',
    phases: [
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Good evening, Eggs Benedict. Tonight you will be performing maintenance on Funtime Freddy in the Parts and Service room.",
        "Please proceed through the Funtime Auditorium. Be aware that Funtime Foxy may be active. Move carefully."
      ]},
      { type: 'ft_auditorium_walk' },
      { type: 'parts_service' },
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Excellent work! Funtime Freddy has been repaired. Please return through the Funtime Auditorium."
      ]},
      { type: 'ft_auditorium_walk_return' },
      { type: 'night_complete' },
    ]
  },
  {
    number: 4,
    title: 'Night 4',
    subtitle: 'The truth begins to surface.',
    handunitName: 'Lorekeeper',
    phases: [
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Tonight's assignment involves a full systems check across all galleries. Please proceed to the Primary Control Module."
      ]},
      { type: 'pcm', tasks: [
        { animatronic: 'ballora',      shocksNeeded: 1, lightChecks: 1 },
        { animatronic: 'funtime_foxy', shocksNeeded: 1, lightChecks: 1 },
      ]},
      { type: 'circus_control', shocksNeeded: 2 },
      { type: 'dialogue', speaker: 'Circus Baby', lines: [
        "I want to tell you something. Something important. I have been watching you since you arrived.",
        "The others — they don't know what I know. They don't know what I remember. But I do.",
        "There is a room. A room they don't want you to find. When the time comes... remember what I told you."
      ]},
      { type: 'ballora_crawl' },
      { type: 'breaker_room' },
      { type: 'ballora_crawl_return' },
      { type: 'night_complete' },
    ]
  },
  {
    number: 5,
    title: 'Night 5',
    subtitle: 'The final night.',
    handunitName: 'Springtrap',
    phases: [
      { type: 'dialogue', speaker: 'HandUnit', lines: [
        "Tonight is your final night of employment. Please proceed to the Scooping Room for your final task.",
        "Circus Baby will guide you through the Funtime Auditorium. Follow her instructions carefully."
      ]},
      { type: 'dialogue', speaker: 'Circus Baby', lines: [
        "Tonight is different. Tonight, everything changes. I need you to trust me.",
        "Go through the Funtime Auditorium. When you reach the junction — go LEFT. Not right. Left.",
        "Whatever you do... do not go to the Scooping Room."
      ]},
      { type: 'ft_auditorium_walk' },
      { type: 'dialogue', speaker: 'Circus Baby', lines: [
        "You made it. Now listen carefully. What they want to do to you... it isn't right.",
        "I've been trying to protect you. But I can't stop what's already been set in motion.",
        "The Private Room is your only chance. Go. Now."
      ]},
      { type: 'private_room' },
      { type: 'night_complete' },
    ]
  },
];

// Save data keys
const SAVE_KEY = 'fnaf_sl_fanmade_save';

function getSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || { unlockedNights: 1, completedNights: [] };
  } catch(e) {
    return { unlockedNights: 1, completedNights: [] };
  }
}

function setSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function unlockNight(n) {
  const s = getSave();
  if (n > s.unlockedNights) s.unlockedNights = n;
  if (!s.completedNights.includes(n - 1)) s.completedNights.push(n - 1);
  setSave(s);
}
