import { App, PluginInterface } from '../types';

import { HtmlPlugins } from './html';
import { InputPlugin } from './input';

export class DefaultPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.add_plugin(HtmlPlugins).add_plugin(InputPlugin);
    }
}
