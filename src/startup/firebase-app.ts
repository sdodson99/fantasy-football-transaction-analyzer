import * as firebase from 'firebase-admin';

type FirebaseAppState = {
  isLoaded: boolean;
  app?: firebase.app.App;
};

const state: FirebaseAppState = {
  isLoaded: false,
};

export const getFirebaseApp = () => {
  if (!state.isLoaded) {
    state.app = firebase.initializeApp();
    state.isLoaded = true;
  }

  if (!state.app) {
    throw new Error('Failed to load Firebase app.');
  }

  return state.app;
};
