const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads feature endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  // Helper function untuk mendapatkan access token
  const getAccessToken = async (server) => {
    // Tambahkan user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Login untuk mendapatkan token
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { data: { accessToken } } = JSON.parse(loginResponse.payload);
    return accessToken;
  };

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when request not authenticated', async () => {
      // arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // arrange
      const requestPayload = {
        title: 'sebuah thread',
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 123,
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail with comments and replies', async () => {
      // arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {
          content: 'sebuah reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
      expect(responseJson.data.thread.comments.length).toBeGreaterThan(0);
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments[0].replies)).toBe(true);
    });

    it('should response 404 when thread not found', async () => {
      // arrange
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-999',
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
