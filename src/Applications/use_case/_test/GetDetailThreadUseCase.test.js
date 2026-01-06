const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentLikesRepository = require('../../../Domains/likes/CommentLikesRepository');
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');

describe('GetDetailThreadUseCase', () => {
  describe('execute', () => {
    it('should orchestrating the get detail thread action correctly', async () => {
      // arrange
      const useCasePayload = {
        threadId: 'thread-123',
      };

      const mockRawThread = {
        id: 'thread-123',
        title: 'this is title',
        body: 'this is body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      };

      const mockRawComments = [
        {
          id: 'comment-123',
          content: 'this is comment',
          date: '2021-08-08T07:20:09.775Z',
          username: 'dicoding',
          is_delete: 0,
        },
        {
          id: 'comment-456',
          content: 'this is another comment',
          date: '2021-08-08T07:21:09.775Z',
          username: 'johndoe',
          is_delete: 0,
        },
      ];

      const mockRawReplies = [
        {
          id: 'reply-123',
          content: 'this is reply',
          date: '2021-08-08T07:22:09.775Z',
          username: 'dicoding',
          is_delete: 0,
          comment_id: 'comment-123',
        },
        {
          id: 'reply-456',
          content: 'this is another reply',
          date: '2021-08-08T07:23:09.775Z',
          username: 'johndoe',
          is_delete: 0,
          comment_id: 'comment-123',
        },
        {
          id: 'reply-789',
          content: 'this is reply for comment 2',
          date: '2021-08-08T07:24:09.775Z',
          username: 'dicoding',
          is_delete: 0,
          comment_id: 'comment-456',
        },
      ];

      const mockRawLikes = [
        {
          comment_id: 'comment-123',
          likeCount: 5,
        },
        {
          comment_id: 'comment-456',
          likeCount: 19999,
        },
      ];

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      const mockCommentLikesRepository = new CommentLikesRepository();

      mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawThread));

      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawComments));

      mockReplyRepository.getRepliesByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawReplies));

      mockCommentLikesRepository.getLikeCountByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawLikes));

      const getDetailThreadUseCase = new GetDetailThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        commentLikesRepository: mockCommentLikesRepository,
      });

      // action
      const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

      // assert
      expect(detailThread).toBeInstanceOf(GetDetailThread);
      expect(detailThread.id).toEqual('thread-123');
      expect(detailThread.title).toEqual('this is title');
      expect(detailThread.body).toEqual('this is body');
      expect(detailThread.date).toEqual('2021-08-08T07:19:09.775Z');
      expect(detailThread.username).toEqual('dicoding');
      expect(detailThread.comments).toHaveLength(2);

      // assert first comment with replies & like
      expect(detailThread.comments[0].id).toEqual('comment-123');
      expect(detailThread.comments[0].content).toEqual('this is comment');
      expect(detailThread.comments[0].date).toEqual('2021-08-08T07:20:09.775Z');
      expect(detailThread.comments[0].username).toEqual('dicoding');
      expect(detailThread.comments[0].replies).toHaveLength(2);
      expect(detailThread.comments[0].replies[0].id).toEqual('reply-123');
      expect(detailThread.comments[0].replies[0].content).toEqual('this is reply');
      expect(detailThread.comments[0].replies[0].date).toEqual('2021-08-08T07:22:09.775Z');
      expect(detailThread.comments[0].replies[0].username).toEqual('dicoding');
      expect(detailThread.comments[0].replies[1].id).toEqual('reply-456');
      expect(detailThread.comments[0].replies[1].content).toEqual('this is another reply');
      expect(detailThread.comments[0].replies[1].date).toEqual('2021-08-08T07:23:09.775Z');
      expect(detailThread.comments[0].replies[1].username).toEqual('johndoe');
      // console.log(detailThread.comments[0]);
      expect(detailThread.comments[0].likeCount).toEqual(5);

      // assert second comment with replies & likes
      expect(detailThread.comments[1].id).toEqual('comment-456');
      expect(detailThread.comments[1].content).toEqual('this is another comment');
      expect(detailThread.comments[1].date).toEqual('2021-08-08T07:21:09.775Z');
      expect(detailThread.comments[1].username).toEqual('johndoe');
      expect(detailThread.comments[1].replies).toHaveLength(1);
      expect(detailThread.comments[1].replies[0].id).toEqual('reply-789');
      expect(detailThread.comments[1].replies[0].content).toEqual('this is reply for comment 2');
      expect(detailThread.comments[1].replies[0].date).toEqual('2021-08-08T07:24:09.775Z');
      expect(detailThread.comments[1].replies[0].username).toEqual('dicoding');
      expect(detailThread.comments[1].likeCount).toEqual(19999);

      expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
      expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
      expect(mockCommentLikesRepository.getLikeCountByThreadId).toBeCalledWith('thread-123');
    });

    it('should filter replies correctly by comment_id', async () => {
      // arrange
      const useCasePayload = {
        threadId: 'thread-123',
      };

      const mockRawThread = {
        id: 'thread-123',
        title: 'this is title',
        body: 'this is body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      };

      const mockRawComments = [
        {
          id: 'comment-123',
          content: 'this is comment 1',
          date: '2021-08-08T07:20:09.775Z',
          username: 'dicoding',
          is_delete: 0,
        },
        {
          id: 'comment-456',
          content: 'this is comment 2',
          date: '2021-08-08T07:21:09.775Z',
          username: 'johndoe',
          is_delete: 0,
        },
      ];

      const mockRawReplies = [
        {
          id: 'reply-123',
          content: 'reply for comment 1',
          date: '2021-08-08T07:22:09.775Z',
          username: 'dicoding',
          is_delete: 0,
          comment_id: 'comment-123',
        },
        {
          id: 'reply-456',
          content: 'reply for comment 2',
          date: '2021-08-08T07:23:09.775Z',
          username: 'johndoe',
          is_delete: 0,
          comment_id: 'comment-456',
        },
      ];

      const mockRawLikes = [
        {
          comment_id: 'comment-123',
          likeCount: 5,
        },
        {
          comment_id: 'comment-456',
          likeCount: 19999,
        },
      ];

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      const mockCommentLikesRepository = new CommentLikesRepository();

      mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawThread));

      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawComments));

      mockReplyRepository.getRepliesByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawReplies));

      mockCommentLikesRepository.getLikeCountByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockRawLikes));

      const getDetailThreadUseCase = new GetDetailThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        commentLikesRepository: mockCommentLikesRepository,
      });

      // action
      const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

      // assert
      expect(detailThread).toBeInstanceOf(GetDetailThread);
      expect(detailThread.comments).toHaveLength(2);

      // assert first comment only has its own reply
      expect(detailThread.comments[0].id).toEqual('comment-123');
      expect(detailThread.comments[0].replies).toHaveLength(1);
      expect(detailThread.comments[0].replies[0].id).toEqual('reply-123');
      expect(detailThread.comments[0].replies[0].content).toEqual('reply for comment 1');

      // assert second comment only has its own replies
      expect(detailThread.comments[1].id).toEqual('comment-456');
      expect(detailThread.comments[1].replies).toHaveLength(1);
      expect(detailThread.comments[1].replies[0].id).toEqual('reply-456');
      expect(detailThread.comments[1].replies[0].content).toEqual('reply for comment 2');

      // Verify that replies are correctly filtered
      const replyIdsInComment1 = detailThread.comments[0].replies.map((r) => r.id);
      const replyIdsInComment2 = detailThread.comments[1].replies.map((r) => r.id);
      expect(replyIdsInComment1).not.toContain('reply-456');
      expect(replyIdsInComment2).not.toContain('reply-123');

      expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
      expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
    });
  });

  describe('validatePayload', () => {
    it('should throw error when payload not contain needed property', async () => {
      // arrange
      const useCasePayload = {};

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      const mockCommentLikesRepository = new CommentLikesRepository();

      mockThreadRepository.getThreadById = jest.fn();
      mockCommentRepository.getCommentsByThreadId = jest.fn();
      mockReplyRepository.getRepliesByThreadId = jest.fn();
      mockCommentLikesRepository.getLikeCountByThreadId = jest.fn();

      const getDetailThreadUseCase = new GetDetailThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        commentLikesRepository: mockCommentLikesRepository,
      });

      // action & assert
      await expect(getDetailThreadUseCase.execute(useCasePayload))
        .rejects
        .toThrow('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

      // verify that repository methods are not called when validation fails
      expect(mockThreadRepository.getThreadById).not.toHaveBeenCalled();
      expect(mockCommentRepository.getCommentsByThreadId).not.toHaveBeenCalled();
      expect(mockReplyRepository.getRepliesByThreadId).not.toHaveBeenCalled();
    });

    it('should throw error when payload did not meet data type specification', async () => {
      // arrange
      const useCasePayload = {
        threadId: 123,
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.getThreadById = jest.fn();
      mockCommentRepository.getCommentsByThreadId = jest.fn();
      mockReplyRepository.getRepliesByThreadId = jest.fn();

      const getDetailThreadUseCase = new GetDetailThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // action & assert
      await expect(getDetailThreadUseCase.execute(useCasePayload))
        .rejects
        .toThrow('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');

      // verify that repository methods are not called when validation fails
      expect(mockThreadRepository.getThreadById).not.toHaveBeenCalled();
      expect(mockCommentRepository.getCommentsByThreadId).not.toHaveBeenCalled();
      expect(mockReplyRepository.getRepliesByThreadId).not.toHaveBeenCalled();
    });
  });
});
