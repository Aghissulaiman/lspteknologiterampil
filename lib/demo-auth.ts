const LOGIN_STORAGE_KEY = "lsp-demo-logged-in";
const LOGIN_CHANGE_EVENT = "lsp-demo-login-change";

export function getDemoLoginState() {
  return window.localStorage.getItem(LOGIN_STORAGE_KEY) !== "false";
}

export function setDemoLoginState(isLoggedIn: boolean) {
  window.localStorage.setItem(LOGIN_STORAGE_KEY, String(isLoggedIn));
  window.dispatchEvent(new Event(LOGIN_CHANGE_EVENT));
}

export function subscribeToDemoLoginState(onChange: () => void) {
  window.addEventListener(LOGIN_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LOGIN_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
