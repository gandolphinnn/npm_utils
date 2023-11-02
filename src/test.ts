import { Monad } from "./index.js";
let x = []
let m = new Monad(12)
		.Apply((v:number) => {return v*2}).SetConditions(true, (v:number) => {return v %2 == 0})
		.Apply((v:number) => {return v+2}).SetConditions()
		.Apply((v:number) => {return v/x[1]})
		.Apply((v:number) => {return v-4})
		.Apply((v:number) => {return v.toString()})

console.table(m)