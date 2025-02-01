import { MongoClient, GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env file');
}

async function uploadAudioFiles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const bucket = new GridFSBucket(db);

    const contentData = [
      // Podcasts
      {
        title: "Understanding Anger",
        description: "Expert insights on managing anger",
        duration: "25:00",
        type: "podcast",
        tag: "anger",
        audioPath: path.join(__dirname, "../audio/podcasts/anxiety.mp3")
      },
      // Audiobooks
      {
        title: "Mindfulness Basics",
        description: "Introduction to mindful living",
        duration: "1:30:00",
        type: "audiobook",
        tag: "depression",
        audioPath: path.join(__dirname, "../audio/books/mindfulness.mp3")
      },
      // Music
      {
        title: "Calming Meditation",
        description: "Peaceful background sounds",
        duration: "15:00",
        type: "music",
        tag:"",
        audioPath: path.join(__dirname, "../audio/music/meditation.mp3")
      }
    ];

    for (const content of contentData) {
      if (!fs.existsSync(content.audioPath)) {
        console.warn(`Skipping ${content.title}: File not found at ${content.audioPath}`);
        continue;
      }

      const audioStream = fs.createReadStream(content.audioPath);
      const uploadStream = bucket.openUploadStream(path.basename(content.audioPath));
      
      await new Promise((resolve, reject) => {
        audioStream.pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });

      await db.collection("content").insertOne({
        title: content.title,
        description: content.description,
        duration: content.duration,
        type: content.type,
        audioId: uploadStream.id,
        createdAt: new Date()
      });

      console.log(`Uploaded: ${content.title} (${content.type})`);
    }

  } catch (error) {
    console.error("Error uploading files:", error);
  } finally {
    await client.close();
  }
}

uploadAudioFiles();