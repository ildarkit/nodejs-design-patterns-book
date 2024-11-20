import queryString from 'query-string';
import { useState, useEffect } from 'react';

export function handleItems({
  oldOffset,
  newOffset,
  query,
  handleOffset,
  handleData,
  limit
}) {
  const oldLimitPage = Math.floor(oldOffset / limit);
  const newLimitPage = Math.floor(newOffset / limit);

  if (oldLimitPage !== newLimitPage) {
    handleData(queryString.stringify({
      q: query,
      offset: limit * newLimitPage,
      limit,
    }));
  }

  handleOffset(newOffset % limit); 
}

export function useOffset(
  perPageItems,
  handleStoredState,
  resetOffset
) {
  const [ offset, setOffset ] = handleStoredState ?
    handleStoredState() : useState(0);

  useEffect(() => {
    if (resetOffset) {
      setOffset(0); 
    }
  }, [resetOffset]); 

  return [ offset, setOffset ];
}

export function useNewSearchedData(dataQuery, newQuery) {
  const [ update, setUpdate ] = useState(false);
  const [ query, setQuery ] = useState(newQuery);
  
  useEffect(() => {
    let updated;
    if (dataQuery || (newQuery === query))
      updated = false;
    else if (newQuery !== query)
      updated = true; 
    setUpdate(updated);
    setQuery(newQuery);
  }, [newQuery]); 
   
  return update;
}
