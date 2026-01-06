class AddReply {
  constructor(payload) {
    AddReply.verifyPayload(payload);

    const {
      content, threadId, commentId, owner, date,
    } = payload;
    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
    this.date = date;
  }

  static verifyPayload({
    content, threadId, commentId, owner, date,
  }) {
    if (!content || !threadId || !commentId || !owner || !date) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
      || typeof date !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
