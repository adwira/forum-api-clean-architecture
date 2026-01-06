class EditCommentLike {
  constructor(payload) {
    EditCommentLike.verifyPayload(payload);

    const { owner, commentId, threadId } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.threadId = threadId;
  }

  static verifyPayload(payload) {
    const { owner, commentId, threadId } = payload;
    if (!owner || !commentId || !threadId) {
      throw new Error('EDIT_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof owner !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('EDIT_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = EditCommentLike;
