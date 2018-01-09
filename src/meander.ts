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
  scaleFactor     : number
  lastX           : number
  lastY           : number
  clicks          : number
  constructor(
    selector       : string        ,
    config         : MeanderConfig ,
  ){
    super(selector)
    this.config = config
    console.log("init with config", config);
    this.scaleFactor = 1.1;
    this.lastX = this.canvas.width/2;
    this.lastY = this.canvas.height/2;
    this.clicks = 0;
    this.init()

  }
  zoom = (clicks:any) => {
    // var pt = (this.ctx as any).transformedPoint(this.lastX,this.lastY)// ;
    // this.ctx.translate(pt.x,pt.y);
    if(clicks === -1){
      console.log("Negativo")
      this.clicks = 0
    }
    this.clicks += clicks

    var factor = Math.pow(this.scaleFactor,this.clicks + clicks);
    this.ctx.scale(factor,factor);
    // this.ctx.translate(-pt.x,-pt.y);
    this.draw();
  }
  resetClicks(){
    while(this.clicks !== 0){
      if(this.clicks >= 0){
        var factor = Math.pow(this.scaleFactor,-1);
        this.ctx.scale(factor,factor);
        this.clicks -= 1;
      } else {
        console.log("L")
        var factor = Math.pow(this.scaleFactor,1);
        this.ctx.scale(factor,factor);
        this.clicks += 1;
      }
    }
  }
  init(){
    this.ctx.fillRect (0,0,this.canvas.width/2, this.canvas.height/2)
    this.ctx.translate( this.canvas.width /2 , this.canvas.height/2 )

    this.ctx.save()
    this.ctx.fillStyle = "black";
    this.ctx.scale(0.15,0.15);
    this.ctx.transform(1,0,0,1,0,0)

    document.addEventListener('keypress', (evt) => {
      console.log("Key", evt)
      evt.preventDefault();
      // console.log("Which", evt.which)
      if( evt.key === '0'){
        console.log("Right")
        evt.preventDefault();
        this.resetClicks()
      } else if (evt.key === '-'){
        console.log("M UP")
        this.zoom( -1 );
      } else if ( evt.key === '+'){
        this.zoom( 1 );
      } else if ( evt.key === 'c'){
        this.ctx.restore();
        this.draw();
      }
    },false);

    this.canvas.addEventListener('mousemove', (evt:any) => {
      this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
      this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
    })
    this.angle   = ((Math.PI * 2) / this.config.sides)
    this.draw();
  }

  draw(){
    this.ctx.translate(-this.canvas.width /2 , -this.canvas.height/2 )
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.translate( this.canvas.width /2 , this.canvas.height/2 )

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
    let source:any;
    if(this.config.noAnimation){
      source = Rx.Observable.from(range(this.config.numSegments ||  numberOfSegments))
    } else {
      source = Rx.Observable.interval(1).take(this.config.numSegments ||  numberOfSegments)
    }

    range(this.config.sides).forEach((n:number) =>{
      source.subscribe( (x:any) => {
        let getAxis = this.triangulate(segmentLength, x, savedPos[n].sideAngle, this.config.flip)
        let newX = savedPos[n].x + getAxis('x')
        let newY = savedPos[n].y + getAxis('y')

        this.drawLine(savedPos[n].x, savedPos[n].y, newX, newY, this.config.lineWidth || 3)

        savedPos[n].x = newX;
        savedPos[n].y = newY;

      })
    })

  }
  triangulate =
    ( segmentLength:number, count:number, baseRotation:number, flip: boolean) =>
    (axis: string) => segmentLength * ( axis === 'x' ? Math.cos : Math.sin )
  ((flip ? -1 : 1) * this.getAngleFromIndex( count, this.config.base ) + baseRotation  );

  transformByAngle(input:number){
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
  transformByAngle2( input:number){
    if(input === 0 || input === 3){
      return 0
    }
    if(input === 1){
      return Math.PI/2;
    }
    if(input === 2){
      return -Math.PI/4;
    }
    if(input === 7 || input === 4){
      return 0
    }
    if(input === 5){
      return -Math.PI/3;
    }
    if(input === 6){
      return -Math.PI/2;
    }
  }
  getAngleFromMotifConfig( input:number){
    try{
    return this.config.motifConfig[input]
    } catch(e){
      console.log(this.config)
      console.log(e);
    }
  }
  getAngleFromIndex(index:number, base:number){
    // Convert to base4 and aget the corresponding angle
    return index.toString(base)
      .split('')
      .map( (x:any) => this.getAngleFromMotifConfig(parseInt(x)))
      .reduce((acc: number, cur: number) => acc += cur , 0)
  }
  generateSpacing = (sides:number) => range(sides).map( n => n * ((Math.PI * 2)/sides));
}

