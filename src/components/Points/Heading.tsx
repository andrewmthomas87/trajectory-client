import { observer } from 'mobx-react'
import * as React from 'react'

import State from 'State'

interface IProps {
	state: State
}

interface IState {
	startHeading: string
	endHeading: string
}

@observer
class Heading extends React.Component<IProps, IState> {

	public constructor(props: IProps) {
		super(props)

		this.state = {
			startHeading: `${props.state.$startHeading}`,
			endHeading: `${props.state.$endHeading}`
		}
	}

	public render(): JSX.Element {
		return (
			<form className='heading' onSubmit={this._onSubmit}>
				<div>
					<input type='text' value={this.state.startHeading} onChange={this._onChangeStartHeading} placeholder='Start heading' />
					<input type='text' value={this.state.endHeading} onChange={this._onChangeEndHeading} placeholder='End heading' />
				</div>
				<button type='submit'>Update</button>
			</form>
		)
	}

	private _onChangeStartHeading = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ startHeading: event.currentTarget.value })
	}

	private _onChangeEndHeading = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ endHeading: event.currentTarget.value })
	}

	private _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const startHeading: number = parseFloat(this.state.startHeading)
		const endHeading: number = parseFloat(this.state.endHeading)

		if (isNaN(startHeading) || isNaN(endHeading)) return

		this.props.state.setHeadings(startHeading, endHeading)
	}

}

export default Heading
