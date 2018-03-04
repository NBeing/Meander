import Canvas           from "./canvas"
import {CantorSet}      from "./cantor"
import { range }        from "lodash"
import Node             from "./node"
import {
  tMatrix      ,
  CantorConfig
}                       from "../util/types"
import * as Rx          from 'rxjs'
import Utils            from "../util/util"

function sleep(ms:any) {
  return new Promise((resolve:any) => setTimeout(resolve, ms));
}
export default class CantorCanvas extends Canvas {
  _cantorSet      : CantorSet
  config          : CantorConfig
  transformaation : tMatrix
  polygonLength   : number
  angle           : number

  constructor(
    selector       : string       ,
    config         : CantorConfig ,
  ){
    super(selector)
    this.config = config
    this.init()
  }
  set cantorSet( cantorSet: CantorSet){
    this._cantorSet = cantorSet
  }
  generateCantorSet(){
    return new CantorSet( new Node(null), //Empty node as the ROOT
                          this.config.depth,  // depth
                          this.config.divisions,  // # of times to divide set
                          this.polygonLength ) // pixel length of initial guy
  }
  transformByAngle(angle:number, input:number){
    if(input === 0 || input === 3){
      return 0
    }
    if(input === 1){
      return Math.PI/3;
    }
    if(input === 2){
      return -Math.PI/3;
    }
  }
  getAngleFromIndex(index:number){
    var i = index
    var b = i.toString(4);
    var t = b.split('').map( (x:any)=>{
      return this.transformByAngle( Math.PI/3 , parseInt(x));
    })
    return t.reduce((acc: number, cur: number) =>{
      acc += cur;
      return acc
    },0)
  }
  triangulate =
    ( segmentLength:number, count:number, baseRotation:number, flip: boolean) =>
        (axis: string) =>  segmentLength * ( axis === 'x' ? Math.cos : Math.sin )
                           ((flip ? -1 : 1) * this.getAngleFromIndex( count ) + baseRotation  );

  async init(){

    this.ctx.transform(1,0,0,1,0,0)
    this.ctx.translate(100,50);
    this.ctx.save()
    this.angle  = ((Math.PI * 2) / this.config.sides)
    this.polygonLength = this.calculateBasis( this.config.baseLen + this.config.makeLonger, this.config.sides, this.angle);
    this.cantorSet = this.generateCantorSet();
    this.drawCantor();
    this.generateSpacing(this.config.sides).forEach( n => {
      this.drawSide( this.config.baseLen, this.angle, n);
      //this.meander( this.config.baseLen, this.angle, n)
    })

    this.ctx.translate( 400, Utils.windowHeight() / 4 )
    this.config.sides = 3;

    const depth = 5;
    const desiredWidth = 300;
    const numberOfSegments = Math.pow( 4 , depth);
    const segmentLength = 2000;
    let flip = false;
    let baseRotation = 0;
    let rotationIncrement = (Math.PI * 2) / this.config.sides

    const savedPos   = { x: 0, y: 0}
    // const subject$ = new Rx.BehaviorSubject(null);
    // const source   = Rx.Observable.interval(500).subscribe();
    // const merged$  = Rx.Observable.merge( subject$, source);

    // merged$.subscribe( x => {
    //   console.log("Merged", x)
    // })
    // subject$.subscribe( x => {
    //   console.log("Ob", x)
    // })
    range(this.config.sides).forEach((n) =>{
      var count = 0
      while (count < numberOfSegments){
        let getAxis = this.triangulate(segmentLength, count, (baseRotation + (n * rotationIncrement)), flip)
        let newX = savedPos.x + getAxis('x')
        let newY = savedPos.y + getAxis('y')
        this.drawLine( savedPos.x, savedPos.y, newX, newY, 1)
        savedPos.x = newX;
        savedPos.y = newY;
        //await sleep(40);
        count++;
      }
    })
  }
  calculateBasis = (length:number, sides:number, angle:number) => {
    let d = Math.PI - (Math.PI/2) - (angle/2)
    let a = length * Math.cos(Math.PI - d)
    return Math.abs(2 * a);
  }
  drawSide = (length:number, angle: number, start:number) => {

    let d = Math.PI - (Math.PI/2) - (angle/2)
    let a = length * Math.cos(Math.PI - d)

    this.ctx.save();

    this.ctx.translate( Utils.windowWidth()  / 4, Utils.windowHeight() / 4 )
    this.ctx.rotate(start)
    this.ctx.translate(length,0)
    this.ctx.rotate(d - Math.PI)

    this.drawCantor();

    this.ctx.restore()
  }
  drawCantor(){
    this._cantorSet.map((x:any) => {
      let levelHeight = (x.value.level * this.config.lineHeight);
      let x0 = x.value.offset * x.value.length
      this.drawLine( x0, levelHeight,
                     x0 + x.value.length, levelHeight,
                     this.config.lineWidth )
    });
  }

  generateSpacing = (sides:number) => range(sides).map( n => n * ((Math.PI * 2)/sides));
}

