import * as lib from '../lib/index';

describe('Objects', () => {
	it('Pivot object', () => {
		const obj = {
			a: [1, 2, 3],
		}
		const doublePivot = lib.arrPivot(lib.objPivot(obj));
		expect(doublePivot).toEqual(obj);
	});

	it('Edit array', () => {
		const arr = [
			{ a: 1, b: 2 },
			{ a: 3, b: 4 },
		];
		const editedArr = lib.arrEdit(arr, 'a', (v) => v * 2);
		expect(editedArr).toEqual([
			{ a: 2, b: 2 },
			{ a: 6, b: 4 },
		]);
	});
});