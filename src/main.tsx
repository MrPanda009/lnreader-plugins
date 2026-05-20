import 'cheerio';
import 'htmlparser2';
import 'dayjs';
import 'protobufjs';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  const [resource, config] = args;
  const requestUrl =
    resource instanceof Request ? resource.url : String(resource || '');

  if (
    requestUrl.includes('localhost') ||
    requestUrl.includes('127.0.0.1') ||
    /^https?:\/\//i.test(requestUrl)
  ) {
    return await originalFetch(resource, config);
  }

  const _res = await originalFetch('http://localhost:3000/' + requestUrl, {
    ...config,
    credentials: 'include',
    mode: 'cors',
  });
  Object.defineProperty(_res, 'url', {
    value: _res.url.includes('localhost') ? requestUrl : _res.url,
  });
  return _res;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
