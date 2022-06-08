import { compareSync, hashSync } from 'bcrypt';

export function hash(inputStr: string) {
  return hashSync(inputStr, 8);
}

export function compareHash(inputStr: string, hashStr: string) {
  return compareSync(inputStr, hashStr);
}