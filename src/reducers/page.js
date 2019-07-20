const data = JSON.parse(localStorage.getItem('page'));

const initialState = data ? data : 'index';

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PAGE':
      localStorage.setItem('page', JSON.stringify(action.page));
      return action.page;
    default:
      return state
  }
}