export abstract class Item<T> {
    public constructor(
        public identifier: string,
        public weightPerUnit: number,
        public fullyOccupiesSlot: boolean,
        public value: T,
    ) {
        this.fullyOccupiesSlot = fullyOccupiesSlot ?? false;
    }

    public toUI(slot?: number): IItemUIMapping {
        return ({
            image: this.identifier,
            type: 'item',
            description: 'Just an inventory item.',
            topLeft: '',
            bottomRight: JSON.stringify(this.value),
            _piKey: '', // TODO: Can we remove this?
            outline: '#878b9f',
            width: 65,
        });
    }
}

export interface IItem<T> extends IItemBase {
    value: T;
    add(amount: number): IItem<T>;
    consume(amount: number): IItem<T>;
    empty(): IItem<T>;
    serialize(): { [key: string]: T };
    deserialize(serialized: { [key: string]: T }): IItem<T>;
}

export interface IItemBase {
    identifier: string;
    amount: number;
    weight: number;
    weightPerUnit: number;
    fullyOccupiesSlot: boolean;
    add(amount: number): IItemBase;
    consume(amount: number): IItemBase;
    empty(): IItemBase;
    serialize(): { [key: string]: any };
    deserialize(serialized: { [key: string]: any }): IItemBase;
    toUI(currentSlot?: number): IItemUIMapping;
}

export interface IItemUIMapping {
    image: string;
    bottomRight: string;
    type: string;
    description: string;
    topLeft: string;
    _piKey: string; // TODO: Can we remove this? What was this used for before?
    outline: string;
    width: number;
    metadata?: { [key: string]: any }; // TODO: Can we remove this? What was this used for before?
}
