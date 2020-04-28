Redux Action Enhancers
=============

Dependency injection for redux actions. Enhance your actions with values from the store. Inspired by connected components in [react-redux](https://github.com/reactjs/react-redux).

```js
npm install --save redux-action-enhancer
or
yarn add redux-action-enhancer
```

## Usage

To start using redux action enhancers, add the middleware to your store.

```js
import createActionEnhancerMiddleware from 'redux-action-enhancer';
import {createStore, applyMiddleware} from 'redux';
import enhancers from './action-enhancers';


const store = createStore(reducer, undefined, applyMiddleware(createActionEnhancerMiddleware(enhancers)));
```

Next, create an enhancer

```js
//action-enhancers.js
export const ENHANCE_WITH_TIME = Symbol('ENHANCE WITH TIME');
const timeEnhancer = {
  id: ENHANCE_WITH_TIME,
  mapState: () => {
    return {
      now: new Date()
    };
  }
};

export default [timeEnhancer];
```

Now use your enhancer to enhance an action

```js
//actions.js
import {ENHANCE_WITH_TIME} from './action-enhancers'

export function enhancedAction(){
  return {
    type: 'ENHANCED_ACTION',
    [ENHANCE_WITH_TIME]: true //action.now will be the time the action was dispatched
  }
}
```

It's important to note that this action creator is still a pure function (as the middleware is the one actually executing the logic). Calling `enhancedAction()` directly will not return an object with `now` on it.

What if you want to enhance your action with a value from your redux state?

```js
//action-enhancers.js
import selectCurrentUser from './selectors';

export const ENHANCE_WITH_CURRENT_USER = Symbol('ENHANCE WITH CURRENT USER');
const userEnhancer = {
  id: ENHANCE_WITH_CURRENT_USER,
  mapState: state => {
    return {
      currentUser: selectCurrentUser(state)
    };
  }
};

const enhancers = [userEnhancer];
export default enhancers;

//actions.js
import {ENHANCE_WITH_CURRENT_USER} from './action-enhancers'

export function enhancedAction(){
  return {
    type: 'ENHANCED_ACTION',
    [ENHANCE_WITH_CURRENT_USER]: true //action.currentUser will be set before being passed to the reducer
  }
}
```

You can also pass parameters to action enhancers from the action that is being enhanced.

```js
//action-enhancers.js
import getToggleValue from './selectors';

export const ENHANCE_WITH_TOGGLE = Symbol('ENHANCE WITH TOGGLE');
const toggleEnhancer = {
  id: ENHANCE_WITH_TOGGLE,
  mapState: (state, toggle) => {
    return {
      toggleValue: getToggleValue(state, toggle)
    };
  }
};

//actions.js
import {ENHANCE_WITH_TOGGLE} from './action-enhancers'

export function enhancedAction(){
  return {
    type: 'ENHANCED_ACTION',
    [ENHANCE_WITH_TOGGLE]: 'FOO' //action.toggleValue will be the value of the FOO toggle
  }
}
```

You can also match all actions of certain types rather than actions with a given property
```js
//action-enhancers.js
const fooEnhancer = {
  actionTypes: ['FOO_LOADED', 'BAR_LOADED'],
  mapState: state => {
    return {
      items: getItems(state)
    };
  }
};

export default [fooEnhancer];
```

### Changing action enhnacers after store creation
If you want your list of action enhancers to be dynamic, you can pass a function to `createActionEnhancerMiddleware` instead of an array.

```js
let actionEnhancers = [...originalEnhancers];
const middleware = [createActionEnhancerMiddleware(() => actionEnhancers)];
const store = createStore(reducer, undefined, applyMiddleware(middleware));
store.addActionEnhancers = newEnhancers => actionEnhancers.push(...newEnhancers);

//in the dynamic loading code
store.addActionEnhancers(newModule.enhancers);
```

This may be useful if you are dynamically loading portions of your app that define their own action enhancers.

The function is also passed the redux state, so you can determine the available action enhancers based on the state of your application.

### TypeScript Support

Follow this pattern to use action enhancers in your TypeScript application.

1. Define "Enhancement" shape

The type `Enhancement` is an `object`, so make a type that is an object.
```
type CurrentTimeEnhancement = {
  now: Date;
};
```

Alternatively, make an interface that extends `Enhancement`.
```
interface CurrentUserEnhancement extends Enhancement {
  email: string;
}
```

2. Define action enhancer

```
// state for demo purposes
type TestState = {
  lastUpdated: Date | null;
  user: {
    email: string;
  };
  data: string | null;
};

// enhancer with id

const ENHANCE_WITH_CURRENT_TIME = Symbol('ENHANCE_WITH_CURRENT_TIME');

const currentTimeEnhancer: ActionEnhancer<TestState, CurrentTimeEnhancement> = {
  id: ENHANCE_WITH_CURRENT_TIME,
  mapState: () => ({
    now: new Date()
  })
};

// enhance action types

const currentUserEnhancer: ActionEnhancer<TestState, CurrentUserEnhancement> = {
  actionTypes: ['loginSuccess', 'refreshSuccess'],
  mapState: state => ({
    email: state.user.email
  })
};

// enhancer with value

const ENHANCE_WITH_CUSTOM_VALUE = Symbol('ENHANCE_WITH_CUSTOM_VALUE');

type CustomValueEnhancement = {
  value: string;
};

const customValueEnhancer: ActionEnhancer<TestState, CustomValueEnhancement, string> = {
  id: ENHANCE_WITH_CUSTOM_VALUE,
  mapState: (state, value) => ({
    value
  })
};
```

3. Define the "unenhanced" ("base", "internal", "core", whatever you'd like to call it) version of your action, which includes the fields defined by your specific action and then enhancer IDs

```
export enum actionTypes {
  COOL_STUFF = 'doCoolStuff',
  OTHER_STUFF = 'doOtherStuff'
}

type UnenhancedMyCoolAction = UnenhancedAction<actionTypes.COOL_STUFF> & {
  cool: string;
};
```

4. Create an action creator which returns the "core" action with enhancers added

```
const coolStuff = (value: string): UnenhancedMyCoolAction => ({
  type: actionTypes.COOL_STUFF,
  cool: value,
  [ENHANCE_WITH_CURRENT_TIME]: true
});
```

5. Define the enhanced version of the action

```
type MyCoolAction = EnhancedAction<
  Action<actionTypes.COOL_STUFF>,
  CurrentTimeEnhancement,
  CurrentUserEnhancement,
  CustomValueEnhancement
>;
```

Generally speaking, the unenhanced action should not need to be used by any code other than the action creator and unit tests; there are notable exceptions to this, such as if you need to reference the unenhanced action type in a function return. Any code that consumes the action from Redux, such as the reducer, should use the enhanced version of the action, which will have the fully realized fields available.

e.g.,

```
type ReducerActions = MyCoolAction | OtherCoolAction;

function reducer(state: TestState, action: ReducerActions): TestState {
  switch (action.type) {
    case actionTypes.COOL_STUFF:
      return Object.assign({}, state, {
        lastUpdated: action.email ? action.now : null,
        data: action.value
      });
    default:
      return state;
  }
}
```
