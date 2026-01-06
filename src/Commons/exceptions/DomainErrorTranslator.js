const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');
// const NotFoundError = require('./NotFoundError')

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator.directories[error.message] || error;
  },
};

DomainErrorTranslator.directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'EDIT_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'EDIT_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),
  'GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Bad Request: Request not contain needed property'),
  'GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Bad Request: Request not meet data type specification'),

  // AuthenticationError
  'Missing authentication': new AuthenticationError('Missing authentication'),
  'Invalid credentials': new AuthenticationError('Missing authentication'), // Just in case
};

module.exports = DomainErrorTranslator;
