export function serializePrisma(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => serializePrisma(item));
  }

  if (typeof data === 'object') {
    // If it's a Decimal (has s, e, c properties or d property from library)
    if (data.toNumber && typeof data.toNumber === 'function') {
      return data.toNumber();
    }

    // If it's a Date
    if (data instanceof Date) {
      return data.toISOString();
    }

    const result: any = {};
    for (const key in data) {
      result[key] = serializePrisma(data[key]);
    }
    return result;
  }

  return data;
}
