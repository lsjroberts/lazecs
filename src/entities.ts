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

// Component constructors to map of entity id to component instance
export const componentMap = new Map<Ctr, Map<number, object>>();

// Component constructors to set of entity ids
export const componentEntityMap = new Map<Ctr, Set<number>>();

// Component instances to entity id
export const componentInstanceEntityMap = new Map<object, number>();

// Entity ids to set of component constructors
export const entityMap = new Map<number, Set<Ctr>>();

//
export const entityChangedMap = new Map<number, Set<Ctr>>();
