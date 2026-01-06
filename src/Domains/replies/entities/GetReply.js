/* eslint-disable camelcase */
class GetReply {
  constructor(payload) {
    GetReply.verifyPayload(payload);
    const {
      id, content, date, username, is_delete,
    } = payload;

    this.id = id;
    const isDelete = Number(is_delete) === 1;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  static verifyPayload({
    id, content, date, username, is_delete,
  }) {
    if (!id || !content || !date || !username || is_delete === undefined || is_delete === null) {
      throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof is_delete !== 'number') {
      throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetReply;
