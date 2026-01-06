/* eslint-disable camelcase */
class GetCommentLikes {
  constructor(payload) {
    GetCommentLikes.verifyPayload(payload);
    const { likeCount } = payload;
    this.likeCount = likeCount;
  }

  static verifyPayload(payload) {
    const { comment_id, likeCount } = payload;
    if (!comment_id || !likeCount) {
      throw new Error('GET_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof comment_id !== 'string' || typeof likeCount !== 'number') {
      throw new Error('GET_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentLikes;
