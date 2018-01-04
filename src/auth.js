import firebase from "./firebase";
import store from "store";

export function setUserKey(key) {
  store.set("userKey", key);
}

export function getUserKey() {
  return store.get("userKey");
}

export function logout() {
  firebase.logout();
}

export function getUser() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
}
