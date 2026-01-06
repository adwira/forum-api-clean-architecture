const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('Likes feature endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
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

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted likes', async () => {
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

      // action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request not authenticated', async () => {
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

      // action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when thread not found', async () => {
      // arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      // action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-999/comments/comment-999/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when comment not found', async () => {
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

      // action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/comment-999/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
