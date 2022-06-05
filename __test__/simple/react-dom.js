// vnode 虚拟dom对象
// node 真实dom节点

// ! 初次渲染
function render(vnode, container) {
  console.log("vnode", vnode); //sy-log
  // vnode->node
  const node = createNode(vnode);

  // node->container
  container.appendChild(node);
}

function createNode(vnode) {
  let node;
  const {type} = vnode;

  // todo 根据组件类型的不同创建不同的node节点

  if (typeof type === "string") {
    node = updateHostComponent(vnode);
  } else if (typeof type == "function") {
    // 函数组件
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  } else {
    node = updateTextComponent(vnode);
  }

  return node;
}

// 原生标签节点
function updateHostComponent(vnode) {
  const {type, props} = vnode;
  const node = document.createElement(type);
  updateNode(node, props); // 属性
  reconcileChildren(node, props.children); // 遍历children
  return node;
}

// 文本
function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

//函数组件
function updateFunctionComponent(vnode) {
  const {type, props} = vnode;
  const vvnode = type(props);
  // vvnode->node
  const node = createNode(vvnode);
  return node;
}

// 类组件
function updateClassComponent(vnode) {
  const {type, props} = vnode;
  const instance = new type(props);
  const vvnode = instance.render();
  // vvnode->node
  const node = createNode(vvnode);
  return node;
}

// 更新属性
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter((k) => k !== "children")
    .forEach((k) => (node[k] = nextVal[k]));
}

function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    // vnode
    // vnode->node, node插入到parentNode
    render(child, parentNode); // 笔记：会依次渲染，没有体现优先级
  }
}

export default {render};
