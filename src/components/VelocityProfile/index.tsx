import * as React from 'react'

import Network from 'Network'
import State from 'State'

import { SkidSteerRobot } from 'trajectory'

import './component.less'

interface IProps {
	state: State
}

class VelocityProfileComponent extends React.Component<IProps, {}> {

	public render(): JSX.Element {
		return (
			<section id='velocity-profile'>
				<button onClick={this._onClick}>Calculate velocity profile</button>
			</section>
		)
	}

	private _onClick = () => {
		const { $startHeading, $endHeading, $points } = this.props.state
		Network.getVelocityProfile(new SkidSteerRobot(8, 8, 8, Math.PI), $startHeading, $endHeading, $points, 1500).then((data) => {
			console.log(data)
			console.log(data.stringValue)
		})
	}

}

export default VelocityProfileComponent
