import {
    App,
    DefaultPlugins,
    Html,
    KeyCode,
    Startup,
    Update,
    commands,
    query,
    resource,
} from '../../src';

function main() {
    new App().add_plugin(DefaultPlugins).add_plugin(InputLoggerPlugin).run();
}

class InputLoggerPlugin {
    build(app: App) {
        app.add_systems(Startup, setup).add_systems(Update, render_inputs);
    }
}

class Input {
    type: 'keys_pressed';
    label: string;
}

function setup(cmds = commands()) {
    cmds.spawn(
        [Input, { type: 'keys_pressed', label: 'Keys pressed' }],
        [Html.Element, { tag: 'div', children: [] }]
    );
}

function render_inputs(
    keys = resource(KeyCode),
    elements = query([Input, Html.Element])
) {
    const keys_pressed = Array.from(keys.get_pressed());
    for (const [input, element] of elements) {
        switch (input.type) {
            case 'keys_pressed':
                element.children = [input.label, ': ', keys_pressed.join(', ')];
                break;
        }
    }
}

main();
