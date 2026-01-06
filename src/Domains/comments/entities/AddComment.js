class AddComment {
  constructor(payload) {
    AddComment.verifyPayload(payload);

    const {
      content, threadId, owner, date,
    } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
    this.date = date;
  }

  static verifyPayload({
    content, threadId, owner, date,
  }) {
    if (!content || !threadId || !owner || !date) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof owner !== 'string'
      || typeof date !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
