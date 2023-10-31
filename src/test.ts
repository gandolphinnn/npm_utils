import { Monad } from "./index.js";
let m = new Monad(12)
		.apply((v:number) => {return v*2})
		.apply((v:number) => {return v-4})
		.apply((v:number) => {return v.toString()})

console.log(m)