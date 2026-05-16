// quick localStorage wrapper for the bearer token

const KEY = 'sk_ttm_token';

export function readToken() {
  try {
    return window.localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
}

export function writeToken(tok) {
  try {
    window.localStorage.setItem(KEY, tok);
  } catch (e) {
    // ignore
  }
}

export function wipeToken() {
  try {
    window.localStorage.removeItem(KEY);
  } catch (e) {
    // ignore
  }
}
