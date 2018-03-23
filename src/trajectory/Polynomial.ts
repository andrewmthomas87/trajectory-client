
class Polynomial {

	private _coefficients: number[]

	public constructor(...coefficients: number[]) {
		this._coefficients = coefficients
	}

	public evaluate(parameter: number): number {
		let result: number = 0
		for (let i = 0; i < this._coefficients.length; i++) {
			result += Math.pow(parameter, i) * this._coefficients[i]
		}

		return result
	}

	public getCoefficients(): number[] {
		return this._coefficients
	}

	public toString(parameter: string = 'x'): string {
		if (this._coefficients.length === 0) {
			return '0'
		}

		let polynomialString: string = ''
		for (let i = 0; i < this._coefficients.length; i++) {
			if (Math.abs(this._coefficients[i]) > 0.00000000000001) {
				polynomialString += this._getStringFor(parameter, this._coefficients[i], i) + ' + '
			}
		}

		return polynomialString.length === 0 ? '0' : polynomialString.substring(0, polynomialString.length - 3)
	}

	private _getStringFor(parameter: string, coefficient: number, exponent: number) {
		switch (exponent) {
			case 0:
				return `${coefficient}`
			case 1:
				return `${coefficient}${parameter}`
			default:
				return `${coefficient}${parameter}^${exponent}`
		}
	}

	public static differentiate(polynomial: Polynomial): Polynomial {
		const coefficients: number[] = polynomial.getCoefficients()
		if (coefficients.length === 0) {
			return new Polynomial()
		}

		const derivativeCoefficients: number[] = []
		for (let i = 1; i < coefficients.length; i++) {
			derivativeCoefficients[i - 1] = coefficients[i] * i
		}

		return new Polynomial(...derivativeCoefficients)
	}

	public static integrate(polynomial: Polynomial, constant: number): Polynomial {
		const coefficients: number[] = polynomial.getCoefficients()
		const integralCoefficients: number[] = []

		integralCoefficients[0] = constant
		for (let i = 0; i < coefficients.length; i++) {
			integralCoefficients[i + 1] = coefficients[i] / (i + 1)
		}

		return new Polynomial(...integralCoefficients)
	}

	public static sum(...polynomials: Polynomial[]): Polynomial {
		const newCoefficients: number[] = []
		for (let polynomial of polynomials) {
			const coefficients: number[] = polynomial.getCoefficients()
			for (let i = 0; i < coefficients.length; i++) {
				if (newCoefficients[i] === undefined) {
					newCoefficients[i] = coefficients[i]
				}
				else {
					newCoefficients[i] += coefficients[i]
				}
			}
		}

		return new Polynomial(...newCoefficients)
	}

	public static multiply(polynomial: Polynomial, multiplier: number): Polynomial {
		return new Polynomial(...polynomial.getCoefficients().map(coefficient => coefficient * multiplier))
	}

}

export default Polynomial
