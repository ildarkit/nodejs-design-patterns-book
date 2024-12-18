import { useEffect, useState } from 'react';
import { html } from 'htm/react';

const DATA_LIMIT = 100;

export default function PaginateItems({
  offset,
  handleOffset,
  resetPage,
  handleItems,
  perPageItems,
  totalCount,
  handleSession
}) {
  const [ page, setPage ] = handleSession ? handleSession(1) : useState(1);
  const [ pageNumbers, setPageNumbers ] = useState([]);
  const [ pageCount, setPageCount ] = useState(Math.ceil(totalCount / perPageItems));
  const [ previousPerPageItems, setPreviousPerPageItems ] = useState(perPageItems);

  useEffect(() => {
    if (resetPage) {
      handleOffset(0);
      setPage(1);
    }
  }, [resetPage]);

  useEffect(() => {
    setPageCount(Math.ceil(totalCount / perPageItems));
    
    let newPage;
    if (perPageItems > previousPerPageItems) { 
      newPage = Math.ceil((offset + previousPerPageItems) / perPageItems);
    }
    else {
      newPage = Math.ceil(offset / perPageItems) + 1;
    }
    
    if (page !== newPage) paginate(newPage);

    setPreviousPerPageItems(perPageItems);
  }, [totalCount, perPageItems]); 

  useEffect(() => {
    generatePageNumbers(
      pageCount,
      page,
      setPageNumbers
    );
  }, [pageCount, page]);

  function paginate(currentPage, event) {
    event && event.preventDefault();
    const newOffset = ((currentPage - 1) * perPageItems) % totalCount;

    handleItems({ oldOffset: offset, newOffset, limit: DATA_LIMIT }); 

    setPage(currentPage);
    handleOffset(newOffset);
  };

  return pageCount > 1 && html`
    <div className="center">
      <div className="pagination"> 
        ${pageNumbers.map(num => (
         html`
          <${Control}
          page=${getPage(num, page, pageCount)}
          label=${getLabel(num, page, pageCount)}
          handleClick=${paginate}
          active=${(num > 0 && num < pageCount + 1) ? page === num : false}
          disabled=${isDisabled(num, page, pageCount)}
          />`
        ))} 
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

function getPage(num, page, pageCount) {
  return num === 0 ? page - 1 : num === pageCount + 1 ? page + 1 : num;
}

function getLabel(num, page, pageCount) {
  return num === 0 ? 
    "Previous" : num === pageCount + 1 ?
    "Next" : pageCount < 9 ? num : (page < 4 || page > pageCount - 3) && 
      num === Math.ceil(pageCount / 2) ?
    "..." : (page > 3 && page <= pageCount - 3) && 
      (num > 2 && num === Math.ceil(page / 2)) ||
      (num < pageCount - 1 && num === page + Math.ceil((pageCount - page) / 2)) ? 
    "..." : num;
}

function isDisabled(num, page, pageCount) {
  return (num === 0 && page === 1) ||
    (num === pageCount + 1 && page === pageCount);
}

function generatePageNumbers(count, page, handleNumbers) {
  if (count < 9)
    return handleNumbers(
      [...Array(count + 2).keys()]
    );

  const nums = Array.from({ length: 9 });

  const edgeGroup = (page < 4 || page > count - 3) ? 4 : 2;
  for (let i = 0; i < edgeGroup; i++) {
    nums[i] = i;
    nums[(nums.length - 1) - i] = count - i + 1;
  }

  if (edgeGroup === 4)
    nums[edgeGroup] = Math.ceil(count / 2);
  else { 
    nums[edgeGroup] = Math.ceil(page / 2);
    nums[edgeGroup + 4] = page + Math.ceil((count - page) / 2);
    for (let i = 0; i < 3; i++) {
      nums[i + 3] = page - 1 + i;
    }
  }

  handleNumbers(nums);
}
