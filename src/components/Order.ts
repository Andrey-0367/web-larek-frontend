import {Form} from "./common/Form";
import {IOrder} from "../types";
import {IEvents} from "./base/events";


export class Order extends Form<IOrder> {
    protected _buttonCard?: HTMLButtonElement;
    protected _buttonCash?: HTMLButtonElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonCard = container.elements.namedItem('card') as HTMLButtonElement;
        this._buttonCash = container.elements.namedItem('cash') as HTMLButtonElement;
        this._button = container.querySelector('order__button');

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
}


export class Contact extends Form<any> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._button = container.querySelector('button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('contact:submit');
            });
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
