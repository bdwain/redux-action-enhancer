function createActionEnhancerMiddleware(mappings) {
  return store => next => action => {
    const enhancedFields = mappings.reduce((current, nextMapping) => {
      if (nextMapping.id in action) {
        return Object.assign(current, nextMapping.mapState(store.getState()));
      }
      return current;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
