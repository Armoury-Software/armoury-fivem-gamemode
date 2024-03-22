import { IItemStashBase } from "./item-stash.model";

export interface IItemTransfer {
    from: IItemStashBase;
    to: IItemStashBase;
}
