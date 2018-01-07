export default class Node {
  _value : any;
  _children: any[]

  constructor( val:any, children:any=null) {
    this.value = val;
    this._children =  children || null;
  }
  get value() {
    return this._value;
  }
  set value( newValue ) {
    this._value = newValue;
  }

  set children( leaf:any ) {
    this._children = leaf;
  }

  get children() {
    return this._children;
  }
}
