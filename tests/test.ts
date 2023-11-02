import { Monad } from "./../src/index";

test('Monad test', () => {
	let m = new Monad(12)
	.Apply((v:number) => {return v*2}).SetConditions(true, (v:number) => {return v %2 == 0})
	.Apply((v:number) => {return v+2}).SetConditions()
	.Apply((v:number) => {return NaN})
	.Apply((v:number) => {return v-4})
	.Apply((v:number) => {return v.toString()})
	expect(m.value).toBe('20')
});