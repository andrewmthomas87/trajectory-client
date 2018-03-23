import Polynomial from './Polynomial'

class QuinticHermite {

	private static _H50: Polynomial = new Polynomial(1, 0, 0, -10, 15, -6)
	private static _H51: Polynomial = new Polynomial(0, 1, 0, -6, 8, -3)
	private static _H52: Polynomial = new Polynomial(0, 0, 0.5, -1.5, 1.5, -0.5)
	private static _H53: Polynomial = new Polynomial(0, 0, 0, 0.5, -1, 0.5)
	private static _H54: Polynomial = new Polynomial(0, 0, 0, -4, 7, -3)
	private static _H55: Polynomial = new Polynomial(0, 0, 0, 10, -15, 6)

	public static from(p0: number, p1: number, v0: number, v1: number, a0: number, a1: number) {
		return Polynomial.sum(
			Polynomial.multiply(QuinticHermite._H50, p0),
			Polynomial.multiply(QuinticHermite._H51, v0),
			Polynomial.multiply(QuinticHermite._H52, a0),
			Polynomial.multiply(QuinticHermite._H53, a1),
			Polynomial.multiply(QuinticHermite._H54, v1),
			Polynomial.multiply(QuinticHermite._H55, p1))
	}

	public static splineFor(vi: number, vf: number, ...values: number[]): Polynomial[] {
		const vValues: number[] = []
		vValues[0] = vi
		vValues[values.length - 1] = vf
		for (let i = 1; i < values.length - 1; i++) {
			vValues[i] = 0.5 * (values[i + 1] - values[i - 1])
		}

		const aValues: number[] = []
		aValues[0] = 0
		aValues[values.length - 1] = 0
		for (let i = 1; i < values.length - 1; i++) {
			aValues[i] = 0.5 * (vValues[i + 1] - vValues[i - 1])
		}

		const spline: Polynomial[] = []
		for (let i = 0; i < values.length - 1; i++) {
			spline[i] = QuinticHermite.from(values[i], values[i + 1], vValues[i], vValues[i + 1], aValues[i], aValues[i + 1])
		}

		return spline
	}

	public static toString(offset: number, ...polynomials: Polynomial[]): string {
		let equation: string = ''
		for (let i = 0; i < polynomials.length; i++) {
			equation += `${i + offset}<=x<${i + 1 + offset}:${polynomials[i].toString(`(x-${i + offset})`)},`
		}

		return equation.substring(0, equation.length - 1)
	}

}

export default QuinticHermite
