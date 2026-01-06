/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTestTableHelper = {
  async addReplies({
    id = 'reply-123', commentId = 'comment-123', threadId = 'thread-123', owner = 'user-123', date = '2021-08-08T08:07:01.522Z', content = 'this is content', isDelete = 0,
  } = {}) {
    const query = {
      text: 'INSERT INTO replies (id, comment_id, thread_id, owner, content, date, is_delete) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, commentId, threadId, owner, content, date, isDelete],
    };
    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTestTableHelper;
