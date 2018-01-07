export default {
  windowWidth : () =>{
    return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  },
  windowHeight : () =>{
    return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  },
  getScreenDimensions: () => ({ width: this.windowWidth, height: this.windowHeight})
}
