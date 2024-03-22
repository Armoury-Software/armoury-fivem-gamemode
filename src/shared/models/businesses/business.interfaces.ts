import { Business } from "./business.model";

export interface IBusinessInteractRequest {
    by: number;
    business: Business;
}
