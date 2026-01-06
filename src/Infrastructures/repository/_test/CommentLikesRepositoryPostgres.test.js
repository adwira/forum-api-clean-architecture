const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentLikesRepositoryPostgres = require('../CommentLikesRepositoryPostgres');
const EditCommentLike = require('../../../Domains/likes/entities/EditCommentLike');
const pool = require('../../database/postgres/pool');

describe('CommentLikesRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentLike function', () => {
    it('shoul return true if the table has already been liked.', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });
      const payload = {
        id: 'like-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await CommentLikesTableTestHelper.addCommentLike(payload);
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool, {},
      );

      // action
      const commentLike = await commentLikesRepositoryPostgres
        .verifyCommentLike(payload.owner, payload.commentId);

      // assert
      expect(commentLike).toEqual(true);
    });

    it('should returns false if the table is not liked yet', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-456', threadId: 'thread-123', owner: 'user-123', date,
      });
      const payload = {
        id: 'like-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await CommentLikesTableTestHelper.addCommentLike(payload);
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool, {},
      );

      // action
      const commentLike = await commentLikesRepositoryPostgres
        .verifyCommentLike(payload.owner, 'comment-456');

      // assert
      expect(commentLike).toEqual(false);
    });
  });

  describe('addCommentLike function', () => {
    it('should persist add like', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      const editCommentLike = new EditCommentLike({
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // action
      await commentLikesRepositoryPostgres.addCommentLike(editCommentLike);

      // assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikeById({ id: 'like-123' });
      expect(commentLikes).toHaveLength(1);
    });
  });

  describe('getCommentLikeByThreadId function', () => {
    it('should return empty array when no likes found', async () => {
      // arrange
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool);

      // action
      const likes = await commentLikesRepositoryPostgres.getLikeCountByThreadId('thread-123');

      // assert
      expect(likes).toEqual([]);
    });

    it('should return likes correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456', username: 'dicoding2',
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

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-456',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-789',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-456',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        commentId: 'comment-456',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool, {},
      );

      // action
      const likes = await commentLikesRepositoryPostgres.getLikeCountByThreadId('thread-123');

      // assert
      expect(likes).toHaveLength(2);
      expect(likes[0]).toHaveProperty('comment_id', 'comment-123');
      expect(likes[0]).toHaveProperty('likeCount', 2);
      expect(likes[1]).toHaveProperty('comment_id', 'comment-456');
      expect(likes[1]).toHaveProperty('likeCount', 1);
    });
  });

  describe('deleteCommentLike function', () => {
    it('should delete like correctly', async () => {
      // arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456', username: 'dicodings',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', date,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', owner: 'user-123', date,
      });

      const payload = {
        id: 'like-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      const secondPayload = {
        id: 'like-456',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-456',
      };

      await CommentLikesTableTestHelper.addCommentLike(payload);
      await CommentLikesTableTestHelper.addCommentLike(secondPayload);

      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool, {},
      );

      // action
      await commentLikesRepositoryPostgres.deleteCommentLike(payload.owner, payload.commentId);
      const likeCount = await commentLikesRepositoryPostgres.getLikeCountByThreadId('thread-123');

      const firstLike = await CommentLikesTableTestHelper.findCommentLikeById({ id: 'like-123' });
      const secondLike = await CommentLikesTableTestHelper.findCommentLikeById({ id: 'like-456' });
      // assert
      expect(firstLike).toHaveLength(0);
      expect(secondLike).toHaveLength(1);
      expect(likeCount[0].likeCount).toEqual(1);
    });
  });
});
