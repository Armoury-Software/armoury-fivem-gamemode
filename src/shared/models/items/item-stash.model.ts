import { ItemStashGenericError, ItemStashSlotsInsuficientError } from "./errors";
import { IItemBase } from "./item.model";

export class ItemStash<T extends IItemBase> {
    public _items: Map<number, T> = new Map();
    public get items(): ReadonlyArray<T> {
        return <ReadonlyArray<T>>Array.from(this._items.values());
    };

    public constructor(
        public readonly name: string,
        public readonly slots: number,
        public readonly weightPerSlot: number,
    ) { }

    public add(item: T, slot?: number): boolean {
        const clone = ItemStash.clone(this); // Creates a clone to operate onto, instead of altering the original map
        let consumedWeight = 0; const weightToConsume = item.weight;

        if (!item.fullyOccupiesSlot) {
            // If there are existing slots with this item, fill them
            Array.from(clone._items.entries()).forEach(([existingSlot, existingItem]) => {
                if (consumedWeight < weightToConsume && existingItem.identifier === item.identifier) {
                    consumedWeight += ItemStash.addToSlot(clone, item.empty().add(Math.round((weightToConsume - consumedWeight) / item.weightPerUnit)), existingSlot);
                }
            });
        }

        // If the added item is not yet fully transferred, find a new slot to put the remaining amount into
        let attempts = 0;
        while (consumedWeight < weightToConsume) {
            if (consumedWeight < weightToConsume && clone._items.size >= clone.slots) {
                throw new ItemStashSlotsInsuficientError();
            }

            attempts++;
            if (attempts >= this.slots) {
                throw new ItemStashGenericError();
            }

            consumedWeight += ItemStash.addToSlot(clone, item.empty().add(Math.round((weightToConsume - consumedWeight) / item.weightPerUnit)), clone._items.size);
        }

        // If everything went well, propagate the modification into the original map
        Array.from(clone._items.entries()).forEach(([slot, item]) => {
            this._items.set(slot, item);
        });

        return true;
    }

    public consume(item: T, amount: number): void {
        let consumedAmount = 0;

        if (amount >= item.amount) {
            const [slot, ] = Array.from(this._items.entries()).find(([, existingItem]) =>
                existingItem.identifier === item.identifier    
            );

            if (slot != null) {
                this._items.delete(slot);
            }
        } else {
            Array.from(this._items.entries()).reverse().forEach(([existingSlot, existingItem]) => {
                if (consumedAmount < amount && item.identifier === existingItem.identifier) {
                    const amountRemoved = ItemStash.removeFromSlot(this, existingSlot, amount - consumedAmount);
                    consumedAmount += amountRemoved;
                }
            });
        }
    }

    public has(itemIdentifier: string): boolean {
        return Array.from(this._items.values()).some((item) => item.identifier === itemIdentifier);
    }

    public serialize(): { [key: string]: any } {
        return this.items.reduce((prev, curr) => ({ ...prev, ...curr.serialize() }), {});
    }
    
    public toUI() {
        return ({
            title: this.name,
            items: Array.from(this._items.entries())
                .map(([slot, item]) => item.toUI(slot))
        });
    }

    /**
     * Adds an item to a stash.
     * @param stash Stash to add the item to
     * @param item Item to add to the stash
     * @param slot The slot where the item should be placed into
     * @returns Weight added to the stash
     */
    public static addToSlot<T extends IItemBase>(stash: ItemStash<T>, item: T, slot: number): number {
        const existingWeightOfThisItem = stash._items.get(slot)?.weight || 0;
        const availableWeightInThisSlot = stash.weightPerSlot - existingWeightOfThisItem;
        const weightToBeAdded = Math.max(1, Math.min(availableWeightInThisSlot, item.weight));

        stash._items.set(slot, <T>item.empty().add(Math.round((existingWeightOfThisItem + weightToBeAdded) / item.weightPerUnit)));
        return weightToBeAdded;
    }

    /**
     * Removes an X amount of whichever item lies in the specified slot
     * @param stash Stash to remove the amount of the item from
     * @param slot Slot of the stash which will have this amount of the item removed
     * @param amount The amount of the item to be removed
     * @returns The amount that has been removed (the amount in the slot can be lower than the provided amount-to-be-removed)
     */
    public static removeFromSlot<T extends IItemBase>(stash: ItemStash<T>, slot: number, amount: number): number {
        const existingAmountOfThisItem = stash._items.get(slot)?.amount || 0;

        if (!existingAmountOfThisItem || !stash._items.get(slot)) {
            return 0;
        }

        const amountToBeConsumed = Math.min(existingAmountOfThisItem, amount);
        stash._items.set(slot, <T>stash._items.get(slot).consume(amountToBeConsumed));

        return amountToBeConsumed;
    }

    public static clone<T extends IItemBase>(stash: ItemStash<T>): ItemStash<T> {
        const clone = new ItemStash<T>(stash.name, stash.slots, stash.weightPerSlot);

        Array.from(stash._items.entries()).forEach(([slot, item]) => {
            clone._items.set(slot, item);
        });

        return clone;
    }
}

export interface IItemStashBase {
    name: string;
    slots: number;
    weightPerSlot: number;
    has(itemIdentifier: string): boolean;
    serialize(): { [key: string]: any };
    deserialize(serialized: { [key: string]: any }): void;
}

export interface IItemStash<T extends IItemBase> extends IItemStashBase {
    items: ReadonlyArray<T>;
    add(item: T, slot?: number): boolean;
    consume(item: T, amount: number): boolean;
}
