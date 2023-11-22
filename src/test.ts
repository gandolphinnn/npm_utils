import * as Utils from "./index.js";

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
	.setDefault().log()
	.apply((v:number) => v+2) //12
	.apply((v:number) => NaN) //Nan but failed
	.apply((v:number) => v-4) //8
	.reRun() //4
	.apply((v:number) => v.toString()).log()

class Test1 extends Utils.Singleton {
	private constructor() {
		super();
	}
}
interface Singleton<T> {
	get instance(): T;
  }
  
  class Test implements Singleton<Test> {
	private static _instance: Test;
  
	private constructor() {}
  
	static get instance(): Test {
	  if (Utils.isNull(Test._instance)) {
		Test._instance = new Test();
	  }
	  return Test._instance;
	}
  }
const t2 = Test.instance;
const t1 = Test.instance;
const t3 = Test.instance;

if (t1 === t2 && t2 === t3) {
	console.log('Singleton works, both variables contain the same instance.');
} else {
	console.log('Singleton failed, variables contain different instances.');
}
