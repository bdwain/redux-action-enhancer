import { Action } from 'redux';

export type Enhancement = object;

export type EnhancerId = string | symbol;

type ActionEnhancerById = {
  readonly id: EnhancerId;
};

type ActionEnhancerByType = {
  actionTypes: string[];
};

export type ActionEnhancer<S, E extends Enhancement, V = unknown> = (
  | ActionEnhancerById
  | ActionEnhancerByType) & {
  mapState: (state: S, value: V) => E;
};

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
