function createActionEnhancerMiddleware(mappings) {
  return ({getState}) => next => action => {
    const enhancedFields = mappings.reduce((current, nextMapping) => {
      if (nextMapping.id in action) {
        Object.assign(current, nextMapping.mapState(getState(), action[nextMapping.id]));
      }

      return current;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
