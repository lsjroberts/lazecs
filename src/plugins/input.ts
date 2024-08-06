import { App, PluginInterface } from '../types';
import { KeyCode, keyboard_input_system } from './input/keyboard';

import { PreUpdate } from '../schedules';

export class InputPlugin implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.insert_resource(KeyCode, new KeyCode()).add_systems(
            PreUpdate,
            keyboard_input_system
        );
    }
}
