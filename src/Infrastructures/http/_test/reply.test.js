const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('Replies feature endpoint', () => {
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

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
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

      const requestPayload = {
        content: 'sebuah reply',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedReply.owner).toBeDefined();
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

      const requestPayload = {
        content: 'sebuah reply',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
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

      const requestPayload = {
        content: 'sebuah reply',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-999/comments/comment-999/replies',
        payload: requestPayload,
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

      const requestPayload = {
        content: 'sebuah reply',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/comment-999/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not contain needed property', async () => {
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

      const requestPayload = {};

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
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

      const requestPayload = {
        content: 123,
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply successfully', async () => {
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

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {
          content: 'sebuah reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedReply } } = JSON.parse(replyResponse.payload);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
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

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {
          content: 'sebuah reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedReply } } = JSON.parse(replyResponse.payload);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
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
        method: 'DELETE',
        url: '/threads/thread-999/comments/comment-999/replies/reply-999',
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
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/comment-999/replies/reply-999`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when reply not found', async () => {
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

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/reply-999`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 403 when user is not reply owner', async () => {
      // arrange
      const server = await createServer(container);
      const accessToken1 = await getAccessToken(server);

      // buat thread dengan user 1
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      // buat comment dengan user 1
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      // buat reply dengan user 1
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {
          content: 'sebuah reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const { data: { addedReply } } = JSON.parse(replyResponse.payload);

      // buat user 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        },
      });

      // Login user 2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });
      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);

      // action - user 2 mencoba menghapus reply user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
