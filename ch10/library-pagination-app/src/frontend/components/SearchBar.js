import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { useSessionStorage } from '../session.js';

export function SearchForm({ handleData }) {
  const [ query, setQuery ] = useSessionStorage('queryAuthors', '');

  function onSubmit(event) {
    event.preventDefault();
    handleData(queryString.stringify({
      q: event.target.q.value
    }));
  }

  function onChange(event) {
    setQuery(event.target.value);
  }

  return html`
    <div className="search">
      <form onSubmit=${onSubmit}>
        <input 
          type="text"
          name="q"
          onChange=${onChange}
          placeholder="Search author"
          value=${query}
        /> 
      </form>
    </div>
  `;
}

export function NavBar({ children, ...rest }) {
  return html`
    <div id="navlist">
      <div className="links">
        <${Link} to="/">My Library</>
      </div>
      ${children && (children.map ?
        children.map(child => html`<${child} key=${child.Name} ...${rest}/>`) :
        html`<${children} ...${rest}/>`)} 
    </div>
  `;
}
