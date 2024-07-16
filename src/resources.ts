import { Ctr } from './types';

export function Resource<T>(target: Ctr) {
    return class extends target {
        value!: T;
    };
}

export const resourceMap = new Map<Ctr, any>();
