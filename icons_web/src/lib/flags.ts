// Utils for working with bitwise flags

export function hasFlag(flags: number, flag: number): boolean {
  return (flags & flag) !== 0;
}

export function hasAnyFlag(flags: number, flagList: number[]): boolean {
  return flagList.some((flag) => hasFlag(flags, flag));
}

export function setFlag(flags: number, flag: number): number {
  return flags | flag;
}

export function unsetFlag(flags: number, flag: number): number {
  return flags & ~flag;
}

export function toggleFlag(flags: number, flag: number): number {
  return flags ^ flag;
}

export enum UserFlags {
  Admin = 1,
  Staff = 2,
  Trusted = 4,
  Banned = 8,
  AnalyticsOptOut = 16,
}
