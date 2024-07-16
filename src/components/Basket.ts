import {Component} from "./base/Component";
import {EventEmitter} from "./base/events";
import {createElement, ensureElement} from "../utils/utils";


interface IBasketView {
    products: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLElement>('.basket__button', this.container);

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
        this.products = [];
    }

    toggleButton(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set products(products: HTMLElement[]) {
        if (products.length) {
            this._list.replaceChildren(...products);
            this.toggleButton(false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.toggleButton(true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total}  синапсов`)
    }
}

