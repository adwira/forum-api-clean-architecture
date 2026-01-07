/* eslint-disable no-underscore-dangle */
const CommentLikesUseCase = require('../../../../Applications/use_case/CommentLikesUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;
    this.putCommentLike = this.putCommentLike.bind(this);
  }

  async putCommentLike(request, h) {
    const commentLikesUseCase = this._container.getInstance(CommentLikesUseCase.name);
    await commentLikesUseCase.execute({
      owner: request.auth.credentials.id,
      commentId: request.params.commentId,
      threadId: request.params.threadId,
    });
    const response = h.response({
      status: 'always fail',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;
