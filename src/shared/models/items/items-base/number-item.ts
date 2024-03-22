import { IItem, IItemUIMapping, Item } from "../item.model";

export abstract class NumberItem extends Item<number> implements IItem<number> {
    public get amount(): number {
        return this.value;
    }

    public get weight(): number {
        return this.value * this.weightPerUnit;
    }

    public add(amount: number): NumberItem {
        this.value = Math.max(0, this.value + amount);

        return this;
    }

    public consume(amount: number): NumberItem {
        return this.add(-amount);
    }

    public empty(): NumberItem {
        this.value = 0;

        return this;
    }

    public serialize(): { [key: string]: number } {
        return ({
            [this.identifier]: this.value
        });
    }

    public deserialize(serialized: { [key: string]: number }): NumberItem {
        const [identifier, value] = Object.entries(serialized)[0];
        this.identifier = identifier;
        this.value = value;

        return this;
    }
}
