import { get, findKey } from 'lodash';
import * as CONSTANTS from '@/constants';

export const extractNumberFromString = (string) => {
  const matched = string.match(/\d+/g);
  return matched.map(numStr => Number(numStr));
};

export const transformEnumKey = (name, value) => {
  const enumMap = get(CONSTANTS, name, {}); 
  const enumKeyMap = get(CONSTANTS, `${name}_KEY`, {}); 
  const key = findKey(enumKeyMap, (v) => v === value);
  return enumMap[key];
};
