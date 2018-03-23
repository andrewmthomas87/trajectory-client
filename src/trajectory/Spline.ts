import Polynomial from './Polynomial'
import QuinticHermite from './QuinticHermite'

interface IPoint {
	x: number
	y: number
}

class Spline {

	private _points: IPoint[]

	private _xPolynomials: Polynomial[]
	private _yPolynomials: Polynomial[]

	private _xFirstDerivative: Polynomial[]
	private _yFirstDerivative: Polynomial[]

	private _xSecondDerivative: Polynomial[]
	private _ySecondDerivative: Polynomial[]

	public constructor(points: IPoint[], xPolynomials: Polynomial[], yPolynomials: Polynomial[]) {
		if (xPolynomials.length !== yPolynomials.length) throw 'xPolynomials and yPolynomials must be the same length'

		this._points = points
		this._xPolynomials = xPolynomials
		this._yPolynomials = yPolynomials

		this._xFirstDerivative = []
		this._yFirstDerivative = []
		this._xSecondDerivative = []
		this._ySecondDerivative = []
		for (let i = 0; i < xPolynomials.length; i++) {
			this._xFirstDerivative[i] = Polynomial.differentiate(this._xPolynomials[i])
			this._yFirstDerivative[i] = Polynomial.differentiate(this._yPolynomials[i])
			this._xSecondDerivative[i] = Polynomial.differentiate(this._xFirstDerivative[i])
			this._ySecondDerivative[i] = Polynomial.differentiate(this._yFirstDerivative[i])
		}
	}

	public evaluate(t: number): IPoint {
		if (t === this._xPolynomials.length) {
			return {
				x: this._xPolynomials[this._xPolynomials.length - 1].evaluate(1),
				y: this._yPolynomials[this._yPolynomials.length - 1].evaluate(1)
			}
		}

		const index: number = Math.floor(t)
		return {
			x: this._xPolynomials[index].evaluate(t - index),
			y: this._yPolynomials[index].evaluate(t - index)
		}
	}

	public evaluateFirstDerivative(t: number): IPoint {
		if (t === this._xFirstDerivative.length) {
			return {
				x: this._xFirstDerivative[this._xFirstDerivative.length - 1].evaluate(1),
				y: this._yFirstDerivative[this._yFirstDerivative.length - 1].evaluate(1)
			}
		}

		const index: number = Math.floor(t)
		return {
			x: this._xFirstDerivative[index].evaluate(t - index),
			y: this._yFirstDerivative[index].evaluate(t - index)
		}
	}

	public evaluateSecondDerivative(t: number): IPoint {
		if (t === this._xSecondDerivative.length) {
			return {
				x: this._xSecondDerivative[this._xSecondDerivative.length - 1].evaluate(1),
				y: this._ySecondDerivative[this._ySecondDerivative.length - 1].evaluate(1)
			}
		}

		const index: number = Math.floor(t)
		return {
			x: this._xSecondDerivative[index].evaluate(t - index),
			y: this._ySecondDerivative[index].evaluate(t - index)
		}
	}

	public evaluateCurvature(t: number): number {
		const firstDerivative: IPoint = this.evaluateFirstDerivative(t)
		const secondDerivative: IPoint = this.evaluateSecondDerivative(t)

		return (firstDerivative.x * secondDerivative.y - firstDerivative.y * secondDerivative.x)  // (x'y'- y'x'')
			/ Math.pow(Math.pow(firstDerivative.x, 2) + Math.pow(firstDerivative.y, 2), 1.5)                // / (x'^2 + y'^2)^1.5
	}

	public getPoints(): IPoint[] {
		return this._points
	}

	public getDomainMax(): number {
		return this._xPolynomials.length
	}

	public toString(): string {
		return `(${Spline.polynomialListToString(this._xPolynomials)}, ${Spline.polynomialListToString(this._yPolynomials)})`
	}

	public firstDerivativeToString(): string {
		return `(${Spline.polynomialListToString(this._xFirstDerivative)}, ${Spline.polynomialListToString(this._yFirstDerivative)})`
	}

	public secondDerivativeToString(): string {
		return `(${Spline.polynomialListToString(this._xSecondDerivative)}, ${Spline.polynomialListToString(this._ySecondDerivative)})`
	}

	private static polynomialListToString(polynomials: Polynomial[]): string {
		let equation: string = '\\left\\{'
		for (let i = 0; i < polynomials.length; i++) {
			equation += `${i}<=t<${i + 1}:${polynomials[i].toString(`(t-${i})`)},`
		}

		return `${equation.substring(0, equation.length - 1)}\\right\\}`
	}

	public static quinticHermiteSplineFor(startHeadingDegrees: number, endHeadingDegrees: number, ...points: IPoint[]): Spline {
		const startHeadingRadians: number = startHeadingDegrees * Math.PI / 180
		const endHeadingRadians: number = endHeadingDegrees * Math.PI / 180

		const xValues: number[] = points.map(point => point.x)
		const yValues: number[] = points.map(point => point.y)

		const startDistance: number = Math.sqrt(Math.pow(xValues[1] - xValues[0], 2) + Math.pow(yValues[1] - yValues[0], 2))
		const endDistance: number = Math.sqrt(Math.pow(xValues[xValues.length - 1] - xValues[xValues.length - 2], 2) + Math.pow(yValues[yValues.length - 1] - yValues[yValues.length - 2], 2))

		const xPolynomials: Polynomial[] = QuinticHermite.splineFor(0.5 * Math.cos(startHeadingRadians) * startDistance, 0.5 * Math.cos(endHeadingRadians) * endDistance, ...xValues)
		const yPolynomials: Polynomial[] = QuinticHermite.splineFor(0.5 * Math.sin(startHeadingRadians) * startDistance, 0.5 * Math.sin(endHeadingRadians) * endDistance, ...yValues)

		return new Spline(points, xPolynomials, yPolynomials)
	}

}

export { IPoint, Spline as default }
