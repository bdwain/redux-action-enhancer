import { Action, Middleware } from 'redux';

export type Enhancement = object;

export type EnhancerId = string | symbol;

type ActionEnhancerById = {
  readonly id: EnhancerId;
};

type ActionEnhancerByType = {
  actionTypes: string[];
};  

type MapState<Enhancement, State, Value> = {
  mapState: [Value] extends never ? (state: State) => 
    Enhancement :
    (state: State, value: Value) => Enhancement;
};

export type ActionEnhancer<E extends Enhancement, State, Value = never> =
  (ActionEnhancerById | ActionEnhancerByType) & MapState<E, State, Value>;

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

export type AnyEnhancer<State = unknown> = ActionEnhancer<Enhancement, State, unknown>;

declare function createActionEnhancerMiddleware<S = unknown>(
  getEnhancers: ((state: S) => AnyEnhancer<S>[]) | AnyEnhancer<S>[] 
): Middleware;

export default createActionEnhancerMiddleware;