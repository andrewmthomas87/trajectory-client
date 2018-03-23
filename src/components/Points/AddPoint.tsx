import * as React from 'react'
import { findDOMNode } from 'react-dom'

interface IProps {
	onAdd(x: number, y: number): void
}

class AddPoint extends React.Component<IProps, {}> {

	public render(): JSX.Element {
		return (
			<form className='add-point' onSubmit={this._onSubmit}>
				<span>Add point</span>
				<div>
					<input type='text' placeholder='x' ref='x' />
					<input type='text' placeholder='y' ref='y' />
				</div>
				<button type='submit'>Add</button>
			</form>
		)
	}

	private _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const xInput: HTMLInputElement = findDOMNode(this.refs['x']) as HTMLInputElement
		const yInput: HTMLInputElement = findDOMNode(this.refs['y']) as HTMLInputElement

		const x: number = parseFloat(xInput.value)
		const y: number = parseFloat(yInput.value)

		if (isNaN(x) || isNaN(y)) return

		this.props.onAdd(x, y)

		xInput.value = ''
		yInput.value = ''

		xInput.focus()
	}

}

export default AddPoint
