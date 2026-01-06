/* eslint-disable no-underscore-dangle */
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyByIdUseCase = require('../../../../Applications/use_case/DeleteReplyByIdUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const reply = await addReplyUseCase.execute({
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      ...request.payload,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply: reply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request) {
    const deleteReplyByIdUseCase = this._container.getInstance(DeleteReplyByIdUseCase.name);
    await deleteReplyByIdUseCase.execute({
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
