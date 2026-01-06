/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class CommentLikesRepository {
  async verifyCommentLike(owner, commentId) {
    throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addCommentLike({ owner, commentId, threadId }) {
    throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentLike(owner, commentId) {
    throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountByThreadId(commentId) {
    throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentLikesRepository;
