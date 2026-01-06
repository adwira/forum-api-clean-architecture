/* eslint-disable no-underscore-dangle */
const CommentLikesRepository = require('../../Domains/likes/CommentLikesRepository');

class CommentLikesRepositoryPostgres extends CommentLikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentLike(owner, commentId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return false;
    }
    return true;
  }

  async addCommentLike({ owner, commentId, threadId }) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES ($1, $2, $3, $4)',
      values: [id, commentId, threadId, owner],
    };
    await this._pool.query(query);
  }

  async deleteCommentLike(owner, commentId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };
    await this._pool.query(query);
  }

  async getLikeCountByThreadId(threadId) {
    const query = {
      text: `SELECT comment_id, CAST(COUNT(id) AS INTEGER) AS "likeCount"
            FROM comment_likes WHERE thread_id = $1
            GROUP BY comment_id ORDER BY comment_id ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentLikesRepositoryPostgres;
