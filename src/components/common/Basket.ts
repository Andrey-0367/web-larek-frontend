import {Component} from "../base/Component";
import { createElement, ensureElement, formatNumber} from "../../utils/utils";
import {EventEmitter} from "../base/events";


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
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.modal__actions');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.products = [];
    }

    set products(products: HTMLElement[]) {
        if (products.length) {
            console.log(products)
            this._list.replaceChildren(...products);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total}  синапсов`)
    }

}

