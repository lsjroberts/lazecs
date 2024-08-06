import { ButtonInput, ButtonState } from '../../button';

import { Entity } from '../../types';
import { eventReader } from '../../events';
import { resource } from '../../resources';

export enum KeyCodeEnum {
    KeyA = 'a',
    KeyB = 'b',
    KeyC = 'c',
    KeyD = 'd',
    KeyE = 'e',
    KeyF = 'f',
    KeyG = 'g',
    KeyH = 'h',
    KeyI = 'i',
    KeyJ = 'j',
    KeyK = 'k',
    KeyL = 'l',
    KeyM = 'm',
    KeyN = 'n',
    KeyO = 'o',
    KeyP = 'p',
    KeyQ = 'q',
    KeyR = 'r',
    KeyS = 's',
    KeyT = 't',
    KeyU = 'u',
    KeyV = 'v',
    KeyW = 'w',
    KeyX = 'x',
    KeyY = 'y',
    KeyZ = 'z',
}
export enum Key {}

export function stringToKeyCode(str: string) {
    if (String(Object.values(KeyCodeEnum)).includes(str)) {
        return str as KeyCodeEnum;
    }
    throw new Error(`Unknown key [${str}].`);
}

export class KeyboardInput {
    key_code!: KeyCodeEnum;
    // logical_key!: Key;
    state!: ButtonState;
    window!: Entity;
}

export class KeyCode implements ButtonInput<KeyCodeEnum> {
    static readonly KeyA = KeyCodeEnum.KeyA;
    static readonly KeyW = KeyCodeEnum.KeyW;

    pressed_keys: Set<KeyCodeEnum> = new Set();
    just_pressed_keys: Set<KeyCodeEnum> = new Set();
    just_released_keys: Set<KeyCodeEnum> = new Set();

    just_pressed(button: KeyCodeEnum) {
        return this.just_pressed_keys.has(button);
    }

    just_released(button: KeyCodeEnum) {
        return this.just_released_keys.has(button);
    }

    pressed(button: KeyCodeEnum) {
        return this.pressed_keys.has(button);
    }

    any_pressed(buttons: Array<KeyCodeEnum>) {
        for (const button of buttons) {
            if (this.pressed(button)) return true;
        }
        return false;
    }

    any_just_pressed(buttons: Array<KeyCodeEnum>) {
        for (const button of buttons) {
            if (this.just_pressed(button)) return true;
        }
        return false;
    }

    get_pressed() {
        const this_ = this;
        return {
            *[Symbol.iterator](): IterableIterator<KeyCodeEnum> {
                for (const button of this_.pressed_keys) {
                    yield button;
                }
            },
        };
    }

    get_just_pressed() {
        const this_ = this;
        return {
            *[Symbol.iterator](): IterableIterator<KeyCodeEnum> {
                for (const button of this_.just_pressed_keys) {
                    yield button;
                }
            },
        };
    }

    get_just_released() {
        const this_ = this;
        return {
            *[Symbol.iterator](): IterableIterator<KeyCodeEnum> {
                for (const button of this_.just_released_keys) {
                    yield button;
                }
            },
        };
    }
}

export function keyboard_input_system(
    key_input = resource(KeyCode),
    keyboard_input_events = eventReader(KeyboardInput)
) {
    key_input.just_pressed_keys.clear();
    key_input.just_released_keys = new Set(key_input.pressed_keys);

    for (const event of keyboard_input_events) {
        if (event.state === ButtonState.Pressed) {
            key_input.pressed_keys.add(event.key_code);
            key_input.just_pressed_keys.add(event.key_code);
            key_input.just_released_keys.delete(event.key_code);
        } else if (event.state === ButtonState.Released) {
            key_input.pressed_keys.delete(event.key_code);
        }
    }
}
