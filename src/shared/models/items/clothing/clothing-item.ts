import { IItem, IItemBase, Item } from "../item.model";

export abstract class Clothing extends Item<IClothingItem> implements IItem<IClothingItem> {
    public amount: number = 1;

    public get weight(): number {
        return this.weightPerUnit;
    }

    public constructor(
        _name: string,
        _value: IClothingItem = null
    ) {
        super(_name, 1, true, _value);
    }

    public add(_amount: number): Clothing {
        this.amount = 1;
        return this;
    }

    public consume(_amount: number): Clothing {
        this.amount = 0;
        return this;
    }

    public empty(): Clothing {
        return this.consume(this.weightPerUnit);
    }

    public serialize(): { [key: string]: IClothingItem } {
        return ({
            [this.identifier]: this.value
        });
    }

    public deserialize(serialized: { [key: string]: IClothingItem }): Clothing {
        const [identifier, value] = Object.entries(serialized)[0];
        this.identifier = identifier;
        this.value = value;

        return this;
    }
}

export interface IClothingItem extends IItemBase {
    components: { [key: number]: IClothingComponent };
}

// TODO: IClothingComponent should most probably be placed in a more generic place
export interface IClothingComponent {
    drawableId: number;
    textureId: number;
    paletteId: number;
}
