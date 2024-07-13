import { componentMap, entityComponentMap, entityMap } from './entities';
import { Ctr, FilterType } from './types';

export function query<T extends Ctr, U extends Ctr>(
    component: [T, U],
    filter?: Filter
): {
    [Symbol.iterator](): IterableIterator<[InstanceType<T>, InstanceType<U>]>;
};
export function query<T extends Ctr>(
    component: T,
    filter?: Filter
): {
    [Symbol.iterator](): IterableIterator<InstanceType<T>>;
};
export function query<T extends Ctr, U extends Ctr>(
    component: T | [T, U],
    filter?: Filter
): {
    [Symbol.iterator]():
        | IterableIterator<InstanceType<T>>
        | IterableIterator<[InstanceType<T>, InstanceType<U>]>;
} {
    if (Array.isArray(component)) {
        return {
            *[Symbol.iterator](): IterableIterator<
                [InstanceType<T>, InstanceType<U>]
            > {
                let entities;
                for (const comp of component) {
                    const componentEntities = entityComponentMap.get(comp);
                    if (!componentEntities) return;

                    if (entities) {
                        entities = intersection(entities, componentEntities);
                    } else {
                        entities = new Set(componentEntities.values());
                    }
                }

                if (!entities) return;

                for (const id of entities) {
                    yield [
                        componentMap
                            .get(component[0])!
                            .get(id)! as InstanceType<T>,
                        componentMap
                            .get(component[1])!
                            .get(id)! as InstanceType<U>,
                    ];
                }
            },
        };
    }

    return {
        *[Symbol.iterator](): IterableIterator<InstanceType<T>> {
            for (const [id, obj] of componentMap.get(component) ?? []) {
                const entity = entityMap.get(id);
                if (filter?.has && entity?.has(filter.has) === false) continue;
                if (filter?.without && entity?.has(filter.without)) continue;
                yield obj as InstanceType<T>;
                // yield obj;
            }

            return this;
        },
    };
}

export class Filter {
    has?: Ctr;
    without?: Ctr;

    constructor(filter: FilterType) {
        if ('has' in filter) this.has = filter.has;
        if ('without' in filter) this.without = filter.without;
    }
}

export function has<T extends Ctr>(component: T) {
    return new Filter({ has: component });
}

export function without<T extends Ctr>(component: T) {
    return new Filter({ without: component });
}

// ---

function intersection(a: Set<number>, b: Set<number>) {
    return new Set([...a].filter((x) => b.has(x)));
}
