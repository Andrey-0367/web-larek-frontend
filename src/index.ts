import './scss/styles.scss';
import {EventEmitter} from "./components/base/events";
import {AppApi} from "./components/AppApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {AppState,} from "./components/CardsData";
import {Page} from "./components/Page";
import {Card, CatalogItem} from "./components/Card";
import {Modal} from "./components/common/Modal";
import {IItem, IOrderForm} from "./types";
import {Basket} from "./components/Basket";
import {Success} from "./components/Succes";
import {ContactsForm, OrderForm} from "./components/Order";



const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
    console.log(event.eventName, event.data)
})


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);


// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Изменились элементы каталога
events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });

        return card.render({
            title: item.title,
            image: item.image,
            category: {
                category: item.category,
            },
            price: item.price
        });
    });
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderCards(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    appData.clearBasket()
                    basket.products = [];
                    basket.total = 0;
                    page.counter = 0;
                    modal.close();
                    events.emit('items:changed');
                }
            });
            modal.render({
                content: success.render({total: result.total})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Открыть продукт
events.on('card:select', (item: IItem) => {
    appData.setPreview(item);
});


events.on('preview:changed', (item: IItem) => {
    if (item) {
    const showItem = (item: IItem) => {
        const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                if (appData.inBasket(item)) {
                    card.button = 'Продукт уже в корзине'
                } else {
                    card.button = 'В корзину'
                    events.emit('basket:select', item)
                }
            }
        });

        card.button = appData.inBasket(item) ? 'Продукт в корзине' : 'В корзину'
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                price: item.price,
                category: {
                    category: item.category,
                },
            })
        })
    };
        api.getCardItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

//Открыть корзину
events.on('basket:open', (item: IItem) => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render(),
        ])
    });
})


//Добавить продукт в корзину
events.on('basket:select', (item: IItem) => {
    appData.addItem(item)
    page.counter = appData.getBasketProducts().length;
    basket.products = appData.getBasketProducts().map(item => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:delete', item)
        });
        return card.render(item);
    });
    basket.total = appData.getTotal();
})


//Удалить продукт из корзины
events.on('card:delete', (item: IItem) => {
    appData.deleteItem(item.id)
    page.counter = appData.getBasketProducts().length;
    basket.products = appData.getBasketProducts().map(item => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:delete', item)
        });
        return card.render(item);
    })
    basket.total = appData.getTotal()
})
// Изменилось состояние валидации формы order
events.on('formErrors:order', (errors: Partial<IOrderForm>) => {
    const {payment, address} = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

//Изменилось состояние валидации формы contact
events.on('formErrors:contact', (errors: Partial<IOrderForm>) => {
    const {email, phone} = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});


// Изменилось одно из полей order
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Изменилось одно из полей contact
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть форму контактов
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });