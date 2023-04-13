import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';

import { Provider, connect } from 'react-redux';
import { store } from './store/rootStore';
import '../css/style.css';

render(<AppContainer>
  <Provider store={store}>
  <App />
  </Provider>
  </AppContainer>, document.querySelector("#app"));

var module: any = module
if (module && module['hot']) {
  module.hot.accept('./app', () => {
    render(
      <Provider store={store}>
        <AppContainer>
          <App />
        </AppContainer>
      </Provider>,
      document.querySelector("#app")
    );
  });
}

