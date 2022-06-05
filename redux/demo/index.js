import store from "./store";
import actions from './store/actions'
import bindActionCreators from '../../react'

let bindActions = bindActionCreators(actions, store.dispatch)

<button onClick={() => bindActions.increment}>点击</button>