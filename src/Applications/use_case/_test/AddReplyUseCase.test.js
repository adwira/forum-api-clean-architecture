const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('Add reply use case', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // arrange
    const date = new Date().toISOString();
    const useCasePayload = {
      content: 'this is content',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      date,
    };

    const mockDate = new Date();
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockcommentRepository = new CommentRepository();
    const mockreplyRepository = new ReplyRepository();
    const mockthreadRepository = new ThreadRepository();

    mockthreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockcommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockreplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockreplyRepository,
      commentRepository: mockcommentRepository,
      threadRepository: mockthreadRepository,
    });
    // action
    const addedReply = await addReplyUseCase.execute(useCasePayload);
    // assert
    await expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    await expect(mockthreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    await expect(mockcommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    await expect(mockreplyRepository.addReply)
      .toBeCalledWith(new AddReply({ ...useCasePayload, date: mockDate.toISOString() }));
    spy.mockRestore();
  });
});
