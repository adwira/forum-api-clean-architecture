/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
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
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      defaultValue: 'CURRENT_TIMESTAMP',
    },
    is_delete: {
      type: 'SMALLINT',
      defaultValue: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
