function createActionEnhancerMiddleware(getEnhancers) {
  return ({getState}) => next => action => {
    const state = getState();
    const enhancedFields = getEnhancers(state).reduce((current, nextMapping) => {
      if (action[nextMapping.id] !== undefined) {
        Object.assign(current, nextMapping.mapState(state, action[nextMapping.id]));
      }

      return current;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
