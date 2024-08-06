export enum ButtonState {
    Pressed,
    Released,
}

export interface ButtonInput<T> {
    just_pressed(button: T): boolean;
    just_released(button: T): boolean;
    pressed(button: T): boolean;
    any_pressed(buttons: Array<T>): boolean;
    any_just_pressed(buttons: Array<T>): boolean;
    get_pressed(): { [Symbol.iterator](): IterableIterator<T> };
    get_just_pressed(): { [Symbol.iterator](): IterableIterator<T> };
    get_just_released(): { [Symbol.iterator](): IterableIterator<T> };
}
