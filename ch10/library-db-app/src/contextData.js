import { useState, useEffect } from 'react';

function fromStaticContext(props) {
  const location = props.match.url;
  const ctx = typeof window !== 'undefined'
    ? window.__STATIC_CONTEXT__
    : props.staticContext;
  const staticData = ctx && ctx[location] 
      ? ctx[location] : null;
  const data = staticData && staticData.data ? staticData.data : null;
  const err = staticData && staticData.err ? staticData.err: null;

  typeof window !== 'undefined' && ctx &&
    delete ctx[location];

  return { data, err };
}

export function useData(props, loader) {
  const [state, setState] = useState(fromStaticContext(props));

  useEffect(() => {
    if ((state.data && state.data.id !== props.id) || !state.data)
      loader({ id: props.id })
        .then(data => {
          setState({ data });
        })
        .catch((err) => setState({ data: null, err}));
  }, [props.id]);

  return state;
}
