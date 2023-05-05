export const setValue = (storageKey: string, value: string | object | boolean) => {
  localStorage.setItem(storageKey, JSON.stringify(value));
};

export const getValue = (storageKey: string) => {
  return JSON.parse(localStorage.getItem(storageKey));
};

export const removeValue = (storageKey: string) => {
  localStorage.removeItem(storageKey);
};
