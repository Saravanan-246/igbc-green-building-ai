import { useSyncExternalStore } from "react";

export const AUTH_TOKEN_KEY = "igbc_auth_token";
export const AUTH_USER_KEY = "igbc_auth_user";
export const REMEMBER_EMAIL_KEY = "igbc_remember_email";

const defaultUser = {
  name: "IGBC User",
  email: "user@igbc.ai",
  role: "Company User",
};

const listeners = new Set();
let currentState =
  typeof window === "undefined"
    ? { isAuthenticated: false, token: null, user: null }
    : readStorage();

function readStorage() {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);

  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  return {
    isAuthenticated: Boolean(token),
    token,
    user,
  };
}

function emitChange() {
  currentState = readStorage();
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentState;
}

export function signIn({ email, name = "IGBC User", remember = false }) {
  const user = {
    ...defaultUser,
    name,
    email,
  };

  window.localStorage.setItem(AUTH_TOKEN_KEY, "mock-igbc-session-token");
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  if (remember) {
    window.localStorage.setItem(REMEMBER_EMAIL_KEY, email);
  } else {
    window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
  }

  emitChange();
  return user;
}

export function signUp({ name, email }) {
  return signIn({ name, email, remember: true });
}

export function logout() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  emitChange();
}

export function getRememberedEmail() {
  return window.localStorage.getItem(REMEMBER_EMAIL_KEY) || "";
}

export function useAuthStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...state,
    signIn,
    signUp,
    logout,
  };
}
