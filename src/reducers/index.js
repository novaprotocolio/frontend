import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import market from './market';
import account from './account';
import config from './config';
import { WalletReducer } from 'sdk-wallet';
import page from './page';

const rootReducer = combineReducers({
  page,
  market,
  account,
  config,
  form: !!formReducer ? formReducer : {},
  WalletReducer
});
export default rootReducer;
