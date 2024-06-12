import './scss/styles.scss';
import {Api} from "./components/base/api";
import {API_URL} from "./utils/constants";

const listApi = new Api(API_URL)

listApi.get('/product').then(console.log)
