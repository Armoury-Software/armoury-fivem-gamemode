import { ItemStashError } from "./item-stash-error-base";

export class ItemStashSlotsInsuficientError extends ItemStashError<ItemStashSlotsInsuficientError> {
    public constructor(msg?: string) {
        super(msg ?? 'There were insuficient slots to add to the stash.');
    }
}

export class ItemStashGenericError extends ItemStashError<ItemStashGenericError> {
    public constructor(msg?: string) {
        super(msg ?? 'An unexpected runtime error occured.');
    }
}
