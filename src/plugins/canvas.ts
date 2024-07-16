import { App, PluginInterface } from '../types';

import { Startup } from '../schedules';

export class CanvasPlugin implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.add_systems(Startup, this.initial_render.bind(this));
    }

    initial_render() {
        const element = document.getElementById(this.root);

        if (!element) return;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.backgroundColor = 'black';

        element.appendChild(canvas);
    }
}
