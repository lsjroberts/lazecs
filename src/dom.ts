import { App, PluginInterface } from './types';

export class DOMPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        console.log('dom');
    }
}
