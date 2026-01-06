/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
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
      notNull: true,
    },
    is_delete: {
      type: 'SMALLINT',
      defaultValue: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
