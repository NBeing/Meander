import Canvas           from "./canvas"
import { range }        from "lodash"
import Node             from "./node"
import {
  tMatrix      ,
  MeanderConfig
}                       from "./types"
import * as Rx          from 'rxjs'
import Utils            from "./util"

export default class MeanderCanvas extends Canvas {
  config          : MeanderConfig
  polygonLength   : number
  angle           : number

  constructor(
    selector       : string        ,
    config         : MeanderConfig ,
  ){
    super(selector)
    this.config = config
    this.init()
    console.log("Meanderd", this.config)
  }
  init = () => {

    this.ctx.transform(1,0,0,1,0,0)
    this.angle  = ((Math.PI * 2) / this.config.sides)
    this.ctx.translate( Utils.windowWidth()/2, Utils.windowHeight() / 2 )
    this.config.sides = 6;
    console.log("angle", this.angle)
    // this.generateSpacing(this.config.sides).map( n => {
    //   let x = this.config.sideLength * Math.sin(n)
    //   let y = this.config.sideLength * Math.cos(n)
    //   return {y,x};
    // }).forEach( n => {
    //   console.log("Space gen", n)
    //   //this.drawLine(0,0,x,y,1);
    //   // this.drawSide(300, this.angle, n);
    // })
    let savedPos = this.generateSpacing(this.config.sides).map((n:any,i:any, c:any) => {
      console.log("N", n)
      let each = 2*Math.PI / this.config.sides;
      let x  = this.config.sideLength * Math.sin(n)
      let y  = this.config.sideLength * Math.cos(n)
      let x1 = this.config.sideLength * Math.sin((c[i+1])? c[i+1] : c[0])
      let y1 = this.config.sideLength * Math.cos((c[i+1])? c[i+1] : c[0])
      let x2 = this.config.sideLength * Math.sin( n + ((Math.PI) + each))
      let y2 = this.config.sideLength * Math.cos( n + ((Math.PI) + each))
      let sideAngle = n + ((Math.PI) + each/ this.config.sides)
      console.log("Side angle", sideAngle)
      let a  = (x1 - x)
      let b  = (y1 - y)

      // let xD =  y / x
      // console.log("xD", xD)
      // this.drawLine(x + 10 ,y, 300, 300  * xD ,4);
      this.drawLine(x,y,x2,y2,4);
      if(n == 0){
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(x,y,10,10)
      }
      // this.ctx.fillRect(x2,y2,10,10)
      this.drawLine(x,y,x1,y1,8);
      return {x,y, sideAngle};
    })
    let init = savedPos;
    console.log("Sa", savedPos)

    // this.polygonLength = this.calculateBasis( this.config.baseLen + this.config.makeLonger, this.config.sides, this.angle);
    // this.drawCantor();
    // this.generateSpacing(this.config.sides).forEach( n => {
    //   this.drawSide( this.config.baseLen, this.angle, n);
    //   //this.meander( this.config.baseLen, this.angle, n)
    // })

    this.config.depth = 4;
    this.config.sideLength = 800;
    this.config.flip = true;
    const numberOfSegments = Math.pow( 4 , this.config.depth);
    const segmentLength =  (this.config.sideLength / numberOfSegments)  * (Math.pow(4, this.config.depth)/ Math.pow(3, this.config.depth));
    let rotationIncrement = ((Math.PI * 2) / this.config.sides)

    // const savedPos = [{ x: 0, y: 0}, { x: 0, y: 0}, { x: 0, y: 0},  { x: 0, y: 0}]
    const subject$ = new Rx.BehaviorSubject(null);
    const source   = Rx.Observable.interval(1).take(numberOfSegments)
    const merged$  = Rx.Observable.merge( subject$, source);
    // console.log("Sub", rotationIncrement,  segmentLength, numberOfSegments)

    range(this.config.sides).forEach((n:number) =>{
      source.subscribe( (x:any) => {
        let getAxis = this.triangulate(segmentLength, x, Math.PI - (savedPos[n].sideAngle)  , this.config.flip)
        let newX = savedPos[n].x + getAxis('x')
        let newY = savedPos[n].y + getAxis('y')

        this.drawLine( savedPos[n].x, savedPos[n].y, newX, newY, 1)
        savedPos[n].x = newX;
        savedPos[n].y = newY;
        //console.log("S", savedPos)
      })
    })
  }

  triangulate =
    ( segmentLength:number, count:number, baseRotation:number, flip: boolean) =>
    (axis: string) => segmentLength * ( axis === 'x' ? Math.cos : Math.sin )
                      ((flip ? -1 : 1) * this.getAngleFromIndex( count ) + baseRotation  );

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

  calculateBasis = (length:number, sides:number, angle:number) => {
    let d = Math.PI - (Math.PI/2) - (angle/2)
    let a = length * Math.cos(Math.PI - d)
    return Math.abs(2 * a);
  }
  drawSide = (length:number, angle: number, start:number) => {

    let d = Math.PI - (Math.PI/2) - (angle/2)
    let a = length * Math.cos(Math.PI - d)

    this.ctx.save();

    this.ctx.rotate(start)
    this.ctx.translate(length,0)
    this.ctx.rotate(d - Math.PI)
    this.drawLine(0,0,length,0,1)
    this.ctx.restore()
  }
  generateSpacing = (sides:number) => range(sides).map( n => n * ((Math.PI * 2)/sides));
}

