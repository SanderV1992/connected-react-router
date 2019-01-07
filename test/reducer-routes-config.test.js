import { combineReducers } from 'redux'
import { LOCATION_CHANGE, connectRouter } from '../src'


describe('connectRouter (react-router-config)', () => {
  let mockHistory

  beforeEach(() => {
    mockHistory = {
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      action: 'POP',
    }
  })

  describe('with plain structure', () => {
    it('creates new root reducer with router reducer inside', () => {
      const mockReducer = (state = {}, action) => {
        switch (action.type) {
          default:
            return state
        }
      }
      const rootReducer = combineReducers({
        mock: mockReducer,
        router: connectRouter(mockHistory)
      })

      const currentState = {
        mock: {},
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
          matchedRoutes: [{ routes: [] }],
          match: { path: '/test', url: '/test' },
        }
      }
      const nextState = rootReducer(currentState, action)
      const expectedState = {
        mock: {},
        router: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
          matchedRoutes: [{ routes: [] }],
          match: { path: '/test', url: '/test' },
        },
      }
      expect(nextState).toEqual(expectedState)
    })

    it('does not change state ref when action does not trigger any reducers', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })

      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: "DUMMY_ACTION",
        payload: "dummy payload"
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })

    it('does not change state ref when receiving LOCATION_CHANGE for the first rendering', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })
      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
          matchedRoutes: [{ routes: [] }],
          match: { path: '/test', url: '/test' },
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
          matchedRoutes: [{ routes: [] }],
          match: { path: '/test', url: '/test' },
          isFirstRendering: true,
        }
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })
  })
})
