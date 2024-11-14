import { asyncApiContent } from './api/apiRequestData.js';

const loadData = (props) => asyncApiContent(props);

export const routeMapServer = {
  index: '/',
  author: '/author/:authorId',
};

export const routeMapApi = {
  [routeMapServer.index]: `${routeMapServer.index}authors`,
};

export const routes = [
  {
    path: routeMapServer.index,
    exact: true,
    loadData,
  },
  {
    path: routeMapServer.author,
    loadData,
  }, 
];
