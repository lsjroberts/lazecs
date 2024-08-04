import {
    App,
    Ctr,
    Plugin,
    Properties,
    ScheduleInterface,
    ScheduleLabel,
    System,
} from './types';
import {
    MainSchedulePlugin,
    StartupSchedulePlugin,
    UpdateSchedulePlugin,
} from './plugins';
import { Startup, Update, scheduleMap } from './schedules';

import { entityChangedMap } from './entities';
import { resourceMap } from './resources';

export class AppClass implements App {
    constructor() {
        this.add_plugin(StartupSchedulePlugin)
            .add_plugin(MainSchedulePlugin)
            .add_plugin(UpdateSchedulePlugin);
    }

    add_schedule(schedule: ScheduleInterface): App {
        scheduleMap.set(schedule.label, schedule);
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
            entityChangedMap.clear();
            this.frame();
        });
    }
}
