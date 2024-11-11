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
  const [ pageNumbers, setPageNumbers ] = useState([]);
  const [ offset, setOffSet ] = useState((page * pageItemCount) % totalCount);
  const [ pageCount, setPageCount ] = useState();
  const [ limit, setLimit ] = useState(DATA_LIMIT);

  useEffect(() => {
    const newPageCount = Math.ceil(totalCount / pageItemCount);
    generateNewPageNumbers(newPageCount);

    handleItems(offset, offset + pageItemCount);

    setPageCount(newPageCount); 
  }, [offset, pageItemCount]); 

  function generateNewPageNumbers(count) {
    if (newPageCount <= 10) {
      setPageNumbers(
        [...Array(newPageCount).keys()]
          .map(i => i + 1)
      );
      return;
    } 
  }

  function paginate(pageNumber, event) {
    event.preventDefault();
    const newOffset = (pageNumber * pageItemCount) % totalCount;
    setPage(pageNumber);
    setOffSet(newOffset);
    handleItems(newOffset, newOffset + pageItemCount); 
  };
  
  return pageCount > 1 && html`
      <div className="center">
        <div className="pagination">
          <${Control}
            page=${page - 1}
            label="Previous"
            handleClick=${paginate}
            disabled=${page === 0}
          /> 
          ${pageNumbers.map(i => (
           html`
            <${Control}
            page=${i - 1}
            label=${i}
            handleClick=${paginate}
            active=${page === i - 1}
            />`
          ))}
          <${Control}
            page=${page + 1}
            label="Next"
            handleClick=${paginate}
            disabled=${page === pageCount - 1}
          /> 
        </div>
      </div>`;
}

function Control({ page, label, handleClick, disabled = false, active = false }) {
  return html`
    <a
      key=${label}
      onClick=${(e) => handleClick(page, e)}
      href="#"
      role="button"
      className=${disabled ? "disabled" : active ? "active" : ""}
    >
      ${label}
    </a>
  `;
}
