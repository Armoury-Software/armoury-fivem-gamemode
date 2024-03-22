import { EventListener } from '@armoury/fivem-framework';
import { Injectable } from 'injection-js';
import { Observable, Subject } from 'rxjs';

import { Business, IBusinessInteractRequest } from '../../../shared/models/businesses';

@Injectable()
export class ServerBusinessService {
    protected _onPlayerInteractRequest$: Subject<IBusinessInteractRequest> = new Subject();
    public get onPlayerInteractRequest$(): Observable<IBusinessInteractRequest> {
        return this._onPlayerInteractRequest$.asObservable();
    }

    protected _name: string = Cfx.Server.GetCurrentResourceName().split('-').slice(1).join('-').replace('/', '').toLowerCase();
    public get name(): string {
        return this._name;
    }

    public constructor() {
        if (!Cfx.Server.GetCurrentResourceName().includes('businesses-')) {
            console.error(
                "You are using a Business-specific service but the resource's name does NOT comply with the naming 'businesses-<businessNameStripped>'. The resource may not work properly."
            );
        }
    }

    @EventListener({ eventName: `${Cfx.Server.GetCurrentResourceName()}:interact-request` })
    public onPlayerInteractRequest(business: Business) {
        // TODO: Do stuff
        const player = Cfx.source;
        this._onPlayerInteractRequest$.next({ by: player, business });
    }
}
