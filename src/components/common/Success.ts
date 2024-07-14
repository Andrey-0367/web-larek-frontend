import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
      protected _button: HTMLElement;
      protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._button = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = this.container.querySelector('.order-success__description');

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }
        set total(total: number) {
        this.setText(this._total, `Списано ${total}  синапсов`)
    }
}