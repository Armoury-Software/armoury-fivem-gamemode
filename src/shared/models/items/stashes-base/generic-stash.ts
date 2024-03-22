import { ItemStash } from "../item-stash.model";
import { IItemBase } from "../item.model";

export class GenericStash extends ItemStash<IItemBase>/* implements IItemStash<IItemBase>*/ {
    deserialize(serialized: { [key: string]: any; }): void {
        throw new Error("Method not implemented.");
    }
}
