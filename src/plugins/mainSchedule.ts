import { App, PluginInterface } from '../types';
import {
    FixedMain,
    Main,
    PostUpdate,
    PreUpdate,
    Schedule,
    Startup,
    Update,
} from '../schedules';

export class MainSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const main_schedule = new Schedule(Main);
        const fixed_main_schedule = new Schedule(FixedMain);

        app.add_schedule(main_schedule)
            .add_schedule(fixed_main_schedule)
            .add_systems(Main, Main.run_main)
            .add_systems(FixedMain, FixedMain.run_fixed_main)
            .add_plugin(StartupSchedulePlugin)
            .add_plugin(PreUpdateSchedulePlugin)
            .add_plugin(UpdateSchedulePlugin)
            .add_plugin(PostUpdateSchedulePlugin);
    }
}

export class StartupSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const startup_schedule = new Schedule(Startup);

        app.add_schedule(startup_schedule).add_systems(
            Startup,
            Startup.run_startup
        );
    }
}

export class PreUpdateSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const update_schedule = new Schedule(PreUpdate);

        app.add_schedule(update_schedule).add_systems(
            PreUpdate,
            PreUpdate.run_pre_update
        );
    }
}

export class UpdateSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const update_schedule = new Schedule(Update);

        app.add_schedule(update_schedule).add_systems(
            Update,
            Update.run_update
        );
    }
}

export class PostUpdateSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const post_update_schedule = new Schedule(PostUpdate);

        app.add_schedule(post_update_schedule).add_systems(
            PostUpdate,
            PostUpdate.run_post_update
        );
    }
}
