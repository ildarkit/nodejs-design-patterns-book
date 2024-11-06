import { useState, useEffect } from 'react';

function fromStaticContext({ url, staticContext }) {
  const ctx = typeof window !== 'undefined'
    ? window.__STATIC_CONTEXT__
    : staticContext;
  const staticData = ctx && ctx[url] 
      ? ctx[url] : null;
  const data = staticData && staticData.data ? staticData.data : null;
  const err = staticData && staticData.err ? staticData.err: null;

  typeof window !== 'undefined' && ctx &&
    delete ctx[url];

  return { data, err };
}

export function useData(props, loader) {
  const [state, setState] = useState(fromStaticContext(props));

  useEffect(() => {
    if ((state.data && state.data.id !== props.id) || !state.data)
      loader(props)
        .then(data => {
          setState({ data });
        })
        .catch((err) => setState({ data: null, err}));
  }, [props.id]);

  return state;
}
