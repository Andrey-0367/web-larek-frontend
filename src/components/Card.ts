import {bem, ensureElement} from "../utils/utils";
import {Component} from "./base/Component";
import {CardCategory} from "../types";
import clsx from "clsx";


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    image?: string;
    price: number;
    description?: string;
    category: T;
    index: number;
}


export class Card<T> extends Component<ICard<T>> {
    protected _button: HTMLButtonElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _description?: HTMLElement;
    protected _index?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container)
        this._description = container.querySelector(`.${blockName}__text`);
        this._index = container.querySelector(`.basket__item-index`);
        this._button = container.querySelector('.card__button')

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    toggleButton(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set button(value: string) {
        this.setText(this._button, value)
        if (value === 'В корзину') {
            this.toggleButton(false);
        } else {
            this.toggleButton(true);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set price(value: number) {
        this.setText(this._price, value ? `${value}  синапсов` : `Бесценно`)
        if (this._button) {
            this._button.disabled = !value
        }
    }

}


export type CatalogItemCategory = {
    category: CardCategory,
    image?: string;
};

export class CatalogItem extends Card<CatalogItemCategory> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
    }

    protected _category: HTMLElement;

    set category({category}: CatalogItemCategory) {
        this.setText(this._category, category);
        this._category.className = clsx('card__category', {
            [bem(this.blockName, 'category', 'soft').name]: category === 'софт-скил',
            [bem(this.blockName, 'category', 'hard').name]: category === 'хард-скил',
            [bem(this.blockName, 'category', 'other').name]: category === 'другое',
            [bem(this.blockName, 'category', 'additional').name]: category === 'дополнительное',
            [bem(this.blockName, 'category', 'button').name]: category === 'кнопка',
        });
    }

    protected _image?: HTMLImageElement;

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}
