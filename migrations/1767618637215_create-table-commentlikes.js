/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments',
      notNull: true,
      onDelete: 'CASCADE',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads',
      notNull: true,
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      notNull: true,
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
