import { App, PluginInterface } from './types';
import { FixedMain, Main, Schedule } from './schedules';

export class MainSchedulePlugin implements PluginInterface {
    build(app: App): void {
        const main_schedule = new Schedule(Main);
        const fixed_main_schedule = new Schedule(FixedMain);

        app.add_schedule(main_schedule)
            .add_schedule(fixed_main_schedule)
            .add_systems(Main.run_main)
            .add_systems(FixedMain.run_fixed_main);
    }
}
