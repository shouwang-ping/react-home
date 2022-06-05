
import {allNativeEvents} from './EventRegistry';
import * as SimpleEventPlugin from './SimpleEventPlugin';
//注册事件名称，核心作用是给allNativeEvents赋值
SimpleEventPlugin.registerEvents();
/**
 * 监听所有的绑定的插件
 */
export function listenToAllSupportedEvents(container){
    //事件插件注册完了以后，会在此进行循环绑定事件处理函数到容器container上
    allNativeEvents.forEach(domEventName=>{
        console.log('domEventName',domEventName);
        //绑定事件
    });
}