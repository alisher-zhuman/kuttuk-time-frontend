// react-router tracks the current position in the history stack as
// window.history.state.idx (0 = bottom of the stack, nothing to go back to).
// More reliable than useNavigationType(), which only reports the last action
// type, not whether there is actually a previous entry to return to.
export const canGoBack = () =>
  ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0;

// Leave the app for another page in this tab (the website: the bank's page,
// the Mini App's t.me link). One place, so tests can stand in for it - jsdom
// can't stub window.location.
export const goToUrl = (url: string) => {
  window.location.assign(url);
};
