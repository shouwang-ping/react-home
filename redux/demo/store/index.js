import { createStore } from "../../../react"; // 自己的库
import reducer from './reducers'
let store = createStore(reducer)
export default store