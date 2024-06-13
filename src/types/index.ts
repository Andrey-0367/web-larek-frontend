export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICardsData {
    products: ICard[];
    preview: string | null;
    getCard(cardId: string): ICard;
}

export interface IOrderContent {
    total: number;
    items: ICard[];
}

export interface IBasketData extends IOrderContent {
    addCard(card: ICard): void;
    deleteCard(cardId: string, payload: Function | null): void;
    getCard(cardId: string): ICard;
}

export interface IOrder extends IOrderContent {
    payment: string;
    email: string;
    phone: string;
    address: string;
    setIOrderInfo(orderData: IOrder): void;
    checkOrderAddressValidation(data: Record<keyof TOrderBaseAddressInfo, string>): boolean;
    checkOrderPhoneValidation(data: Record<keyof TOrderBasePhoneInfo, string>): boolean;
}

type TOrderBaseAddressInfo = Pick<IOrder, 'payment' | 'address'>;

type TOrderBasePhoneInfo= Pick<IOrder, 'email' | 'phone'>;

export interface IModal {
    modal: HTMLElement;
    open(): void;
    close(): void;
}

export interface IModalWithForm extends IModal {
    submitButton: HTMLButtonElement;
    form: HTMLFormElement;
    formName: string;
    inputs: NodeListOf<HTMLInputElement>;
    errors: Record<string, HTMLElement>;
    setValid(isValid: boolean): void;
    setInputValues(data: Record<string, string>): void;
    setError(data: {field: string, value: string, validInformation: string }): void;
    showInputError(field: string, errorMessage: string): void;
    hideInputError(field: string): void;
    close(): void;
}

export interface ModalWithPlaced extends IModal {
    open(): void
    close(): void
}

export interface successfulOrder {
    id: string;
    total: number;
}

export interface errorResponse {
    error: string;
}

export interface IAppApi {
    getCardList(): Promise<ICard[] | errorResponse>;
    getCardItem(cardId: string): Promise<ICard | errorResponse>;
    postOrder(order: IOrder): Promise<successfulOrder | errorResponse>
}

