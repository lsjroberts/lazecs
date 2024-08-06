import { App, PluginInterface } from '../types';
import { changed, query } from '../systems';

import { PostUpdate } from '../schedules';

export class HtmlPlugins implements PluginInterface {
    root!: string;

    build(app: App): void {
        app.add_systems(PostUpdate, render_html);
    }
}

export class Element {
    tag: string = 'div';
    children!: Array<string>;
}

function render_html(elements = query(Element, changed(Element))) {
    const els = Array.from(elements);
    if (els.length === 0) return;

    const app = document.getElementById('app'); // TODO: resources
    if (!app) return;
    let innerHTML = '';
    for (const element of elements) {
        innerHTML += `<${element.tag}>${element.children.join('')}</${
            element.tag
        }>`;
    }
    app.innerHTML = innerHTML;
}
