
export function getToken(name) {
  if (window.localStorage) {
    return localStorage.getItem(name);
  }
  return "";
}

export function setToken(name, value) {
  if (window.localStorage) {
    localStorage.setItem(name, value);
  }
}

export function removeToken(name) {
  if (window.localStorage) {
    localStorage.removeItem(name);
  }
}

