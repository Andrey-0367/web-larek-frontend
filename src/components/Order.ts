import {Form} from "./common/Form";
import {IOrder} from "../types";
import {IEvents} from "./base/events";
import {createElement, ensureElement} from "../utils/utils";


export class OrderForm extends Form<IOrder> {
    protected _buttonCard?: HTMLButtonElement;
    protected _buttonCash?: HTMLButtonElement;
    protected _button: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonCard = container.elements.namedItem('card') as HTMLButtonElement;
        this._buttonCash = container.elements.namedItem('cash') as HTMLButtonElement;
        this._button = ensureElement<HTMLElement>('.button', this.container);

        if (this._buttonCard) {
            this._buttonCard.addEventListener('click', () => {
                this.onInputChange("payment", 'online')
            });
        }
        if (this._buttonCash) {
            this._buttonCash.addEventListener('click', () => {
                this.onInputChange("payment", 'cash')
            });
        }
    }

    protected _payment: string;

    set payment(payment: string) {
        this._payment = payment;
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    // toggleOrderButton(state: boolean) {
    //     this.setDisabled(this._button, state);
    // }
    //
    // orderPayment(payment: any) {
    //     console.log(payment, 33333333333333)
    //     if (!payment) {
    //         this.toggleOrderButton(false);
    //     } else {
    //         this.toggleOrderButton(true);
    //     }
    // }
}


export class ContactsForm extends Form<IOrder> {


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
