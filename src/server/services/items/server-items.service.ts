import { Inject, Injectable, Optional, Provider } from "injection-js";
import { Observable, Subject } from "rxjs";
import { IItemBase, IItemTransfer, Item, ItemStash } from "../../../shared/models/items";
import cloneDeep from "clone-deep";

@Injectable()
export class ServerItemsService {
    protected _onItemTransfer$: Subject<IItemTransfer>;
    public get onItemTransfer$(): Observable<IItemTransfer> {
        return this._onItemTransfer$.asObservable();
    }

    public constructor(
        @Optional() @Inject('items') private readonly _items?: Item<IItemBase>[],
    ) {
        this._items = _items.filter((item) => !!item) ?? [];

        const cacheAdderFunc = Cfx.exports['armoury-roleplay'].addToItemCache;
        if (!cacheAdderFunc) {
            console.error(`[Armoury (${Cfx.Server.GetCurrentResourceName()}):] Could not find a valid export for registering items to the global cache. Did you forget to load the 'armoury-roleplay' resource?`);
            return;
        }

        if (this._items.length) {
            console.log(`[Armoury (${Cfx.Server.GetCurrentResourceName()}):] This resource contains registered items. Registering these items globally.. (${this._items.map((item) => item.identifier).join(', ')})`);
            cacheAdderFunc(...this._items);
        } else {
            console.log(`[Armoury (${Cfx.Server.GetCurrentResourceName()}):] This resource does not register any new items. (this might be an issue if you were actually planning to register items to the global cache)`);
        }
    }

    public transfer<T extends IItemBase, V extends T>(
        from: ItemStash<T>, to: ItemStash<T>, item: V, amount: number = item.amount, options?: IItemTransferOptions
    ): boolean {
        if (!from.has(item.identifier)) {
            console.error(`Tried to transfer item with identifier (${item.identifier}) from stash (${from.name}) to (${to.name}), but stash (${from.name}) has no such item in it.`);
            return;
        }

        const copy = amount >= item.amount ? item : cloneDeep(item, true);
        amount = Math.min(amount, item.amount);
        from.consume(item, amount);
        to.add(<T> copy.empty().add(amount));

        return true;
    }

    public static withDefaults(): Provider {
        return ({
            provide: ServerItemsService,
            useFactory: (items) => new ServerItemsService(items || []),
            deps: ['items'],
        });
    }

    public static withItems<T extends { new (...args: any[]): any }>(...items: T[]): Provider[] {
        return [
            ...items.map((item) => ({
                provide: 'items',
                useValue: new item(),
                multi: true,
            })),
            ServerItemsService.withDefaults()
        ];
    }

    //public consume(playerId: number, item: Item, amount: any, toDestinationValue?: any, ignoreInventoryRefresh?: boolean): boolean {
    //    Cfx.exports['authentication'].setPlayerInfo(
    //        playerId,
    //        item._piKey,
    //        new ItemConstructor(
    //            (playerInfoKey: string) => Cfx.exports['authentication'].getPlayerInfo(playerId, playerInfoKey),
    //            item._piKey,
    //            undefined,
    //            this._translate.getLanguage(playerId)
    //        ).incrementFromSource(fromSourceValue || undefined, amount, item.metadata?.type || item.image),
    //        false
    //    );
//
    //    // TODO: This should not happen here. Instead, inside the 'inventory' resource, subscribe to an Observable from this class.
    //    if (!ignoreInventoryRefresh) {
    //        Cfx.emit(`inventory:client-inventory-request`, playerId, undefined, true);
    //    }
//
    //    return true;
    //}
}

export interface IItemTransferOptions {
    emitEvent?: boolean;
}
export interface ItemTransferOptions extends IItemTransferOptions { }
export class ItemTransferOptions {
    public emitEvent: boolean = true;
}
