const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('Add Thread Use Case', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'this is title',
      body: 'this is thread body',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'this is title',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // mocking Date
    const fakeDate = new Date();
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => fakeDate);

    // action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: fakeDate.toISOString(),
      owner: useCasePayload.owner,
    }));

    spy.mockRestore();
  });
});
