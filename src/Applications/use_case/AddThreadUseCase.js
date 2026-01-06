/* eslint-disable no-underscore-dangle */
const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const date = new Date().toISOString();
    const addThread = new AddThread({ ...useCasePayload, date });
    const addedThread = await this._threadRepository.addThread(addThread);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
