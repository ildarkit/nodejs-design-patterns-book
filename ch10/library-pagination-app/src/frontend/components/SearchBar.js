import { html } from 'htm/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function SearchForm({ handleData }) {
  const {
    register,
    handleSubmit,
    watch
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return html`
    <form onSubmit=${handleSubmit(onSubmit)}>
      <input type="text" name="q" placeholder="Search query" ...${register("query")}/> 
    </form>
  `;
}

export function NavBar({ children, ...rest }) {
  return html`
    <div id="navlist">
      <div className="links">
        <${Link} to="/">My Library</>
      </div>
      <div className="search">
        ${children && html`<${children} ...${rest}/>`} 
      </div>
    </div>
  `;
}

export function SearchBar(props) {
  return html`
    <${NavBar} ...${props}>
      ${SearchForm}
    </>
  `;
}
