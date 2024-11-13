import { asyncApiContent } from './apiRequestData.js';
import { routeMapServer } from '../server/routes.js';

const loadData = (props) => asyncApiContent(props);

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
