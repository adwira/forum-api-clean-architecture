/* eslint-disable camelcase */
class GetComment {
  constructor(payload) {
    GetComment.verifyPayload(payload);
    const {
      id, content, date, username, is_delete,
    } = payload;

    this.id = id;
    const isDelete = Number(is_delete) === 1;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.date = typeof date === 'string' ? date : date.toISOString();
    this.username = username;
  }

  static verifyPayload({
    id, content, date, username, is_delete,
  }) {
    if (!id
        || !content
        || !date
        || !username
        || is_delete === undefined
        || is_delete === null) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof is_delete !== 'number') {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
