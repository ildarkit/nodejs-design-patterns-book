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

export function useNewSearch(dataQuery, newQuery) {
  const [ query, setQuery ] = useState(newQuery);
  
  useEffect(() => { 
    setQuery(newQuery);
  }, [newQuery]); 

  return (!dataQuery && query !== newQuery);
}
