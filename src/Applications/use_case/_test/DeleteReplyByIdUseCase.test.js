const DeleteReplyByIdUseCase = require('../DeleteReplyByIdUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('Delete Reply Use Case', () => {
  it('should throw error when useCasePayload did not contain needed property', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    // action
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({});
    // assert
    await expect(deleteReplyByIdUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when usec case payload did not meet data type specification', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 12,
    };
    // action
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({});
    // assert
    await expect(deleteReplyByIdUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrating the delete reply action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'owner-123',
    };
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyReplyAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      replyRepository: mockReplyRepository,
    });

    // action
    await deleteReplyByIdUseCase.execute(useCasePayload);

    // assert
    expect(mockReplyRepository.verifyReplyAvailability)
      .toHaveBeenCalledWith(
        useCasePayload.threadId, useCasePayload.commentId, useCasePayload.replyId,
      );
    expect(mockReplyRepository.verifyOwner)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
