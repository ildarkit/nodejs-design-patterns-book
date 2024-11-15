import { useState } from 'react';
import { html } from 'htm/react';

const items = [
  {value: 1, label: "1 item"},
  {value: 5, label: "5 items"},
  {value: 10, label: "10 items"},
  {value: 50, label: "50 items"},
  {value: 100, label: "100 items"},
];

export function PerPageDropMenu({ children, ...rest }) {
  const [ perPageItems, setPerPageItems ] = useState(5);

  return html`
    <${children} ...${rest} perPageItems=${perPageItems}>
      <${PerPageItems} 
        perPageItems=${perPageItems}
        handleValue=${setPerPageItems}
      />
    </>
  `;
}

function PerPageItems(props) {
  return html`
    <${DropDownMenu}
      items=${items}
      ...${props}
    />
  `;
}

function DropDownMenu({ items, handleValue, perPageItems }) {
  return html`
    <div className="row">
      <div className="col">
        <label htmlFor="dropdown-items">Items count:</label>
        <select 
          name="dropdown"
          id="dropdown-items"
          defaultValue=${perPageItems}
          onChange=${(e) => handleValue(Number(e.target.value))}
        >
          ${items.map(item => html`
            <option 
              key=${item.value}
              value=${item.value}
            >
              ${item.label}
            </option>`
          )}
        </select>
      </div>
    </div>
  `;
}
