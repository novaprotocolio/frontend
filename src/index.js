import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 1000 });

let enhancer = applyMiddleware(thunk);

// enable development debugger
if (process.env.NODE_ENV === 'development') {
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer);
}

export const store = createStore(rootReducer, enhancer);

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });

  module.hot.accept('./reducers', () => {
    store.replaceReducer(rootReducer);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
// serviceWorker.unregister();
