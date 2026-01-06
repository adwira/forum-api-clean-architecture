/* eslint-disable no-underscore-dangle */
class DeleteReplyByIdUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await DeleteReplyByIdUseCase._validatePayload(useCasePayload);
    const {
      threadId, commentId, replyId, owner,
    } = useCasePayload;
    await this._replyRepository.verifyReplyAvailability(threadId, commentId, replyId);
    await this._replyRepository.verifyOwner(owner, replyId);
    return this._replyRepository.deleteReplyById(replyId);
  }

  static _validatePayload(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = useCasePayload;
    if (!threadId || !commentId || !replyId || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyByIdUseCase;
