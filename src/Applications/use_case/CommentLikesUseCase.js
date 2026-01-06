/* eslint-disable no-underscore-dangle */
const EditCommentLike = require('../../Domains/likes/entities/EditCommentLike');

class CommentLikesUseCase {
  constructor({ threadRepository, commentRepository, commentLikesRepository }) {
    this._commentRepository = commentRepository;
    this._commentLikesRepository = commentLikesRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const editCommentLike = new EditCommentLike(useCasePayload);
    const { threadId, commentId, owner } = editCommentLike;
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(threadId, commentId);
    const edit = await this._commentLikesRepository.verifyCommentLike(owner, commentId);
    if (!edit) {
      await this._commentLikesRepository.addCommentLike(editCommentLike);
    } else {
      await this._commentLikesRepository.deleteCommentLike(owner, commentId);
    }
  }
}

module.exports = CommentLikesUseCase;
