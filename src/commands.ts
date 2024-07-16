import { Ctr, EntityPair } from './types';
import {
    componentEntityMap,
    componentMap,
    entityMap,
    nextEntity,
} from './entities';

export class CommandsClass {
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

        const entityComp = componentEntityMap.get(component) ?? new Set();
        entityComp.add(entity);
        componentEntityMap.set(component, entityComp);
    }
}

const commandsInstance = new CommandsClass();

export function commands() {
    return commandsInstance;
}
