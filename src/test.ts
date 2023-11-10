import { Monad } from "./index.js";

let m = new Monad(12)
	.apply((v:number) => v*2).setConditions(true, (v:number) => v % 2 == 0)
	.apply((v:number) => v+2).setConditions()
	.apply((v:number) => NaN)
	.apply((v:number) => v-4)
	.apply((v:number) => v.toString())
console.log(m);

