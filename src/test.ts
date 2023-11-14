import { Monad, Step } from "./index.js";

const s = new Step((v: number) => v+2).Run(2);
console.log(s.value);

const m = new Monad(12)
	.Apply((v:number) => v*2).SetCondition((v:number) => v % 2 == 0) //24
	.Apply((v:number) => v+2).SetCondition() //26 but failed
	.Apply((v:number) => NaN) //Nan but failed
	.Apply((v:number) => v-4)
	.Apply((v:number) => v.toString())

console.table(m.history);
console.log(m.history.map((h: Step) => h.condition));

