import * as I from "./index.js";

//#region Monad
	const m = new I.Monad(12) //12
		.setCondition((v:number) => v == 12).setDefault(10)
		.reApply() //Set to 12 againt but with condition, that fails, so -> 10
		.run(new I.Step((v:number) => v*2, (v:number) => v % 2 == 0)) //20, fails -> 10
		.setCondition().setDefault()
		.apply((v:number) => v+2) //12
		.apply((v:number) => NaN) //Nan but failed
		.apply((v:number) => v-4) //8
		.reRun() //4
		.apply((v:number) => v.toString()).log()	
//#endregion

//#region Singleton
	class Test extends I.Singleton {
		static get instance() { return this.singletonInstance as Test }
		private constructor() {
			super();
			this.value = null
		}
		value: number;
	}
	const t1 = Test.instance;
	const t2 = Test.instance;
	t1 === t2? console.log('Singleton works') : console.log('Singleton fails');
//#endregion

//#region LinkedList
	const ll = new I.LinkedList<number>
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
//#endregion