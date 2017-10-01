function createActionEnhancerMiddleware(getEnhancers) {
  return ({getState}) => next => action => {
    const state = getState();
    const enhancedFields = getEnhancers(state).reduce((current, nextMapping) => {
      if (nextMapping.id in action) {
        Object.assign(current, nextMapping.mapState(state, action[nextMapping.id]));
      }

      return current;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
