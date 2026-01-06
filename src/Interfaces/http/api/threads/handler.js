/* eslint-disable no-underscore-dangle */
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id } = request.auth.credentials;
    const thread = await addThreadUseCase.execute({ ...request.payload, owner: id });
    const response = h.response({
      status: 'success',
      data: {
        addedThread: thread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request) {
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const threadDetail = await getDetailThreadUseCase.execute({
      threadId: request.params.threadId,
    });
    return {
      status: 'success',
      data: {
        thread: threadDetail,
      },
    };
  }
}

module.exports = ThreadsHandler;
