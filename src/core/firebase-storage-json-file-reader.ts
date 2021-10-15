import * as firebase from 'firebase-admin';
import { promises as fs } from 'fs';

/**
 * Service to download and read Firebase Storage JSON files.
 */
export class FirebaseStorageJsonFileReader {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Read a Firebase Storage JSON file.
   * @param fileName The stored JSON file to read.
   * @returns The parsed JSON file content.
   */
  async read<T>(fileName: string): Promise<T> {
    const destinationFilePath = `./${fileName}`;

    await this.firebaseApp.storage().bucket().file(fileName).download({
      destination: destinationFilePath,
      validation: false,
    });

    const fileBuffer = await fs.readFile(destinationFilePath);

    return JSON.parse(fileBuffer.toString());
  }
}
