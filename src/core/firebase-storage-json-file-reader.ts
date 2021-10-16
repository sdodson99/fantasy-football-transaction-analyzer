import * as firebase from 'firebase-admin';

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
    return await new Promise((resolve, reject) => {
      this.firebaseApp
        .storage()
        .bucket()
        .file(fileName)
        .download({ validation: false }, (err, fileBuffer) => {
          if (err) {
            return reject(err);
          }

          const data = JSON.parse(fileBuffer.toString());

          resolve(data);
        });
    });
  }
}
