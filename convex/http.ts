import { auth } from './auth.js';
import { httpRouter } from 'convex/server';

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;
