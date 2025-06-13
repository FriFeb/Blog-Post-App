const postController = require('../controllers/postController');
const Post = require('../models/post');
const httpMocks = require('node-mocks-http');
jest.mock('../models/post');

describe('Post Controller', () => {
  it('should render index with posts', async () => {
    const fakePosts = [{ title: 'A' }, { title: 'B' }];
    Post.find.mockResolvedValue(fakePosts);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.render = jest.fn();
    const next = jest.fn();

    await postController.index(req, res, next);

    expect(Post.find).toHaveBeenCalledWith({});
    expect(res.render).toHaveBeenCalledWith('index', { posts: fakePosts });
  });

  it('should call next if error occurs', async () => {
    Post.find.mockRejectedValue(new Error('DB error'));

    const req = httpMocks.createRequest({ method: 'GET', url: '/' });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await postController.index(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
