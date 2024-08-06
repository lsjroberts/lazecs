import { Ctr } from './types';

export function resource<T extends Ctr>(resource: T) {
    const res = resourceMap.get(resource);
    if (!res) {
        throw new Error(
            `Resource [${resource.name}] does not exist in the app.`
        );
    }
    return res as InstanceType<T>;
}

export const resourceMap = new Map<Ctr, any>();
