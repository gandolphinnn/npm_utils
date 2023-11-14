import { Monad, Step, arrPivot, objPivot, overflow } from "./index.js";

const s = new Step((v: number) => v+2).run(2);
console.log(s.value);

const m = new Monad(12) //12
	.setCondition((v:number) => v == 12).setDefault(10)
	.reApply() //Set to 12 againt but with condition
	.run(new Step((v:number) => v*2, (v:number) => v % 2 == 0)) //24
	.apply((v:number) => v+2) //26 but failed, so 
	.apply((v:number) => NaN) //Nan but failed
	.apply((v:number) => v-4)
	.reRun(0)
	.apply((v:number) => v.toString())

console.table(m.history);
console.log(m.history.map((h: Step) => h.condition));

// Esempio di utilizzo
const minRange = -5;
const maxRange = -1;

console.log(m.history);
console.table(arrPivot(m.history))
console.table(objPivot(arrPivot(m.history)))

console.log(overflow(1, minRange, maxRange));