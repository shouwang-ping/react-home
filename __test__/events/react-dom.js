// 珠峰 合成事件系统 测试文件

import {listenToAllSupportedEvents} from './DOMPluginEventSystem';
function render(vdom,container){
  debugger
  listenToAllSupportedEvents(container);
  mount(vdom,container);
}

function mount(vdom,parentDOM){
  let newDOM = createDOM(vdom,parentDOM);
  parentDOM.appendChild(newDOM);
}

function createDOM(vdom,parentDOM){
    let {type,props} = vdom;
    let dom;
    if(typeof vdom === 'string' || typeof vdom === 'number'){
       dom = document.createTextNode(vdom);
    }else{
       dom = document.createElement(type);
    }
    if(props){
        updateProps(dom,{},props);
        if(Array.isArray(props.children)){
            reconcileChildren(props.children,dom);
        }else{
            mount(props.children,dom);
        }
    }
    return dom;
}
function reconcileChildren(children,parentDOM){
    children.forEach(child=>mount(child,parentDOM))
}
function updateProps(dom,oldProps,newProps){

}
const ReactDOM = {
    render
}
export default ReactDOM;