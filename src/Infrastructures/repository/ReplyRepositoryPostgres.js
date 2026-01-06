/* eslint-disable no-underscore-dangle */
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const id = `reply-${this._idGenerator()}`;
    const {
      commentId, threadId, owner, content, date,
    } = addReply;
    const query = {
      text: `INSERT INTO replies (id, comment_id, thread_id, owner, content, date, is_delete)
              VALUES ($1, $2, $3, $4, $5, $6, 0) RETURNING id, content, owner`,
      values: [id, commentId, threadId, owner, content, date],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT r.id, r.content, r.date, u.username, r.is_delete, r.comment_id
              FROM replies r
              INNER JOIN users u ON r.owner = u.id
              WHERE r.thread_id = $1
              ORDER BY r.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = 1 WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async verifyOwner(owner, replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE owner = $1 AND id = $2',
      values: [owner, replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Access Denied');
    }
  }

  async verifyReplyAvailability(threadId, commentId, replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2 AND thread_id = $3',
      values: [replyId, commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reply Not Found');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
