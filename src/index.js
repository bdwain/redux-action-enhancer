export default function createActionEnhancerMiddleware(getEnhancers) {
  return ({getState}) => next => action => {
    const state = getState();

    const enhancedFields = {};
    getEnhancers(state).forEach(enhancer => {
      if (enhancer.id && action[enhancer.id] !== undefined) {
        Object.assign(enhancedFields, enhancer.mapState(state, action[enhancer.id]));
      }
      //no need to check if actionType is defined since type is required anyway
      else if(action.type === enhancer.actionType) {
        Object.assign(enhancedFields, enhancer.mapState(state));
      }
    });

    return next(Object.assign(enhancedFields, action));
  };
}