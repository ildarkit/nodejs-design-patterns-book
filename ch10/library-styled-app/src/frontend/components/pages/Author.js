import { html } from 'htm/react';
import { useParams } from 'react-router-dom';
import { FourOhFour } from './FourOhFour.js';
import { PageContainer } from '../PageContainer.js';
import { AuthorBio } from '../AuthorBio.js';
import { AuthorBooks } from '../AuthorBooks.js' 
import { preloadAsyncData } from './AsyncPage.js';
import { useData } from '../../../contextData.js';

export async function loadAuthor(props) {
  const authorId = props.id ? props.id : props.params.authorId;
  const path = `http://localhost:3001/api/author/${authorId}`;
  return await preloadAsyncData(path);
}

export function Author(props) {
  const { authorId } = useParams();
  const author = useData({ ...props, id: authorId }, loadAuthor);
   
  return !(author.data || author.err)  ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    author.err ? (
      html`<${PageContainer}>
        <${FourOhFour}
          staticContext=${props.staticContext}
          error="Author not found"
        />
      </>`
    ) : (
      html`<${PageContainer}>
        <div>
          <${AuthorBio} author=${author.data}/>
          <${AuthorBooks} author=${author.data}/>
        </div>
      </>`
    )
  );
}
