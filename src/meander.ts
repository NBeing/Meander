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
  }
  init(){
    this.ctx.transform(1,0,0,1,0,0)
    this.ctx.translate( 800, Utils.windowHeight() / 1.5 )


    this.angle   = ((Math.PI * 2) / this.config.sides)
    let savedPos = this.generateSpacing(this.config.sides).map((n:any,i:any, c:any) => {
      let x  = this.config.sideLength * Math.sin(n)
      let y  = this.config.sideLength * Math.cos(n)
      let x1 = this.config.sideLength * Math.sin((c[i+1])? c[i+1] : c[0])
      let y1 = this.config.sideLength * Math.cos((c[i+1])? c[i+1] : c[0])
      let a  = (x1 - x)
      let b  = (y1 - y)
      let slope = b/a
      let sideAngle = (a < 0) ? Math.PI + Math.atan(slope) : Math.atan(slope)
      return { x , y , sideAngle }
    })

    //let totalLength = this.config.sideLength * Math.pow(4/3, this.config.depth )
    let numberOfSegments  = Math.pow( 4 , this.config.depth);
    let polygonSideLength = this.config.sideLength * 2 * Math.sin(this.angle/2)
    let segmentLength     = polygonSideLength * Math.pow((1/3), this.config.depth)

    const source = Rx.Observable.interval(10).take(numberOfSegments)
    range(this.config.sides).forEach((n:number) =>{
      source.subscribe( (x:any) => {
        let getAxis = this.triangulate(segmentLength, x, savedPos[n].sideAngle, this.config.flip)
        let newX = savedPos[n].x + getAxis('x')
        let newY = savedPos[n].y + getAxis('y')

        this.drawLine(savedPos[n].x, savedPos[n].y, newX, newY, 3)

        savedPos[n].x = newX;
        savedPos[n].y = newY;

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
  generateSpacing = (sides:number) => range(sides).map( n => n * ((Math.PI * 2)/sides));
}

