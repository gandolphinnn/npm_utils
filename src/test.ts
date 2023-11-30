import * as Utils from "./index.js";
/*
const newId = new Utils.Monad(document.querySelectorAll('canvas'))
	.apply((nl: NodeListOf<HTMLCanvasElement>) => Array.from(nl))
	.apply((arr: Array<HTMLCanvasElement>) => arr.map((cnv) => cnv.id))
	.apply((arr: Array<string>) => arr.filter(str => /^c\d+$/.test(str)))
	.apply((arr: Array<string>) => arr.map(str => parseInt(str.slice(1), 10)))
	.run(new Utils.Step((arr: Array<number>) => Math.max(...arr) + 1, (val: number) => val == -Infinity, 1)).log()
	console.log(newId.value)

const m = new Utils.Monad(12) //12
	.setCondition((v:number) => v == 12).setDefault(10)
	.reApply() //Set to 12 againt but with condition, that fails, so -> 10
	.run(new Utils.Step((v:number) => v*2, (v:number) => v % 2 == 0)) //20, fails -> 10
	.setCondition().setDefault()
	.apply((v:number) => v+2) //12
	.apply((v:number) => NaN) //Nan but failed
	.apply((v:number) => v-4) //8
	.reRun() //4
	.apply((v:number) => v.toString()).log()
	  
	class Test extends Utils.Singleton {
		static get instance() { return this.singletonInstance as Test }
		private constructor() {
			super();
			this.value = null
		}
		value: number;
	}
	const t1 = Test.instance;
	const t2 = Test.instance;
	const t3 = Test.instance;

if (t1 === t2 && t2 === t3) {
	console.log('Singleton works, both variables contain the same instance.');
} else {
	console.log('Singleton failed, variables contain different instances.');
}
*/

const ll = new Utils.LinkedList<number>
ll.pushFirst(1)
ll.pushAt(1, 2)
ll.pushLast(3)
console.table(ll.array,['index', 'data']);

ll.pushFirst(10)
ll.pushAt(2, 20)
ll.pushLast(30)
console.table(ll.array,['index', 'data']);

console.log(ll.popFirst())
console.log(ll.popAt(1))
console.log(ll.popLast())
console.table(ll.array,['index', 'data']);

console.log(ll.getFirst())
console.log(ll.getAt(1))
console.log(ll.getLast())

ll.setFirst(101)
ll.setAt(1, 102)
ll.setLast(103)
console.table(ll.array,['index', 'data']);
