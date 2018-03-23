import { useStrict } from 'mobx'

// Only allow updates to observable data inside of actions
useStrict(true)

import * as React from 'react'
import { render } from 'react-dom'

import App from 'components/App'

render(<App />, document.querySelector('div#root'))
