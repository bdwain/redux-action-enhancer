function createActionEnhancerMiddleware(mappings) {
  return ({getState}) => next => action => {
    const enhancedFields = mappings.reduce((current, nextMapping) => {
      let result = current;
      if (action[nextMapping.id]) {
        result = Object.assign({}, result);

        if (nextMapping.mapState) {
          Object.assign(result, nextMapping.mapState(getState()));
        }
      }

      return result;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
