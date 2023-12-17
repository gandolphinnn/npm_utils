import Enumerable from "linq";
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
		.apply((v:number) => v.toString()).log(true)
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
	const ll = []
	//* push
	ll.pushAt(0, 1);
	ll.pushAt(1, 2);
	ll.push(3);
	I.test('push', ll, [1,2,3]);

	ll.pushAt(0, 10);
	ll.pushAt(2, 20);
	ll.push(30);
	I.test('push', ll, [10,1,20,2,3,30]);
	
	//* pop
	ll.popAt(0);
	ll.popAt(1);
	ll.pop();
	I.test('pop', ll, [1,2,3]);

	//* get
	I.test('get', [ll[0], ll[1], ll.last()], [1,2,3]);

	//* set
	ll[0] = 101;
	ll[1] = 102;
	ll.last(103);
	I.test('set', ll, [101,102,103]);	
//#endregion	