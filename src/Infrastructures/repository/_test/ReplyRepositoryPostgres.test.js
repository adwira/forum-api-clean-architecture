const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', date });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      const addReply = new AddReply({
        content: 'this is reply content',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        date,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // action
      await replyRepositoryPostgres.addReply({ ...addReply, date: new Date().toISOString() });

      // assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      const addReply = new AddReply({
        content: 'this is reply content',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        date,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedReply = await replyRepositoryPostgres.addReply({
        ...addReply,
        date: new Date().toISOString(),
      });

      // assert
      expect(addedReply).toStrictEqual({
        id: 'reply-123',
        content: 'this is reply content',
        owner: 'user-123',
      });
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return empty array when no replies found', async () => {
      // arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // assert
      expect(replies).toEqual([]);
    });

    it('should return replies correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
        date,
        isDelete: 0,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty('id', 'reply-123');
      expect(replies[0]).toHaveProperty('content', 'this is reply');
      expect(replies[0]).toHaveProperty('username', 'dicoding');
      expect(replies[0]).toHaveProperty('date');
      expect(replies[0]).toHaveProperty('is_delete', 0);
    });

    it('should return replies ordered by date ASC', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });

      await pool.query({
        text: 'INSERT INTO comments (id, thread_id, owner, content, date) VALUES ($1, $2, $3, $4, $5)',
        values: ['comment-123', 'thread-123', 'user-123', 'this is comment', new Date().toISOString()],
      });

      const date1 = new Date('2023-01-01').toISOString();
      const date2 = new Date('2023-01-02').toISOString();
      const date3 = new Date('2023-01-03').toISOString();

      await RepliesTableTestHelper.addReplies({
        id: 'reply-3',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'reply 3',
        date: date3,
        isDelete: 0,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-1',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'reply 1',
        date: date1,
        isDelete: 0,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-2',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'reply 2',
        date: date2,
        isDelete: 0,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // assert
      expect(replies).toHaveLength(3);
      expect(replies[0].id).toBe('reply-1');
      expect(replies[1].id).toBe('reply-2');
      expect(replies[2].id).toBe('reply-3');
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
        date,
        isDelete: 0,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBe(1);
    });
  });

  describe('verifyOwner function', () => {
    it('should throw AuthorizationError when owner is not the reply owner', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456', username: 'johndoe', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyOwner('user-456', 'reply-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is the reply owner', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
        date,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyOwner('user-123', 'reply-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('thread-123', 'comment-123', 'reply-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply id does not match comment id', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-456', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('thread-123', 'comment-456', 'reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply id does not match thread id', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-456', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('thread-456', 'comment-123', 'reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is found', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is reply',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // action & assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('thread-123', 'comment-123', 'reply-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
