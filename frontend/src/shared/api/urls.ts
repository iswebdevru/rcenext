// I came across a problem regarding running my app locally in docker:
// When I try to fetch resource from rest api while being server-side
// I can not locate where my Rest Api service is.
// This problem is related to docker networking and the only way to solve it
// is to use the name of the service declared in compose.dev.yaml file.
// So I have to deal with a little mess here :(
export const API =
  process.env.NODE_ENV === 'development' && typeof window === 'undefined'
    ? 'http://rest-api'
    : process.env.NEXT_PUBLIC_RCENEXTAPI_URL;
export const API_LOGIN = `${API}/auth/login/`;
export const API_LOGOUT = `${API}/auth/logout/`;
export const API_TEACHERS = `${API}/teachers/`;
export const API_SUBJECTS = `${API}/subjects/`;
export const API_GROUPS = `${API}/groups/`;
export const API_CLASSES_MIXED = `${API}/classes/`;
export const API_CLASSES_MAIN = `${API}/classes-main/`;
export const API_CLASSES_CHANGES = `${API}/classes-changes/`;
