import { isNull } from '../..';

if (!Array.prototype.pushAt) {
	Array.prototype.pushAt = function<T>(index: number, ...value: T[]) {
		this.splice(index, 0, ...value);
		return this.length;
	};
}
if (!Array.prototype.popAt) {
	Array.prototype.popAt = function(index: number) {
		return this.splice(index, 1);
	};
}
if (!Array.prototype.last) {
	Array.prototype.last = function<T>(value?: T) {
		if (!isNull(value)) this[this.length -1] = value;
		return this[this.length - 1];
	}
}