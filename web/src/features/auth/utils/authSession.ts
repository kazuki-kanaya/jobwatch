export const AUTH_RETURN_TO_KEY = "obsern.auth.return_to";
const DEFAULT_POST_AUTH_PATH = "/dashboard";
const AUTH_CALLBACK_PATH = "/auth/callback";

export const getPostAuthPath = () => {
  const returnTo = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//") || returnTo.startsWith(AUTH_CALLBACK_PATH)) {
    return DEFAULT_POST_AUTH_PATH;
  }
  return returnTo;
};

export const setAuthReturnToPath = (path: string) => {
  window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, path);
};

export const clearAuthReturnToPath = () => {
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
};
