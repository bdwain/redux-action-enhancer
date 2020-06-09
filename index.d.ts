import { Action, Middleware } from 'redux';

export type Enhancement = object;

export type EnhancerId = string | symbol;

type ActionEnhancerById = {
  readonly id: EnhancerId;
};

type ActionEnhancerByType = {
  actionTypes: string[];
};  

type MapState<S, E, V> = {
  mapState: [V] extends never ? (state: S) => E : (state: S, value: V) => E;
};

export type ActionEnhancer<S, E extends Enhancement, V = never> =
  (ActionEnhancerById | ActionEnhancerByType) & MapState<S, E, V>;

export type UnenhancedAction<T> = Action<T> & {
  [index: string]: any;
};

export type EnhancedAction<
  A extends Action,
  E1 extends Enhancement,
  E2 extends Enhancement = E1,
  E3 extends Enhancement = E1,
  E4 extends Enhancement = E1,
  E5 extends Enhancement = E1,
  E6 extends Enhancement = E1,
  E7 extends Enhancement = E1,
  E8 extends Enhancement = E1,
  E9 extends Enhancement = E1
> = A & E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 & E9;

export type AnyEnhancer<S = unknown> = ActionEnhancer<S, Enhancement, unknown>;

declare function createActionEnhancerMiddleware<S = unknown>(
  getEnhancers: ((state: S) => AnyEnhancer<S>[]) | AnyEnhancer<S>[] 
): Middleware;

export default createActionEnhancerMiddleware;