import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

export async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { attendance: [], notes: [], lessons: [] };
  }
}

export async function writeDB(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing DB:', error);
  }
}
