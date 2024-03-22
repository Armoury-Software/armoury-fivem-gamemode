export class ItemStashError<T extends ItemStashError<T>> extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
