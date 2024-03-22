import { IItem, IItemBase, Item } from "../item.model";

export abstract class WeaponItem extends Item<IWeaponItem> implements IItem<IWeaponItem> {
    public get amount(): number {
        return this.value.ammo;
    }

    public get weight(): number {
        return this.amount * this.weightPerUnit;
    }

    public add(amount: number): WeaponItem {
        this.value = {
            ...this.value,
            ammo: Math.max(0, this.value.ammo + amount)
        };

        return this;
    }

    public consume(amount: number): WeaponItem {
        return this.add(-amount);
    }

    public empty(): WeaponItem {
        return this.add(-this.value.ammo);
    }

    public serialize(): { [key: string]: IWeaponItem } {
        return ({
            [this.identifier]: this.value
        });
    }

    public deserialize(serialized: { [key: string]: IWeaponItem }): WeaponItem {
        const [identifier, value] = Object.entries(serialized)[0];
        this.identifier = identifier;
        this.value = value;

        return this;
    }
}

export interface IWeaponItem extends IItemBase {
    ammo: number;
    id: string;
}
