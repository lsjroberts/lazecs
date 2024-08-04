import { ScheduleInterface, ScheduleLabel, System } from './types';

export const scheduleMap = new Map<ScheduleLabel, ScheduleInterface>();

export class Schedule implements ScheduleInterface {
    private systems: Array<System> = [];

    constructor(public readonly label: ScheduleLabel) {}

    add_systems(...systems: Array<System>): Schedule {
        this.systems.push(...systems);
        return this;
    }

    async run() {
        for (const system of this.systems) {
            system();
        }
    }
}

//

export class PreStartup implements ScheduleLabel {}

export class Startup implements ScheduleLabel {
    static run_startup() {}
}

export class PostStartup implements ScheduleLabel {}

export class First implements ScheduleLabel {}

export class PreUpdate implements ScheduleLabel {}

export class StateTransition implements ScheduleLabel {}

export class RunFixedMainLoop implements ScheduleLabel {}

export class FixedFirst implements ScheduleLabel {}

export class FixedPreUpdate implements ScheduleLabel {}

export class FixedUpdate implements ScheduleLabel {}

export class FixedPostUpdate implements ScheduleLabel {}

export class FixedLast implements ScheduleLabel {}

export class FixedMain implements ScheduleLabel {
    static run_fixed_main() {}
}

export class Main implements ScheduleLabel {
    static run_main() {}
}

export class Update implements ScheduleLabel {
    static run_update() {}
}

export class PostUpdate implements ScheduleLabel {}

export class Last implements ScheduleLabel {}
