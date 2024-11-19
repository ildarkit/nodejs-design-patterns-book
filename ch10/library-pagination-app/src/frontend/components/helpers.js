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

export function useItems(items, perPageItems, handleStoredState, resetOffset) {
  const [ currentItems, setCurrentItems ] = useState([]);
  const [ offset, setOffset ] = handleStoredState ?
    handleStoredState() : useState(0);

  useEffect(() => {
    if (resetOffset) {
      setOffset(0);
      setCurrentItems(
        items.slice(0, perPageItems)
      );
    }
  }, [resetOffset]);

  useEffect(() => {
    setCurrentItems(items.slice(
      offset, offset + perPageItems)
    );
  }, [offset, perPageItems]);

  return [ currentItems, setOffset ];
}

export function useNewData(data) {
  const [ hash, setHash ] = useState(data.hash);
  const [ update, setUpdate ] = useState(true);
  
  useEffect(() => {
    const updated = data.hash !== hash;
    setUpdate(updated);
    if (updated)
      setHash(data.hash);
  }, [data.hash]);

  return update;
}
