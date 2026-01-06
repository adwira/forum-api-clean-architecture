const ThreadRepository = require('../ThreadRepository');

describe('Thread Repository Interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // arrange
    const threadRepository = new ThreadRepository();

    // action & assert
    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyThreadAvailability).rejects.toThrowError('HREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
