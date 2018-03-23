import * as React from 'react'

import { IPoint } from 'trajectory/Spline'

interface IProps {
	point: IPoint
	index: number
	onChange(x: number, y: number): void
	onRemove(): void
}

interface IState {
	x: string
	y: string
}

class SelectedPoint extends React.Component<IProps, IState> {

	public constructor(props: IProps) {
		super(props)

		this.state = {
			x: `${props.point.x}`,
			y: `${props.point.y}`
		}
	}

	public componentWillReceiveProps(nextProps: IProps) {
		this.setState({
			x: `${nextProps.point.x}`,
			y: `${nextProps.point.y}`
		})
	}

	public render(): JSX.Element {
		return (
			<form className='selected-point' onSubmit={this._onSubmit}>
				<span>Point {this.props.index + 1}</span>
				<div>
					<input type='text' value={this.state.x} onChange={this._onChangeX} placeholder='x' />
					<input type='text' value={this.state.y} onChange={this._onChangeY} placeholder='y' />
				</div>
				<div>
					<button type='submit'>Update</button>
					<button type='button' onClick={this.props.onRemove}>Remove</button>
				</div>
			</form>
		)
	}

	private _onChangeX = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ x: event.currentTarget.value })
	}

	private _onChangeY = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ y: event.currentTarget.value })
	}

	private _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const x: number = parseFloat(this.state.x)
		const y: number = parseFloat(this.state.y)

		if (isNaN(x) || isNaN(y)) return

		this.props.onChange(x, y)
	}

}

export default SelectedPoint
