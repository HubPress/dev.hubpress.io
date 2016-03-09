
export function toastr (state = {
  message: {}
}, action) {

  if (action.payload && action.payload.message) {
    return Object.assign(state, {
      message: action.payload.message
    });
  }
  else {
    return state;
  }

};
