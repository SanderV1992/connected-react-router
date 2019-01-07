import 'raf/polyfill'
import React from 'react'
import { renderRoutes } from 'react-router-config'
import configureStore from 'redux-mock-store'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import createConnectedRouter from '../src/ConnectedRouter'
import { onLocationChanged } from '../src/actions'
import plainStructure from '../src/structure/plain'


Enzyme.configure({ adapter: new Adapter() })

const { mount } = Enzyme


describe('ConnectedRouter (react-router-config)', () => {
  let routes
  let props
  let store
  let history
  let onLocationChangedSpy

  // Templates
  const Root = ({ route }) => renderRoutes(route.routes)

  beforeEach(() => {
    // Rewire `onLocationChanged` of `createConnectedRouter` to contain a spy function
    onLocationChangedSpy = jest.fn((location, action, matchedRoutes, match) => {
      return onLocationChanged(location, action, matchedRoutes, match)
    })
    createConnectedRouter.__Rewire__('onLocationChanged', onLocationChangedSpy)

    // Routes
    routes = [
      {
        path: '/',
        exact: true,
        component: Root,
        routes: [
          {
            path: '/test',
            exact: true,
          },
          {
            path: '/page/:pageId/test/:testId',
            exact: true,
          }
        ]
      }
    ]

    // Reset history
    history = createBrowserHistory({ hashType: 'slash' })

    // Mock props
    props = {
      action: 'POP',
      location: {
        pathname: '/path/to/somewhere',
      },
      history,
    }

    // Mock store
    const mockStore = configureStore({ history, routes })
    store = mockStore({
      router: {
        action: 'POP',
        location: props.history.location,
      }
    })
  })

  afterEach(() => {
    // Restore to remove a spy function
    createConnectedRouter.__ResetDependency__('onLocationChanged')
  })

  describe('with plain structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(plainStructure)
    })

    it('calls `props.onLocationChanged()` when location changes (routes).', () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/page/22/test/33')
      history.push('/test')
      history.push('/page/22/test/34')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(4)
    })
  })
})
