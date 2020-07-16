export default function createActionEnhancerMiddleware(getEnhancers) {
  if(typeof getEnhancers !== 'function'){
    getEnhancers = () => getEnhancers;
  }

  return ({getState}) => next => action => {
    const state = getState();

    const enhancedFields = {};
    getEnhancers(state).forEach(enhancer => {
      if (enhancer.id && action[enhancer.id] !== undefined) {
        Object.assign(enhancedFields, enhancer.mapState(state, action[enhancer.id]));
      }
      //no need to check if actionType is defined since type is required anyway
      else if(enhancer.actionTypes && enhancer.actionTypes.indexOf(action.type) > -1) {
        Object.assign(enhancedFields, enhancer.mapState(state));
      }
    });

    return next(Object.assign(enhancedFields, action));
  };
}

export function isEnhancerById(e) {
  return Object.prototype.hasOwnProperty.call(e, 'id');
}
export function isEnhancerByType(e) {
  return Object.prototype.hasOwnProperty.call(e, 'actionTypes');
}