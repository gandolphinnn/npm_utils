import { Monad } from "./index.js";

let m = new Monad(12)
	.apply((v:number) => v*2).setConditions((v:number) => v % 2 == 0) //24
	.apply((v:number) => v+2).setConditions() //26 but failed
	.apply((v:number) => NaN) //Nan but failed
	.apply((v:number) => v-4)
	.apply((v:number) => v.toString())
console.log(m);

