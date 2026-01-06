/* eslint-disable no-underscore-dangle */
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const id = `comment-${this._idGenerator()}`;
    const {
      threadId, owner, content, date,
    } = addComment;
    const query = {
      text: `INSERT INTO comments (id, thread_id, owner, content, date, is_delete)
              VALUES ($1, $2, $3, $4, $5, 0) RETURNING id, content, owner`,
      values: [id, threadId, owner, content, date],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, c.content, c.date, u.username, c.is_delete
              FROM comments c
              INNER JOIN users u ON c.owner = u.id
              WHERE c.thread_id = $1
              ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = 1 WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyOwner(owner, commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE owner = $1 AND id = $2',
      values: [owner, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Access Denied');
    }
  }

  async verifyCommentAvailability(threadId, commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment Not Found');
    }
  }
}

module.exports = CommentRepositoryPostgres;
