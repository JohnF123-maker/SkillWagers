// Sample challenge templates - run this once to populate the database
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Add your Firebase config here
const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const templates = [
  {
    title: "Chess Speed Match",
    description: "Demonstrate chess skill in a timed match format",
    category: "Chess",
    rules: "Players must complete a 10-minute blitz chess match. Higher rating player must win by at least a 200-point rating difference, or if ratings are similar, must win 2 out of 3 games.",
    proofRequirements: "Screenshot of chess.com or lichess game results showing completion time, final position, and usernames. Must include full game history/PGN.",
    isActive: true,
    createdAt: new Date(),
    createdBy: "system"
  },
  {
    title: "100 Push-ups Challenge",
    description: "Complete 100 consecutive push-ups with proper form",
    category: "Fitness",
    rules: "Perform 100 push-ups in proper form without stopping. Chest must touch ground, arms fully extended. Video must show continuous recording.",
    proofRequirements: "Unedited video recording showing full challenge completion from start to finish. Must be completed within 30 minutes from start.",
    isActive: true,
    createdAt: new Date(),
    createdBy: "system"
  },
  {
    title: "1-Mile Run Under 7 Minutes",
    description: "Complete a 1-mile run in under 7 minutes",
    category: "Fitness",
    rules: "Complete a verified 1-mile distance in under 7 minutes. Must use GPS tracking app for verification.",
    proofRequirements: "Screenshot from GPS running app (Strava, Nike Run Club, etc.) showing distance, time, and route map. Must include app verification.",
    isActive: true,
    createdAt: new Date(),
    createdBy: "system"
  },
  {
    title: "Learn 10 New Words in a Foreign Language",
    description: "Demonstrate mastery of 10 new vocabulary words",
    category: "Learning",
    rules: "Learn 10 new vocabulary words in any foreign language. Must demonstrate understanding through proper usage in sentences.",
    proofRequirements: "Video recording of yourself using each word correctly in a sentence, plus screenshot of language learning app progress (Duolingo, Babbel, etc.).",
    isActive: true,
    createdAt: new Date(),
    createdBy: "system"
  }
];

async function addTemplates() {
  try {
    for (const template of templates) {
      await addDoc(collection(db, 'challengeTemplates'), template);
      console.log('Added template:', template.title);
    }
    console.log('All templates added successfully!');
  } catch (error) {
    console.error('Error adding templates:', error);
  }
}

// Uncomment to run:
// addTemplates();