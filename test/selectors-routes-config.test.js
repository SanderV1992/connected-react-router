import React from 'react'
import { createStore, combineReducers } from 'redux'
import { createBrowserHistory } from 'history'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { connectRouter, getMatchedRoutes, getMatch, getMatchParams, ConnectedRouter } from '../src'


Enzyme.configure({ adapter: new Adapter() })

const { mount } = Enzyme

describe("selectors (react-router-config)", () => {
  let store
  let history
  let routes

  // Templates
  const Root = ({ route }) => renderRoutes(route.routes)
  const Home = () => <h1>Home</h1>

  beforeEach(() => {
    // Reset history
    history = createBrowserHistory({ hashType: 'slash' })

    // Routes
    routes = [
      {
        component: Root,
        routes: [
          {
            path: "/",
            exact: true,
            component: Home
          },
          {
            path: "/sandwiches",
            component: Home
          },
          {
            path: "/page/:pageId/test/:testId",
            component: Home
          },
          {
            path: "/tacos",
            component: Root,
            routes: [
              {
                path: "/tacos",
                exact: true,
                component: Home
              },
              {
                path: "/tacos/bus",
                exact: true,
                component: Home
              },
              {
                path: "/tacos/cart",
                exact: true,
                component: Home
              }
            ]
          }
        ]
      }
    ]

    const reducer = combineReducers({
      router: connectRouter(history),
    })
    store = createStore(reducer)
  })

  describe("getMatch", () => {
    it("gets the current match from state", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/page/22/test/34')

      const californiaMatch = getMatch(store.getState())
      expect(californiaMatch).toEqual({
        "isExact": true,
        "params": { "pageId": "22", "testId": "34" },
        "path": "/page/:pageId/test/:testId",
        "url": "/page/22/test/34"
      })
    })

    it("gets the current match from state (2)", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/not/found/page')

      const californiaMatch = getMatch(store.getState())
      expect(californiaMatch).toEqual(undefined)
    })
  })

  describe("getMatchParams", () => {
    it("gets the current match params from state", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/page/22/test/34')

      const californiaMatch = getMatchParams(store.getState(), 'pageId')
      expect(californiaMatch).toEqual("22")
    })

    it("gets the current match params from state (2)", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/page/22/test/34')

      const californiaMatch = getMatchParams(store.getState(), 'testId')
      expect(californiaMatch).toEqual("34")
    })

    it("gets the current match from state (3)", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/not/found/page')

      const californiaMatch = getMatchParams(store.getState(), 'notFound')
      expect(californiaMatch).toEqual(undefined)
    })

    it("gets the current match from state (4)", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/not/found/page')

      const californiaMatch = getMatchParams(store.getState())
      expect(californiaMatch).toEqual(undefined)
    })
  })

  describe("getMatchedRoutes", () => {
    it("gets the matched routes from state", () => {
      mount(
        <Provider store={store}>
          <ConnectedRouter history={history} routes={routes}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      )

      history.push('/page/22/test/34')

      const californiaMatch = getMatchedRoutes(store.getState())
      expect(californiaMatch).toEqual([
        {
          "match": { "isExact": false, "params": {}, "path": "/", "url": "/" },
          "route": {
            "component": Root,
            "routes": [
              { "component": Home, "exact": true, "path": "/" },
              { "component": Home, "path": "/sandwiches" },
              { "component": Home, "path": "/page/:pageId/test/:testId" },
              {
                "component": Root, "path": "/tacos",
                "routes": [
                  { "component": Home, "exact": true, "path": "/tacos" },
                  { "component": Home, "exact": true, "path": "/tacos/bus" },
                  { "component": Home, "exact": true, "path": "/tacos/cart" }
                ]
              }]
          }
        },
        {
          "match": {
            "isExact": true,
            "params": { "pageId": "22", "testId": "34" },
            "path": "/page/:pageId/test/:testId",
            "url": "/page/22/test/34"
          },
          "route": {
            "component": Home,
            "path": "/page/:pageId/test/:testId",
          }
        }
      ])
    })
  })
})
