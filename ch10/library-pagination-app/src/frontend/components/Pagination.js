import { useEffect, useState } from 'react';
import { html } from 'htm/react';
import ReactPaginate from 'react-paginate';
import queryString from 'query-string';

const DATA_LIMIT = 100;

export default function PaginateItems({
  handleUrl,
  handleItems,
  pageItemCount,
  totalCount
}) {
  const [ page, setPage ] = useState(0);
  const [ offset, setOffSet ] = useState((page * pageItemCount) % totalCount);
  const [ pageCount, setPageCount ] = useState();
  const [ limit, setLimit ] = useState(DATA_LIMIT);

  useEffect(() => {
    const endOffset = offset + pageItemCount;
    handleItems(offset, endOffset);
    setPageCount(Math.ceil(totalCount / pageItemCount));
  }, [offset, pageItemCount]); 

  function onPageChange(event) {
    setPage(event.selected);
    setOffSet((page * pageItemCount) % totalCount);
    if (offset + pageItemCount >= limit)
      handleUrl(queryString.stringify({
        offset: ((page + 1) * pageItemCount) % totalCount,
        limit, 
      }));
  };
  
  // TODO: component not rendering
  // return html`
  //   <${ReactPaginate}
  //     previousLabel="Previous"
  //     nextLabel="Next"
  //     breakLabel="..."
  //     pageCount=${pageCount}
  //     onPageChange=${onPageChange}
  //     renderOnZeroPageCount=${null}
  //   />`;
  return html`<p>fix pagination rendering</p>`;
}
