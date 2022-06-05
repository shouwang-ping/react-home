export default function isPlainObject(obj) {
    if(typeof obj != 'object' || obj === null) {
        return false
    }
    let proto = obj
    while(Object.getPrototypeOf(proto)) { // proto.__proto__   // proto.__proto__.__proto__ => Object.prototype 一直找原型
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) === proto
}
// function P() {}
// let p = new P()