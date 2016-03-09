import React from 'react';
import { Route, IndexRoute } from 'react-router';

import BaseComponent from './components/base/component';
import MainContentComponent from './components/main/content/component';


export default (
  <Route path="/" component={BaseComponent}>
    <IndexRoute component={MainContentComponent} />
  </Route>
);
