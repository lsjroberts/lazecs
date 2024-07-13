import { CommandsClass } from './commands';
import { App, Plugin, Properties, StartupSystem, System } from './types';

export class AppClass implements App {
    commands = new CommandsClass();
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
