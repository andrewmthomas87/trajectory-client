import * as React from 'react'

import State, { Size } from 'State'

import Points from './Points'
import VelocityProfile from './VelocityProfile'
import SplineView from './SplineView'

import 'less/app.less';

class App extends React.Component<{}, {}> {

	public render(): JSX.Element[] {
		const state: State = new State()
		state.setHeadings(0, 0)
		state.setSize(Size.FIT)

		return [
			<Points key={0} state={state} />,
			<VelocityProfile key={1} state={state} />,
			<SplineView key={2} state={state} />
		]
	}

}

export default App
