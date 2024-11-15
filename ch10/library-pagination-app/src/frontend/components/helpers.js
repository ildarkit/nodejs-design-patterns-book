import queryString from 'query-string';
import { useState, useEffect } from 'react';

export function handleItems({
  oldOffset,
  newOffset,
  handleOffset,
  handleData,
  limit
}) {
  const oldLimitPage = Math.floor(oldOffset / limit);
  const newLimitPage = Math.floor(newOffset / limit);

  if (oldLimitPage !== newLimitPage) {
    handleData(queryString.stringify({
      offset: limit * newLimitPage,
      limit,
    }));
  }

  handleOffset(newOffset % limit); 
}

export function useItems(items, pageItemCount, handleStoredState) {
  const [ currentItems, setCurrentItems ] = useState([]);
  const [ offset, setOffset ] = handleStoredState ?
    handleStoredState() : useState(0);

  useEffect(() => {
    setCurrentItems(items.slice(
      offset, offset + pageItemCount)
    );
  }, [offset]);

  return [ currentItems, setOffset ];
}
