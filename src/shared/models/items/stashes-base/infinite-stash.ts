import { ItemStash } from "../item-stash.model";
import { IItemBase } from "../item.model";

export class InfiniteStash extends ItemStash<IItemBase>/* implements IItemStash<IItemBase>*/ {
    public override add(_item: IItemBase, slot?: number): boolean {
        return true;
    }
    public override consume(_item: IItemBase, _amount: number): void { }

    public override has(_itemIdentifier: string): boolean {
        return true;
    }

    deserialize(serialized: { [key: string]: any; }): void {
        throw new Error("Method not implemented.");
    }
}
