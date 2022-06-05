// vnode 虚拟dom对象
// node 真实dom节点

// ! 初次渲染

// work in progress 进行当中的 fiber
let wipRoot = null;
function render(vnode, container) {
  // console.log("vnode", vnode); //sy-log
  // // vnode->node
  // const node = createNode(vnode);
  // // node->container
  // container.appendChild(node);

  wipRoot = {
    type: "div",
    props: {
      children: {...vnode},
    },
    stateNode: container,
  };

  nextUnitOfWOrk = wipRoot;
}

function createNode(workInProgress) {
  const {type} = workInProgress;
  const node = document.createElement(type);
  updateNode(node, workInProgress.props);
  return node;
}

// 原生标签节点
function updateHostComponent(workInProgress) {
  const {type, props} = workInProgress;
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }

  reconcileChildren(workInProgress, workInProgress.props.children);

  console.log("workInProgress", workInProgress); //sy-log
}

// 更新属性
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    // .filter((k) => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        if (typeof nextVal[k] === "string") {
          node.textContent = nextVal[k];
        }
      } else {
        node[k] = nextVal[k];
      }
    });
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

// 协调子节点
function reconcileChildren(workInProgress, children) {
  if (typeof children === "string" || typeof children === "number") {
    return;
  }

  const newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let newFiber = {
      type: child.type,
      props: {...child.props},
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress,
    };

    if (i === 0) {
      // 第一个子fiber
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    // 记录上一个fiber
    previousNewFiber = newFiber;
  }
}

// 下一个单元任务 fiber
let nextUnitOfWOrk = null;

// fiber js对象
// type 类型
// key
// props 属性
// stateNode
// child 第一个子节点
// sibling 下一个兄弟节点
// return 父节点

function performUnitOfWork(workInProgress) {
  // step1 执行任务
  // todo
  const {type} = workInProgress;
  if (typeof type === "string") {
    // 原生标签节点
    updateHostComponent(workInProgress);
  }

  // step2 并且返回下一个执行任务
  //王朝的故事
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(IdleDeadline) {
  while (nextUnitOfWOrk && IdleDeadline.timeRemaining() > 1) {
    // 执行任务， 并且返回下一个执行任务
    nextUnitOfWOrk = performUnitOfWork(nextUnitOfWOrk);
  }

  // 提交
  if (!nextUnitOfWOrk && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(workInProgress) {
  // 提交自己

  if (!workInProgress) {
    return;
  }

  let parentNodeFiber = workInProgress.return;
  let parentNode = parentNodeFiber.stateNode;

  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }

  // 提交子节点
  commitWorker(workInProgress.child);

  // 提交兄弟节点
  commitWorker(workInProgress.sibling);
}

export default {render};
