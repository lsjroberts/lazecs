export type Ctr<T = {}> = new () => T;

export type EntityPair<T extends Ctr> = [T, Properties<InstanceType<T>>];
export type Properties<T> = {
    [Key in keyof T as T[Key] extends Function ? never : Key]: T[Key];
};

export type StartupSystem = (commands: Commands) => void;
export type System = () => void;

export type FilterType = { has: Ctr } | { without: Ctr };

export interface App {
    add_plugin(plugin: Plugin, props?: Properties<InstanceType<Plugin>>): App;
    add_startup_system(system: StartupSystem): App;
    add_system(system: System): App;
    run(): void;
}

export interface Commands {
    spawn<T extends Ctr, U extends Ctr, V extends Ctr>(
        pair: EntityPair<T>,
        pair2?: EntityPair<U>,
        pair3?: EntityPair<V>
    ): void;
}

export type Plugin = Ctr<PluginInterface>;
export interface PluginInterface {
    build(app: App): void;
}
