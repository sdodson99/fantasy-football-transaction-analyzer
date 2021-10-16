import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { FirebaseStorageJsonFileReader } from '../firebase-storage-json-file-reader';

describe('FirebaseStorageJsonFileReader', () => {
  let fileReader: FirebaseStorageJsonFileReader;

  let mockFirebaseStorageDownload: jest.Mock;

  let fileName: string;

  beforeEach(() => {
    fileName = 'fileName.json';

    mockFirebaseStorageDownload = jest.fn();
    const mockFile = jest.fn();
    when(mockFile).calledWith(fileName).mockReturnValue({
      download: mockFirebaseStorageDownload,
    });
    const mockFirebaseApp = {
      storage: () => ({
        bucket: () => ({
          file: mockFile,
        }),
      }),
    } as unknown as firebase.app.App;

    fileReader = new FirebaseStorageJsonFileReader(mockFirebaseApp);
  });

  it('should return parsed JSON file content for file', async () => {
    mockFirebaseStorageDownload.mockImplementation((_, cb) => {
      cb(null, '{ "hello": "world" }');
    });

    const data = await fileReader.read(fileName);

    expect(data).toEqual({ hello: 'world' });
  });

  it('should throw error if file read fails', async () => {
    mockFirebaseStorageDownload.mockImplementation((_, cb) => {
      cb(new Error('Error.'), null);
    });

    await expect(async () => await fileReader.read(fileName)).rejects.toThrow();
  });
});
