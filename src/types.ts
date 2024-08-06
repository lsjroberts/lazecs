export type Entity = number;

export type Ctr<T = {}> = new () => T;

export type EntityPair<T extends Ctr> = [T, Properties<InstanceType<T>>];
export type Properties<T> = {
    [Key in keyof T as T[Key] extends Function ? never : Key]: T[Key];
};

export type System = () => void;

export type FilterType = { has: Ctr } | { without: Ctr } | { changed: Ctr };

export interface App {
    add_schedule(schedule: ScheduleInterface): App;
    add_systems(schedule: ScheduleLabel, ...systems: Array<System>): App;
    add_plugin(plugin: Plugin, props?: Properties<InstanceType<Plugin>>): App;
    insert_resource<T extends Ctr>(
        resource: T,
        initial_value: Properties<InstanceType<T>>
    ): App;
    run(): void;
}

export interface Commands {
    spawn<T extends Ctr, U extends Ctr, V extends Ctr>(
        pair: EntityPair<T>,
        pair2?: EntityPair<U>,
        pair3?: EntityPair<V>
    ): void;
}

export interface ScheduleInterface {
    label: ScheduleLabel;
    add_systems(...systems: Array<System>): ScheduleInterface;
    run(): void;
}
export interface ScheduleLabel {}

export type Plugin = Ctr<PluginInterface>;
export interface PluginInterface {
    build(app: App): void;
}
