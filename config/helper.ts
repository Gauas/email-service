export function get(key: string, def = ""): string {
  const value = process.env[key];

  if (value === undefined || value === "") {
    return def;
  }

  return value;
}

export function mustEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined || value === "") {
    throw new Error(`config: ${key} is required`);
  }

  return value;
}

export function getEnvInt(key: string, def: number): number {
  const value = process.env[key];

  if (value === undefined || value === "") {
    return def;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? def : parsed;
}

export function getEnvBool(key: string, def: boolean): boolean {
  const value = process.env[key];

  if (value === undefined || value === "") {
    return def;
  }

  return value === "true";
}
