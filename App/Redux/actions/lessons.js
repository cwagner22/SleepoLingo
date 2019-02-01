import { ADD_TODO } from "../constants/actionTypes";

let nextTodoId = 0;

export const addTodo = content => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
});

export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  payload: { id }
});

export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });

export const fetchActivitiesByGenre = (nextHref, genre) => (
  dispatch,
  getState
) => {
  const requestType = requestTypes.GENRES;
  const initHref = unauthApiUrl(
    `tracks?linked_partitioning=1&limit=20&offset=0&tags=${genre}`,
    "&"
  );
  const url = nextHref || initHref;
  const requestInProcess = getState().request[requestType];

  if (requestInProcess) {
    return;
  }

  dispatch(setRequestInProcess(true, requestType));

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const normalized = normalize(data.collection, arrayOf(trackSchema));
      dispatch(mergeEntities(normalized.entities));
      dispatch(mergeActivitiesByGenre(normalized.result, genre));
      dispatch(setPaginateLink(data.next_href, genre));
      dispatch(setRequestInProcess(false, requestType));
    });
};
