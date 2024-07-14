export type CardCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';

export interface IItem {
    title: string;
    description: string;
    image: string;
    category: CardCategory;
    price: number;
    id: string;
}

export interface IBasketItem {
    id: string;
    title: string;
    price: number;
    index: number
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IModal {
    modal: HTMLElement;
    open(): void;
    close(): void;
}

export interface IAppState {
    catalog: IItem[];
    basket: IBasketItem[];
    preview: string | null;
    order: IOrder | null;
    contact: IOrder | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number
}

export interface IOrderResult {
    id: string;
    total: number
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

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

export interface errorResponse {
    error: string;
}

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T | errorResponse>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T | errorResponse>;
}