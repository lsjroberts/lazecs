import { App, PluginInterface } from '../types';
import { CanvasPlugin } from './canvas';

export class DefaultPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.add_plugin(CanvasPlugin, { root: this.root });
    }
}
