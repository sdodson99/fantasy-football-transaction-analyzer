import * as firebase from 'firebase-admin';
import { promises as fs } from 'fs';
import { when } from 'jest-when';
import { FirebaseStorageJsonFileReader } from '../firebase-storage-json-file-reader';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
const mockReadFile = fs.readFile as jest.Mock;

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

  afterEach(() => {
    mockReadFile.mockReset();
  });

  it('should return parsed JSON file content for file', async () => {
    mockReadFile.mockReturnValue('{ "hello": "world" }');

    const data = await fileReader.read(fileName);

    expect(data).toEqual({ hello: 'world' });
  });

  it('should download file from Firebase storage', async () => {
    mockReadFile.mockReturnValue('{ "hello": "world" }');

    await fileReader.read(fileName);

    expect(mockFirebaseStorageDownload).toBeCalledWith({
      destination: './fileName.json',
      validation: false,
    });
  });
});
