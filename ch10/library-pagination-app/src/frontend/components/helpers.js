import queryString from 'query-string';
import { useState, useEffect, useMemo } from 'react';

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

export function useItems(items, pageItemCount) {
  const [ currentItems, setCurrentItems ] = useState([]);
  const [ offset, setOffset ] = useState(0);
  const listID = useMemo(
    () => items.map(item => item.id).join(','),
    [items]
  );

  useEffect(() => {
    setCurrentItems(items.slice(
      offset, offset + pageItemCount)
    );
  }, [offset, listID]);

  return [ currentItems, setOffset ];
}
