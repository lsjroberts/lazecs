export class App {
    commands = new Commands();
    startup_systems: Array<StartupSystem> = [];
    systems: Array<System> = [];

    add_plugin(plugin: Plugin, props?: Properties<InstanceType<Plugin>>) {
        const plug: any = new plugin();
        for (const [key, value] of Object.entries(props ?? {})) {
            plug[key] = value;
        }
        plug.build(this);
        return this;
    }

    add_startup_system(system: StartupSystem) {
        this.startup_systems.push(system);
        return this;
    }

    add_system(system: System) {
        this.systems.push(system);
        return this;
    }

    run() {
        for (const system of this.startup_systems) {
            system(this.commands);
        }

        for (const system of this.systems) {
            system();
        }
    }
}

export class Commands {
    spawn<T extends Ctr, U extends Ctr, V extends Ctr>(
        pair: EntityPair<T>,
        pair2?: EntityPair<U>,
        pair3?: EntityPair<V>
    ) {
        const entity = nextEntity();
        const container = new Set<Ctr>();

        this.attachComponent(entity, container, pair);
        if (pair2) this.attachComponent(entity, container, pair2);
        if (pair3) this.attachComponent(entity, container, pair3);

        entityMap.set(entity, container);
    }

    private attachComponent<T extends Ctr>(
        entity: number,
        container: Set<T>,
        pair: EntityPair<T>
    ) {
        const [component, props] = pair;
        const target: any = new component();
        for (const [key, value] of Object.entries(props)) {
            target[key] = value;
        }

        container.add(component);

        const comp = componentMap.get(component) ?? new Map();
        comp.set(entity, target);
        componentMap.set(component, comp);

        const entityComp = entityComponentMap.get(component) ?? new Set();
        entityComp.add(entity);
        entityComponentMap.set(component, entityComp);
    }
}

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

// export function* query<T extends Constructor>(component: T, filter?: Filter): Generator<T> {
//     for (const [id, obj] of componentMap.get(component) ?? []) {
//         const entity = entityMap.get(id);
//         if (filter?.has && entity?.has(filter.has) === false) continue;
//         if (filter?.without && entity?.has(filter.without)) continue;
//         yield obj as InstanceType<T>;
//     }
// }

// export function* query2<T extends Constructor, U extends Constructor>(
//     component: [T, U],
//     filter?: Filter
// ) {
//     let entities;
//     for (const comp of component) {
//         const componentEntities = entityComponentMap.get(comp) ?? new Set();

//         if (entities) {
//             entities = intersection(entities, componentEntities);
//         } else {
//             entities = new Set(componentEntities.values());
//         }
//     }

//     for (const id of entities ?? []) {
//         yield [
//             componentMap.get(component[0])!.get(id)!,
//             componentMap.get(component[1])!.get(id)!,
//         ] as [InstanceType<T>, InstanceType<U>];
//     }
// }

export function has<T extends Ctr>(component: T) {
    return new Filter({ has: component });
}

export function without<T extends Ctr>(component: T) {
    return new Filter({ without: component });
}

// ------------------------

export class DOMPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        console.log("dom");
    }
}

export class DefaultPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.add_startup_system(this.canvas.bind(this));
    }

    private canvas() {
        const element = document.getElementById(this.root);

        if (!element) return;

        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.backgroundColor = "black";

        element.appendChild(canvas);
    }
}

// ------------------------

let __id = 0;

const entities = new Set();
function nextEntity() {
    __id++;
    while (entities.has(__id)) {
        __id++;
    }
    entities.add(__id);
    return __id;
}

const componentMap = new Map<Ctr, Map<number, object>>();
const entityMap = new Map<number, Set<Ctr>>();
const entityComponentMap = new Map<Ctr, Set<number>>();

type Ctr<T = {}> = new () => T;

type EntityPair<T extends Ctr> = [T, Properties<InstanceType<T>>];
type Properties<T> = {
    [Key in keyof T as T[Key] extends Function ? never : Key]: T[Key];
};

type StartupSystem = (commands: Commands) => void;
type System = () => void;

type FilterType = { has: Ctr } | { without: Ctr };
class Filter {
    has?: Ctr;
    without?: Ctr;

    constructor(filter: FilterType) {
        if ("has" in filter) this.has = filter.has;
        if ("without" in filter) this.without = filter.without;
    }
}

type Plugin = Ctr<PluginInterface>;
interface PluginInterface {
    build(app: App): void;
}

function intersection(a: Set<number>, b: Set<number>) {
    return new Set([...a].filter((x) => b.has(x)));
}
