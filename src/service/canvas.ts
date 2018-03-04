import { tMatrix } from "../util/types";

export default class CantorCanvas{
  protected  _canvas        : HTMLCanvasElement;
  public     ctx            : CanvasRenderingContext2D;
  private    selector       : string;

  constructor( selector:string){
    this.selector = selector;
    this.setup();
  }

  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }
  public get canvas(): HTMLCanvasElement{
    return this._canvas
  }
  getRandomArbitrary(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  getRandomColor(){
    return `rgba(
                ${this.getRandomArbitrary(0,255)},
                ${this.getRandomArbitrary(0,255)},
                ${this.getRandomArbitrary(0,255)},
                0.5
            )`;
  }
  public drawLine(
    x1        : number ,
    y1        : number ,
    x2        : number ,
    y2        : number ,
    lineWidth : number ,
    color     : string = this.getRandomColor()
  ){
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke()
  }

  drawCircle( xPos:number, yPos:number, size:number, radians:number, color:string ){

    this.ctx.strokeStyle = color

    this.ctx.arc( xPos    ,
                  yPos    ,
                  size    ,
                  0       ,
                  radians ,
                  false   )

    this.ctx.stroke()
  }
  transform = ( matrix:tMatrix ) => {
    this.ctx.transform.apply(this.ctx, matrix);
  }
  setup = (): void =>{
    this._canvas        = <HTMLCanvasElement>document.getElementById(this.selector)
    this._canvas.width  = window.innerWidth
    this._canvas.height = window.innerHeight
    this.ctx            = this._canvas.getContext('2d')
    this.ctx.fillStyle  = "black";
    this.ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }
}
