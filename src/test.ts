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
	const ll = new I.StaticList<number>();
	//* push
	ll.pushFirst(1);
	ll.pushAt(1, 2);
	ll.pushLast(3);
	I.test('push', ll.data, [1,2,3]);

	ll.pushFirst(10);
	ll.pushAt(2, 20);
	ll.pushLast(30);
	I.test('push', ll.data, [10,1,20,2,3,30]);
	
	//* pop
	ll.popFirst();
	ll.popAt(1);
	ll.popLast();
	I.test('pop', ll.data, [1,2,3]);

	//* get
	I.test('get', [ll.getFirst(), ll.getAt(1), ll.getLast()], [1,2,3]);

	//* set
	ll.setFirst(101);
	ll.setAt(1, 102);
	ll.setLast(103);
	I.test('set', ll.data, [101,102,103]);
	
	const searchRes = ll.find((n: number) => n < 103)
	I.test('find',I.arrPivot(searchRes).data, [101,102]);

	ll.swap(0,2);
	I.test('swap', ll.data, [103,102,101]);

	ll.reverse();
	I.test('reverse', ll.data, [101,102,103]);
	
	ll.sortCondition((n: number) => n % 2 == 0)
	I.test('sortCondition', ll.data, [102,101,103]);
	
	ll.sortKey()
	I.test('sortKey_simple', ll.data, [101,102,103])
	
	const llObj = new I.StaticList<{age:number}>({age:60}, {age:70}, {age:50});
	llObj.sortKey("age", true);
	I.test('sortKey_Object_reversed', llObj.data, [{"age":70},{"age":60},{"age":50}]);
	
	//#endregion
	