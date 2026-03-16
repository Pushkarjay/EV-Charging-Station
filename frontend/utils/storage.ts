// Local storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = (key: string, defaultValue: any = null): any => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

// Session storage utilities
export const setSessionStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

export const getSessionStorage = (key: string, defaultValue: any = null): any => {
  if (typeof window !== 'undefined') {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

// Cookie utilities
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value};${expires};path=/`;
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1);
};
