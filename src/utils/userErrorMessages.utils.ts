export const UserErrorMessages = {
  NOT_FOUND_BY_ID: (id: string) => `User with ID ${id} not found`,
  NOT_FOUND_BY_LOGIN: (login: string) => `User with login ${login} not found`,

  UNABLE_TO_GET_LIST_OF_USERS: () => 'Unable to get list of users',
  UNABLE_TO_CREATE_USER: () => 'Unable to create user with provided data',
  UNABLE_TO_UPDATE_USER: (id: string) => `Unable to update user with ID ${id}`,
  UNABLE_TO_DELETE_USER: (id: string) => `Unable to delete user with ID ${id}`,

  ACCESS_DENIED: () => 'Access denied',

  INVALID_CREDENTIALS: () => 'Invalid credentials',

  SOMETHING_WENT_WRONG: () => 'Something went wrong',

  INTERNAL_SERVER_ERROR: () => 'Internal server error',

  LOGIN_ALREADY_REGISTERED: (login: string) =>
    `Login - ${login} already registered`,
};
