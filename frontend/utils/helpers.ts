// Array utilities
export const chunk = (array: any[], size: number): any[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = (array: any[]): any[] => {
  return [...new Set(array)];
};

export const flatten = (array: any[]): any[] => {
  return array.reduce((acc, val) => acc.concat(val), []);
};

export const groupBy = (array: any[], key: string): Record<string, any[]> => {
  return array.reduce((acc, obj) => {
    const groupKey = obj[key];
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(obj);
    return acc;
  }, {});
};

// Object utilities
export const pick = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
  const result: Record<string, any> = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export const merge = (...objects: Record<string, any>[]): Record<string, any> => {
  return Object.assign({}, ...objects);
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return '';
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};
