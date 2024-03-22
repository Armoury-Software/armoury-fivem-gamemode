export interface IBusiness {
    id: number;
    name: string;
    owner: string;
    level: number;
    entranceX: number;
    entranceY: number;
    entranceZ: number;
    depositX: number;
    depositY: number;
    depositZ: number;
    exitX: number;
    exitY: number;
    exitZ: number;
    firstPurchasePrice: number;
    sellingPrice: number;
    partnerIds: number[];
    parent: number;
    productPrice: number;
}

export interface Business extends IBusiness { }
export class Business {
    public constructor(data?: Partial<IBusiness>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}