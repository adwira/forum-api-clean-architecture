/* eslint-disable no-underscore-dangle */
class DeleteCommentByIdUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await DeleteCommentByIdUseCase._validatePayload(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;
    await this._commentRepository.verifyCommentAvailability(threadId, commentId);
    await this._commentRepository.verifyOwner(owner, commentId);
    return this._commentRepository.deleteCommentById(commentId);
  }

  static _validatePayload(useCasePayload) {
    const {
      threadId, commentId, owner,
    } = useCasePayload;
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentByIdUseCase;
