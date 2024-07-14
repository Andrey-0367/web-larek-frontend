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
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._button = container.querySelector(`.basket__item-delete`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container)
        this._description = container.querySelector(`.${blockName}__text`);
        this._index = container.querySelector(`.basket__item-index`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    protected _title: HTMLElement;

    get title(): string {
        return this._title.textContent || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    protected _price: HTMLElement;

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, `Бесценно`)
        } else {
            this.setText(this._price, `${value}  синапсов`)
        }
    }

    protected _description?: HTMLElement;

    set description(value: string) {
        this.setText(this._description, value);
    }

    protected _index?: HTMLElement;

    set index(value: number) {
        this.setText(this._index, value);
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set id(value: string) {
        this.container.dataset.id = value;
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
