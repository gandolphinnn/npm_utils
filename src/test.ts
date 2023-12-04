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
	const ll = new I.StaticList<number>
	//* push
	ll.pushFirst(1)
	ll.pushAt(1, 2)
	ll.pushLast(3)
	console.log(ll.arrayData) //[1,2,3]

	ll.pushFirst(10)
	ll.pushAt(2, 20)
	ll.pushLast(30)
	console.log(ll.arrayData) //[10,1,20,2,3,30]
	
	//* pop
	console.log(ll.popFirst())
	console.log(ll.popAt(1))
	console.log(ll.popLast())
	console.log(ll.arrayData) //[1,2,3]

	//* get
	console.log(ll.getFirst(), ll.getAt(1), ll.getLast()) //1 2 3

	//* set
	ll.setFirst(101)
	ll.setAt(1, 102)
	ll.setLast(103)
	console.log(ll.arrayData) //[101,102,103]
	
	ll.swap(0,2);
	console.log(ll.arrayData) //[103,102,101]
	
	console.log(ll.arrayData) //[103,102,101]

	const searchRes = ll.find((n: number) => n < 103)
	console.log(I.arrPivot(searchRes).data); // [102,101]

	const reversed = ll.toReverse()
	console.log(I.arrPivot(reversed).data); // [102,101]
	//#endregion