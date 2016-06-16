Redux Action Enhancer
=============

Enhance your actions with values from the store. Inspired by connected components in [react-redux](https://github.com/reactjs/react-redux).

```js
npm install --save redux-action-enhancer
```

## Usage

```js
//store.js
import createActionEnhancerMiddleware from 'redux-action-enhancer';

export const ENHANCE_ME = Symbol('ENHANCE ME');
const enhancers = [
  {
    id: ENHANCE_ME,
    mapState: function(state){
      return {
        val1: state.section.val1, //maybe authentication info to be used in a request somewhere?
        val2: state.section.val2
      };
    }
  }
];

const store = createStore(reducer, undefined, applyMiddleware(createActionEnhancerMiddleware(enhancers)));


//actions.js
import {ENHANCE_ME} from './store.js'

export function enhancedAction(){
  return {
    type: 'ENHANCED_ACTION',
    [ENHANCE_ME]: true //enhances the action
  }
}

//other-section-reducer.js
function reducer(state = initialState, action){
  if(action.type = 'ENHANCED_ACTION'){
    console.log(action.val1); //the value from another part of the state tree
    console.log(action.val2);
  }
}

```

### Future

Determine if a mapDisaptch method is practical.