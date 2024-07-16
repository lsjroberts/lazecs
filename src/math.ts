import { Ctr } from './types';

export function Vec2(target: Ctr) {
    return class extends target {
        x!: number;
        y!: number;
    };
}
