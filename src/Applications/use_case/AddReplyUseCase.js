/* eslint-disable no-underscore-dangle */
const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const date = new Date().toISOString();
    const addReply = new AddReply({ ...useCasePayload, date });
    const { threadId, commentId } = useCasePayload;

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(threadId, commentId);

    const addedReply = await this._replyRepository.addReply(addReply);
    return new AddedReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
