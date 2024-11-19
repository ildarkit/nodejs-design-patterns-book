import { html } from 'htm/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export function SearchForm({ handleData }) {
  const {
    register,
    handleSubmit,
    watch
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return html`
    <div className="search">
      <form onSubmit=${handleSubmit(onSubmit)}>
        <input type="text" name="q" placeholder="Search query" ...${register("query")}/> 
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
