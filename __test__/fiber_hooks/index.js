import React from 'react';
import {IndeterminateComponent} from './ReactWorkTags';
import {render} from './ReactFiberWorkLoop';
import {useReducer,useState} from './ReactFiberHooks';
//useState其实是useReducer的语法糖
//函数组件
function Counter(){
  const [number,setNumber]  = useState(0);//hook.queue={pending:update2}update2.next=update1
  const [age,setAge]  = useState(0);//hook.queue = {pending:update4};update4.next=update3
  return (
   <div onClick={
     ()=>{
       setNumber(1);//update1
       setNumber(1);//update2
       setAge();//update3
       setAge();//update4
     }
   }></div>
  )
}
let counterFiber = {
  tag:IndeterminateComponent, //Fiber的类型 函数组件在初次渲染的时候对应的类型 是IndeterminateComponent
  type:Counter,//此组件的具体 类型是哪个组件
  alternate:null //上一个渲染的fiber
}
render(counterFiber);