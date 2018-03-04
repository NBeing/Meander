import { range }        from "lodash"
import Canvas           from "./canvas"
import Node             from "./node"
import Utils            from "../util/util"
import { tMatrix , CantorConfig } from "../util/types"



export class CantorSet {
  root    : any;
  depth   : number;
  divisor : number;
  length  : number;
  public toDraw:any = [];
  constructor( root:any, depth:number, divisor: number, length: number) {
    this.root       = root;
    this.depth      = depth;
    this.divisor    = divisor;
    this.length     = length
    this.root.value = this.generateRoot();
    this.init();
    console.log(this.root)
  }
  init(){
    this.fillTree(this.root);
    this.getAllAtDepth(this.root, this.depth);
  }
  generateRoot = () => ({
      length   : this.length,
      level    : 0,
      offset   : 0,
      index    : 0,
      i        : 0,
      baseTilt : 0
  })

  public map( fn:any, root:Node=this.root, level:number=0 ){
    if( level === 0 ){
      this._map( fn, root, level );
    } else if( level === this.depth - 1 ){
      root.children.forEach((r:any) => this._map( fn, r, level ))
    } else if(root.children){
      root.children.forEach((r:any) => this.map( fn, r, level + 1 ))
    }
  }
  _map(fn:any,root:Node, level:any){
    fn(root);
    this.map( fn , root , level+1 )
  }
  sum( level:number, count:number=0, i:number=0 ):any {
    return ( i <= level )
             ? this.sum( level, count + Math.pow( this.divisor , i ) , i + 1)
             : count
  }
  getAllAtDepth(root: Node, level:number){
    if(level === 1){
      this.toDraw.push(root.value);
    } else if (level > 1){
      this.getAllAtDepth(root.children[0], level - 1 )
      this.getAllAtDepth(root.children[1], level - 1 )
      this.getAllAtDepth(root.children[2], level - 1 )
      this.getAllAtDepth(root.children[3], level - 1 )
    }
  }
  createChildren( root: any, level:number){
    return range(this.divisor + 1)
      //.filter( n => !(n % 2) )
      .map( (n,i) => {
        let index  = (root.value.index *  this.divisor) + n + 1
        //let length = root.value.length / this.divisor
        let length = Math.pow(4, this.divisor)
        let offset = index - this.sum( level - 1)
        let start  = this.length * Math.pow(3, -level)
        let baseTilt = root.value.i
        return new Node({ length, index, offset, level, i, baseTilt, start})
           });
  }
  fillTree( root:Node , level:number=1 ) {
    if(level < this.depth){
      root.children = this.createChildren(root, level);
      root.children.forEach( (r:any) => this.fillTree(r, level + 1));
    }
  }
}
