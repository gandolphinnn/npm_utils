import { Monad, Step, arrPivot, objPivot, overflow } from "./index.js";

const s = new Step((v: number) => v+2).run(2);
console.log(s.value);

const m = new Monad(12) //12
	.setCondition((v:number) => v == 12).setDefault(10)
	.reApply() //Set to 12 againt but with condition, that fails, so -> 10
	.run(new Step((v:number) => v*2, (v:number) => v % 2 == 0)) //20, fails -> 10
	.setDefault()
	.apply((v:number) => v+2) //12
	.apply((v:number) => NaN) //Nan but failed
	.apply((v:number) => v-4) //8
	.reRun() //4
	.apply((v:number) => v.toString())

console.table(m.history);
console.log(m.history.map((h: Step) => h.condition));

// Esempio di utilizzo
const minRange = 0;
const maxRange = 0;

console.log(m.history);
console.table(arrPivot(m.history))
console.table(objPivot(arrPivot(m.history)))

console.log(overflow(1, minRange, maxRange));