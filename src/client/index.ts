import { Provider } from 'injection-js';

import {
    Client_Init as Framework_Client_Init
} from '@armoury/fivem-framework';

export const CLIENT_PROVIDERS = [];

export function Client_Init<
    T extends { new(...args: any[]): any } & Provider
>(_class: T, ...providers: Provider[]): T {
    return Framework_Client_Init(_class, ...[...CLIENT_PROVIDERS, ...providers]);
}

// export * from './services';
// export * from './models';
