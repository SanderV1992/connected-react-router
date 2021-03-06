import { matchPath } from 'react-router'


const createSelectors = (structure) => {
  const { getIn, toJS } = structure

  const isRouter = (value) => value != null &&
    typeof value === 'object' &&
    getIn(value, ['location']) &&
    getIn(value, ['action'])

  const getRouter = state => {
    const router = toJS(getIn(state, ['router']))
    if (!isRouter(router)) { throw 'Could not find router reducer in state tree, it must be mounted under "router"' }
    return router
  }
  const getLocation = state => toJS(getIn(getRouter(state), ['location']))
  const getLocationState = state => toJS(getIn(getRouter(state), ['location', 'state']))
  const getLocationStateParam = (state, slug) => toJS(getIn(getRouter(state), ['location', 'state', slug]))
  const getAction = state => toJS(getIn(getRouter(state), ['action']))
  const getSearch = state => toJS(getIn(getRouter(state), ['location', 'search']))
  const getHash = state => toJS(getIn(getRouter(state), ['location', 'hash']))
  const getMatch = state => toJS(getIn(getRouter(state), ['match']))
  const getMatchParam = (state, slug) => toJS(getIn(getRouter(state), ['match', 'params', slug]))
  const getMatchedRoutes = state => toJS(getIn(getRouter(state), ['matchedRoutes']))

  // It only makes sense to recalculate the `matchPath` whenever the pathname
  // of the location changes. That's why `createMatchSelector` memoizes
  // the latest result based on the location's pathname.
  const createMatchSelector = path => {
    let lastPathname = null
    let lastMatch = null

    return state => {
      const { pathname } = getLocation(state) || {}
      if (pathname === lastPathname) {
        return lastMatch
      }
      lastPathname = pathname
      const match = matchPath(pathname, path)
      if (!match || !lastMatch || match.url !== lastMatch.url) {
        lastMatch = match
      }

      return lastMatch
    }
  }

  return {
    getLocation,
    getLocationState,
    getLocationStateParam,
    getAction,
    getRouter,
    getSearch,
    getHash,
    getMatch,
    getMatchParam,
    getMatchedRoutes,
    createMatchSelector,
  }
}

export default createSelectors
