const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');

describe('Add Comment Use Case', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // arrange
    const date = new Date().toISOString();
    const useCasePayload = {
      content: 'this is content',
      threadId: 'thread-123',
      owner: 'user-123',
      date,
    };
    const mockDate = new Date();
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    await expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    await expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment({ ...useCasePayload, date: mockDate.toISOString() }));
    spy.mockRestore();
  });
});
