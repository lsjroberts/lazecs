import { KeyboardInput, stringToKeyCode } from './plugins/input/keyboard';

import { ButtonState } from './button';
import { Ctr } from './types';

class Events {
    static buffer: Array<KeyboardInput> = [];
}

export function eventReader<T extends Ctr>(eventType: T) {
    return Events.buffer;
}

export function eventWriter() {}

window.addEventListener('keydown', (e) => {
    const event = new KeyboardInput();
    event.key_code = stringToKeyCode(e.key);
    // event.logical_key = e.code;
    event.state = ButtonState.Pressed;
    Events.buffer.push(event);
});

window.addEventListener('keyup', (e) => {
    const event = new KeyboardInput();
    event.key_code = stringToKeyCode(e.key);
    // event.logical_key = e.code;
    event.state = ButtonState.Released;
    Events.buffer.push(event);
});
