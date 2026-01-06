/* eslint-disable no-underscore-dangle */
const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const date = new Date().toISOString();
    const addComment = new AddComment({ ...useCasePayload, date });
    const { threadId } = useCasePayload;

    await this._threadRepository.verifyThreadAvailability(threadId);

    const addedComment = await this._commentRepository.addComment(addComment);
    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
