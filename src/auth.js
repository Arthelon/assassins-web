import firebase from "./firebase";
import store from "store";

export function setAdmin(flag) {
  store.set("isAdmin", flag);
}

export function isAdmin() {
  return store.get("isAdmin");
}

export function clearUserKey() {
  store.remove("userKey");
}

export function setUserKey(key) {
  store.set("userKey", key);
}

export function getUserKey() {
  return store.get("userKey");
}
