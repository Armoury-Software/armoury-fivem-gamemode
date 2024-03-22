export class ItemError<T extends ItemError<T>> extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
