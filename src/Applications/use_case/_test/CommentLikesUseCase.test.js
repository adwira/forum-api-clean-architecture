const CommentLikesUseCase = require('../CommentLikesUseCase');
const EditCommentLike = require('../../../Domains/likes/entities/EditCommentLike');
const CommentLikesRepository = require('../../../Domains/likes/CommentLikesRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('Comment Likes Use Case', () => {
  it('should orchestrating the add like action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikesRepository.verifyCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikesRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const commentLikesUseCase = new CommentLikesUseCase({
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
    });
    // action
    await commentLikesUseCase.execute(useCasePayload);

    // assert
    await expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    await expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    await expect(mockCommentLikesRepository.verifyCommentLike)
      .toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
    await expect(mockCommentLikesRepository.addCommentLike)
      .toBeCalledWith(new EditCommentLike(useCasePayload));
  });

  it('should orchestrating the delete like action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikesRepository.verifyCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikesRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const commentLikesUseCase = new CommentLikesUseCase({
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
    });
    // action
    await commentLikesUseCase.execute(useCasePayload);

    // assert
    await expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    await expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    await expect(mockCommentLikesRepository.verifyCommentLike)
      .toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
    await expect(mockCommentLikesRepository.deleteCommentLike)
      .toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
  });
});
