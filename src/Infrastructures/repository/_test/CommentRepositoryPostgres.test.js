const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const addComment = new AddComment({
        content: 'this is content',
        threadId: 'thread-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'this is content',
        owner: 'user-123',
      });
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty array when no comments found', async () => {
      // arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // assert
      expect(comments).toEqual([]);
    });

    it('should return comments correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const date = new Date().toISOString();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'this is content',
        date,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty('id', 'comment-123');
      expect(comments[0]).toHaveProperty('content', 'this is content');
      expect(comments[0]).toHaveProperty('username', 'dicoding');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('is_delete', 0);
    });

    it('should return comments ordered by date ASC', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const date1 = new Date('2026-01-01T00:00:00Z').toISOString();
      const date2 = new Date('2026-01-02T00:00:00Z').toISOString();

      await CommentsTableTestHelper.addComment({ id: 'comment-2', date: date2 });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', date: date1 });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('comment-1');
      expect(comments[1].id).toBe('comment-2');
    });
  });

  describe('deleteCommentById function', () => {
    it('should soft delete comment correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toBe(1);
    });
  });

  describe('verifyOwner function', () => {
    it('should throw AuthorizationError when owner is not the comment owner', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & assert
      await expect(commentRepositoryPostgres.verifyOwner('user-456', 'comment-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is the comment owner', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & assert
      await expect(commentRepositoryPostgres.verifyOwner('user-123', 'comment-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('thread-123', 'comment-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment id does not match thread id', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('thread-456', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('thread-123', 'comment-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
