import { Action, Middleware } from 'redux';

export type Enhancement = object;

export type EnhancerId = string | symbol;

type ActionEnhancerByIdShape = {
  readonly id: EnhancerId;
};

type ActionEnhancerByTypeShape = {
  actionTypes: string[];
};  

type MapState<Enhancement, State, Value> = {
  mapState: [Value] extends [never] ?
    (state: State) => Enhancement :
    (state: State, value: Value) => Enhancement;
};

export type ActionEnhancerById<E extends Enhancement, State = unknown, Value = never> =
  ActionEnhancerByIdShape & MapState<E, State, Value>;

export type ActionEnhancerByType<E extends Enhancement, State = unknown, Value = never> =
  ActionEnhancerByTypeShape & MapState<E, State, Value>;

export type ActionEnhancer<E extends Enhancement, State = unknown, Value = never> =
  ActionEnhancerById<E, State, Value> | ActionEnhancerByType<E, State, Value>;

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

export type AnyEnhancer<State = unknown> =
  ActionEnhancer<Enhancement, State, any> |
  ActionEnhancer<Enhancement, State, never>;

declare function isEnhancerById<E extends Enhancement, State = unknown, Value = never>(e: ActionEnhancer<E, State, Value>): e is ActionEnhancerById<E, State, Value>;
declare function isEnhancerByType<E extends Enhancement, State = unknown, Value = never>(e: ActionEnhancer<E, State, Value>): e is ActionEnhancerByType<E, State, Value>;
export {isEnhancerById, isEnhancerByType};


declare function createActionEnhancerMiddleware<S = unknown>(
  getEnhancers: ((state: S) => AnyEnhancer<S>[]) | AnyEnhancer<S>[] 
): Middleware;

export default createActionEnhancerMiddleware;