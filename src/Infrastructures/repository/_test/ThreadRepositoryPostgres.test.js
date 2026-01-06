const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableHelper = require('../../../../tests/UsersTableTestHelper');

describe('Thread Repository Postgres', () => {
  afterEach(async () => {
    await ThreadsTableHelper.cleanTable();
    await UsersTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // arrange
      await UsersTableHelper.addUser();
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'this is title',
        body: 'this is body',
        date: new Date().toISOString(),
      });
      const fakeIdGenerator = () => 123;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // action
      await threadRepositoryPostgres.addThread(addThread);

      // assert
      const thread = await ThreadsTableHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // arrange
      await UsersTableHelper.addUser();
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'this is title',
        body: 'this is body',
        date: new Date().toISOString(),
      });

      const fakeIdGenerator = () => 123;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // assert
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'this is title',
        owner: 'user-123',
      });
    });
  });

  describe('get Thread By Id', () => {
    it('should throw NotFoundError when thread not found', () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // action
      return expect(threadRepositoryPostgres.getThreadById('thread-122'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return id, title, body, date, username correctly', async () => {
      // arrange
      await UsersTableHelper.addUser({ id: 'user-123', username: 'user' });
      // mocking Date
      const fakeDate = new Date().toISOString();
      await ThreadsTableHelper.addThread({ id: 'thread-123', date: fakeDate });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // action
      const {
        id, title, body, date, username,
      } = await threadRepositoryPostgres.getThreadById('thread-123');

      // assert
      expect(id).toEqual('thread-123');
      expect(title).toEqual('this is title');
      expect(body).toEqual('this is body');
      expect(date.toISOString()).toEqual(fakeDate);
      expect(username).toEqual('user');
    });
  });
});
