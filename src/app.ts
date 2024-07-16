import {
    App,
    Ctr,
    Plugin,
    Properties,
    ScheduleInterface,
    ScheduleLabel,
    System,
} from './types';
import { Startup, Update, scheduleMap } from './schedules';

import { resourceMap } from './resources';

export class AppClass implements App {
    add_schedule(schedule: ScheduleInterface): App {
        return this;
    }

    add_systems(schedule: ScheduleLabel, ...systems: Array<System>) {
        const sch = scheduleMap.get(schedule);

        if (!sch) {
            throw new Error(`No schedule registered for ${schedule}.`);
        }

        sch.add_systems(...systems);

        return this;
    }

    add_plugin(plugin: Plugin, props?: Properties<InstanceType<Plugin>>) {
        const plug: any = new plugin();
        for (const [key, value] of Object.entries(props ?? {})) {
            plug[key] = value;
        }
        plug.build(this);

        return this;
    }

    insert_resource<T>(resource: Ctr, initial_value: T): App {
        resourceMap.set(resource, initial_value);
        return this;
    }

    async run() {
        await scheduleMap.get(Startup)?.run();
        this.frame();
    }

    private frame() {
        requestAnimationFrame(async () => {
            await scheduleMap.get(Update)?.run();
            this.frame();
        });
    }
}
