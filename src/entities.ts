import { Ctr } from './types';

let __id = 0;
const entities = new Set();

export function nextEntity() {
    __id++;
    while (entities.has(__id)) {
        __id++;
    }
    entities.add(__id);
    return __id;
}

export const componentMap = new Map<Ctr, Map<number, object>>();
export const componentEntityMap = new Map<Ctr, Set<number>>();
export const entityMap = new Map<number, Set<Ctr>>();
