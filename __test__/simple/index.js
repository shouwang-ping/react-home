// class React {
//     constructor() {

//     }
// }

// export default React

// import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "./react-dom";

import Component from "./Component";

import "./index.css";

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>函数组件-{this.props.name}</p>
      </div>
    );
  }
}

export default ClassComponent;

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>函数组件-{props.name}</p>
    </div>
  );
}

const jsx = (
  <div className="border">
    <h1>全栈</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="function" />
    <ClassComponent name="class" />
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

// console.log("version", React.version); //sy-log

// 原生标签节点
// 文本节点
// 函数组件
// 类组件
