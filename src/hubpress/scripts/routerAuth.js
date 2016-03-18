let isAuthenticated = false;

export function setAuthenticated (_isAuthenticated) {
  isAuthenticated = _isAuthenticated;
}

export function requireAuth(nextState, replaceState) {
  if (!isAuthenticated) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}
