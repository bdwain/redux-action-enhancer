function createActionEnhancerMiddleware(mappings) {
  return ({getState, dispatch}) => next => action => {
    const enhancedFields = mappings.reduce((current, nextMapping) => {
      let result = current;
      if (action[nextMapping.id]) {
        result = Object.assign({}, result);

        if (nextMapping.mapState) {
          Object.assign(result, nextMapping.mapState(getState()));
        }
        if (nextMapping.mapDispatch) {
          Object.assign(result, nextMapping.mapDispatch(dispatch));
        }
      }

      return result;
    }, {});
    return next(Object.assign(enhancedFields, action));
  };
}

export default createActionEnhancerMiddleware;
