import { Provider } from 'injection-js';
import { Server_Init as Framework_Server_Init } from '@armoury/fivem-framework';

import { ServerBusinessService } from './services';

export const SERVER_PROVIDERS = [
    {
        provide: 'items',
        useValue: null,
        multi: true,
    },
    ServerBusinessService,
];

export function Server_Init<
    T extends { new(...args: any[]): any } & Provider
>(_class: T, ...providers: Provider[]): T {
    return Framework_Server_Init(_class, ...[...SERVER_PROVIDERS, ...providers]);
}

export * from './services';
export * from '../shared/models';
