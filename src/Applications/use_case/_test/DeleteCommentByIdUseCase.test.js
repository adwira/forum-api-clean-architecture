const DeleteCommentByIdUseCase = require('../DeleteCommentByIdUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('Delete Comment By Id Use Case', () => {
  it('should throw error when useCasePayload did not contain needed property', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    // action
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({});
    // assert
    await expect(deleteCommentByIdUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when usec case payload did not meet data type specification', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 12,
    };
    // action
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({});
    // assert
    await expect(deleteCommentByIdUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrating the delete comment action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'owner-123',
    };
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      commentRepository: mockCommentRepository,
    });

    // action
    await deleteCommentByIdUseCase.execute(useCasePayload);

    // assert
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(
        useCasePayload.threadId, useCasePayload.commentId,
      );
    expect(mockCommentRepository.verifyOwner)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
