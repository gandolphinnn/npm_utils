import Enumerable from "linq";
import * as I from "./index.js";

const linq = Enumerable.from([1,3,2,4])
console.log(linq.orderBy(w => w).toArray());
console.log(linq.toArray());


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
	I.test('push', ll.items, [1,2,3]);

	ll.pushFirst(10);
	ll.pushAt(2, 20);
	ll.pushLast(30);
	I.test('push', ll.items, [10,1,20,2,3,30]);
	
	//* pop
	ll.popFirst();
	ll.popAt(1);
	ll.popLast();
	I.test('pop', ll.items, [1,2,3]);

	//* get
	I.test('get', [ll.getFirst(), ll.getAt(1), ll.getLast()], [1,2,3]);

	//* set
	ll.setFirst(101);
	ll.setAt(1, 102);
	ll.setLast(103);
	I.test('set', ll.items, [101,102,103]);
	
	const searchRes = ll.find((n: number) => n < 103)
	I.test('find',searchRes, [101,102]);

	ll.swap(0,2);
	I.test('swap', ll.items, [103,102,101]);

	ll.reverse();
	I.test('reverse', ll.items, [101,102,103]);
	
	ll.linq((linq) => {
		return linq.orderBy(w => w != 102)
	})
	I.test('sortCondition', ll.items, [102,101,103]);
	
	ll.linq((linq) => {
		return linq.orderBy(w => w)
	})
	I.test('sortKey_simple', ll.items, [101,102,103])
	
	const llObj = new I.StaticList<{id: number, age:number}>({id: 2, age:60}, {id: 1, age:60}, {id: 3, age:70});
	llObj.linq((linq) => {
		return linq.orderBy(w => w.id).orderByDescending(w => w.age)
	})
	I.test('sortKey_Object_reversed', llObj.items, [{"id": 3,"age":70},{"id": 1,"age":60},{"id": 2,"age":60}]);
	
	
	//#endregion
	