declare module 'connected-react-router' {
  import * as React from 'react';
  import { Middleware, Reducer } from 'redux';
  import { match } from 'react-router';
  import {
    History,
    Path,
    Location,
    LocationState,
    LocationDescriptorObject
  } from 'history';

  interface ConnectedRouterProps {
    history: History;
  }

  export type RouterActionType = 'POP' | 'PUSH' | 'REPLACE';

  export interface Match {
      path: String;
      url: String;
      isExact: Boolean,
  }

  export type MatchedRoutes = {
      route: Object,
      match: Match
  }[]

  export interface RouterState {
      location: Location
      action: RouterActionType,
      matchedRoutes: MatchedRoutes,
      match: Match,
  }

  export const LOCATION_CHANGE: '@@router/LOCATION_CHANGE';
  export const CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD';

  export interface LocationChangeAction {
    type: typeof LOCATION_CHANGE;
    payload: RouterState;
  }

  export interface CallHistoryMethodAction {
    type: typeof CALL_HISTORY_METHOD;
    payload: LocationActionPayload;
  }

  export interface RouterRootState {
    router: RouterState;
  }

  export type matchSelectorFn<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  > = (state: S) => match<Params> | null;

  export type RouterAction = LocationChangeAction | CallHistoryMethodAction;

  export function push(path: Path, state?: LocationState): CallHistoryMethodAction;
  export function push(location: LocationDescriptorObject): CallHistoryMethodAction;
  export function replace(path: Path, state?: LocationState): CallHistoryMethodAction;
  export function replace(location: LocationDescriptorObject): CallHistoryMethodAction;
  export function go(n: number): CallHistoryMethodAction;
  export function goBack(): CallHistoryMethodAction;
  export function goForward(): CallHistoryMethodAction;
  export function getRouter<S extends RouterRootState>(state: S): RouterState;
  export function getAction<S extends RouterRootState>(state: S): RouterActionType;
  export function getHash<S extends RouterRootState>(state: S): string;
  export function getLocation<S extends RouterRootState>(state: S): Location;
  export function getLocationState<S extends RouterRootState>(state: S): any;
  export function getLocationStateParam<S extends RouterRootState>(state: S): any;
  export function getSearch<S extends RouterRootState>(state: S): string;
  export function createMatchSelector<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  >(path: string): matchSelectorFn<S, Params>;
  export function getMatch<S extends RouterRootState>(state: S): Match;
  export function getMatchParam<S extends RouterRootState>(state: S, slug: String | Number): String | Number;
  export function getMatchedRoutes<S extends RouterRootState>(state: S): MatchedRoutes;

  export type Push = typeof push;
  export type Replace = typeof replace;
  export type Go = typeof go;
  export type GoBack = typeof goBack;
  export type GoForward = typeof goForward;

  export const routerActions: {
    push: Push;
    replace: Replace;
    go: Go;
    goBack: GoBack;
    goForward: GoForward;
  };

  export interface LocationActionPayload {
    method: string;
    args?: any[];
  }

  export class ConnectedRouter extends React.Component<
    ConnectedRouterProps,
    {}
  > {}

  export function connectRouter(history: History)
    : Reducer<RouterState, LocationChangeAction>

  export function routerMiddleware(history: History): Middleware;
}
