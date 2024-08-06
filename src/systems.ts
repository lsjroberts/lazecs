import { Ctr, FilterType } from './types';
import {
    componentEntityMap,
    componentMap,
    entityChangedMap,
    entityMap,
} from './entities';

import { resourceMap } from './resources';

export function query<T extends Ctr, U extends Ctr, V extends Ctr>(
    component: [T, U, V],
    filter?: Filter
): {
    [Symbol.iterator](): IterableIterator<
        [InstanceType<T>, InstanceType<U>, InstanceType<V>]
    >;
};
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
export function query<T extends Ctr, U extends Ctr, V extends Ctr>(
    component: T | [T, U] | [T, U, V],
    filter?: Filter
): {
    [Symbol.iterator]():
        | IterableIterator<InstanceType<T>>
        | IterableIterator<[InstanceType<T>, InstanceType<U>]>
        | IterableIterator<[InstanceType<T>, InstanceType<U>, InstanceType<V>]>;
} {
    if (Array.isArray(component)) {
        if (component.length === 3) {
            return {
                *[Symbol.iterator](): IterableIterator<
                    [InstanceType<T>, InstanceType<U>, InstanceType<V>]
                > {
                    let entities;
                    for (const comp of component) {
                        const componentEntities = componentEntityMap.get(comp);
                        if (!componentEntities) return;

                        if (entities) {
                            entities = intersection(
                                entities,
                                componentEntities
                            );
                        } else {
                            entities = new Set(componentEntities.values());
                        }
                    }

                    if (!entities) return;

                    for (const id of entities) {
                        if (is_filtered(id, entityMap.get(id), filter))
                            continue;

                        const t = componentMap
                            .get(component[0])!
                            .get(id)! as InstanceType<T>;

                        const u = componentMap
                            .get(component[1])!
                            .get(id)! as InstanceType<U>;

                        const v = componentMap
                            .get(component[2])!
                            .get(id)! as InstanceType<V>;

                        yield [t, u, v];
                    }
                },
            };
        }

        return {
            *[Symbol.iterator](): IterableIterator<
                [InstanceType<T>, InstanceType<U>]
            > {
                let entities;
                for (const comp of component) {
                    const componentEntities = componentEntityMap.get(comp);
                    if (!componentEntities) return;

                    if (entities) {
                        entities = intersection(entities, componentEntities);
                    } else {
                        entities = new Set(componentEntities.values());
                    }
                }

                if (!entities) return;

                for (const id of entities) {
                    if (is_filtered(id, entityMap.get(id), filter)) continue;

                    const t = componentMap
                        .get(component[0])!
                        .get(id)! as InstanceType<T>;

                    const u = componentMap
                        .get(component[1])!
                        .get(id)! as InstanceType<U>;

                    yield [t, u];
                }
            },
        };
    }

    return {
        *[Symbol.iterator](): IterableIterator<InstanceType<T>> {
            // Shortcut if we are filtering only changed entities and there are none.
            if (filter?.changed && entityChangedMap.size === 0) {
                return this;
            }

            for (const [id, obj] of componentMap.get(component) ?? []) {
                const ctrs = entityMap.get(id);
                if (is_filtered(id, ctrs, filter)) continue;
                yield obj as InstanceType<T>;
            }

            return this;
        },
    };
}

function is_filtered(id: number, ctrs?: Set<Ctr>, filter?: Filter) {
    if (!ctrs || !filter) return false;
    if (filter.has && ctrs.has(filter.has) === false) return true;
    if (filter.without && ctrs.has(filter.without)) return true;
    if (filter.changed) {
        const changedEntity = entityChangedMap.get(id);
        if (changedEntity?.has(filter.changed) !== true) return true;
    }
    return false;
}

export class Filter {
    changed?: Ctr;
    has?: Ctr;
    without?: Ctr;

    constructor(filter: FilterType) {
        if ('changed' in filter) this.changed = filter.changed;
        if ('has' in filter) this.has = filter.has;
        if ('without' in filter) this.without = filter.without;
    }
}

export function changed<T extends Ctr>(component: T) {
    return new Filter({ changed: component });
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

// ---

export function resource<T extends Ctr>(resource: T) {
    return resourceMap.get(resource);
}
