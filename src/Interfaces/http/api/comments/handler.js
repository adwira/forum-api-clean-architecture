/* eslint-disable no-underscore-dangle */
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentByIdUseCase = require('../../../../Applications/use_case/DeleteCommentByIdUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const comment = await addCommentUseCase.execute({
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      ...request.payload,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment: comment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request) {
    const deleteCommentByIdUseCase = this._container.getInstance(DeleteCommentByIdUseCase.name);
    await deleteCommentByIdUseCase.execute({
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
