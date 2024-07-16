import {FormErrors, IAppState, IItem, IOrder, IOrderForm,} from "../types";
import {Model} from "./base/Model";


export class AppState extends Model<IAppState> {
    basketProducts: IItem[] = [];
    catalog: IItem[];

    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: null,
        items: []
    }

    preview: string | null;
    formErrors: FormErrors = {};

    addItem(item: IItem) {
        this.basketProducts = [item, ...this.basketProducts];
        this.order.items = [item.id, ...this.order.items]
    }

    deleteItem(cardId: string) {
        this.basketProducts = this.basketProducts.filter(item => item.id !== cardId);
        this.order.items = this.order.items.filter((item) => item !== cardId)
    }
    setCatalog(items: IItem[]) {
        this.catalog = items
        this.emitChanges('items:changed', {catalog: this.catalog});
    }

    setPreview(item: IItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    getTotal() {
        let total = 0
        for (const product of this.basketProducts) {
            total += product.price;
        }
        return total
    }

    getBasketProducts(): IItem[] {
        return this.basketProducts
    }

    inBasket(item: IItem) {
        return this.basketProducts.includes(item)
    }

    clearBasket() {
        this.basketProducts.length = 0;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order.total = this.getTotal()

        let data = '';
        this.order[field] = value;
        if (field === "payment" || field === "address") {
            data = 'order';
            this.validateOrder(data)
        } else {
            data = 'contact';
            if (this.validateOrder(data)) {
                this.events.emit('order:ready', this.order)
            }
        }
    }

    validateOrder(data: string) {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit(`formErrors:${data}`, this.formErrors);
        return Object.keys(errors).length === 0;
    }
}

