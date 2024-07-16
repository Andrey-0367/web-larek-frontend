import {Api, ApiListResponse} from "./base/api";
import {IItem, IOrder, IOrderResult} from "../types";


export interface IAppApi {
    getCardList: () => Promise<IItem[]>;
    getCardItem: (id: string) => Promise<IItem>;
}

export class AppApi extends Api implements IAppApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<IItem[]> {
        return this.get('/product').then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getCardItem(id: string): Promise<IItem> {
        return this.get<IItem>(`/product/${id}`).then(
            (item: IItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    orderCards(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}


