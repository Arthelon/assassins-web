import firebase from "firebase";
const config = {
  apiKey: process.env.PREACT_APP_API_KEY,
  authDomain: process.env.PREACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.PREACT_APP_DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.PREACT_APP_STORAGE,
  messagingSenderId: process.env.PREACT_APP_MSG_ID
};
firebase.initializeApp(config);
export default firebase;
