Redux Action Enhancer
=============

Dependency injection for redux actions. Enhance your actions with values from the store. Inspired by connected components in [react-redux](https://github.com/reactjs/react-redux).

```js
npm install --save redux-action-enhancer
```

## Usage

```js
//store.js
import createActionEnhancerMiddleware from 'redux-action-enhancer';
import someSelector from 'selectors';

export const ENHANCE_ME = Symbol('ENHANCE ME');
const enhancers = [
  {
    id: ENHANCE_ME,
    mapState: function(state, param){
      return {
        val1: state.section.val1, //maybe authentication info to be used in a request somewhere?
        val2: state.section.val2,
        paramVal: someSelector(state, param)
      };
    }
  }
];

function getEnhancers(reduxState){
  //redux state is passed if you want to return a set of mappings based on it
  return enhancers;
}

const store = createStore(reducer, undefined, applyMiddleware(createActionEnhancerMiddleware(enhancers)));


//actions.js
import {ENHANCE_ME} from './store.js'

export function enhancedAction(){
  return {
    type: 'ENHANCED_ACTION',
    [ENHANCE_ME]: 123 //enhances the action. 123 is passed to mapState
  }
}

//other-section-reducer.js
function reducer(state = initialState, action){
  if(action.type = 'ENHANCED_ACTION'){
    console.log(action.val1); //the value from another part of the state tree
    console.log(action.val2);
    console.log(action.paramVal);
  }
}

```

### Why is getEnhancers a function instead of an array
For 2 reasons:
1. If you dynamically load a portion of your app that contains new enhancers, you can't pass those enhancers in on an array when the store is created. By passing a function, it can reference data that is updated at runtime.
2. It allows you to choose enhancers based on the redux state if desired.
