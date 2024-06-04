const lerp = (a, b, t) => a + (b-a) * t
const clamp = (val, max) => val > max ? max : val
const floorClamp = (val, min) => val < min ? min : val
const parabolic = (x,k) => Math.pow( 4.0*x*(1.0-x), k );
//  www.iquilezles.org/www/articles/functions/functions.htm
const impulse = ( howSteep, x ) => {
  let h = howSteep*x;
  return h* Math.exp(1.0 - h);
}

export {
    lerp,
    clamp,
    floorClamp,
    parabolic,
    impulse,
}