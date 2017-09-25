/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `PostController.create()`
   */
  create: function (req, res) {

    let title = req.param('title'),
      content = req.param('content'),
      userId = req.param('user_id'), //original user_id from mongodb user model
      categoryName = req.param('category_name');

    if (!title) return res.badRequest({ err: 'Invalid post title field' });
    if (!content) return res.badRequest({ err: 'Invalid post content field' });
    if (!userId) return res.badRequest({ err: 'Invalid user_id field' });
    if (!categoryName) return res.badRequest({ err: 'Invalid category_name field' });

    Category.findOrCreate({ name: categoryName })
      .then(_category => {

        if (!_category) throw new Error('Unable to create category record');
        return _category;

      })
      .then(_category => {

        return Post.create({
          title,
          content,
          user: userId,
          category: _category.id
        });

      })
      .then(_post => {
        if (!_post) throw new Error('Unable to create new post');
        return res.json({ post: _post });
      })
      .catch(err => res.serverError(err.message));
	},


  /**
   * `PostController.findAll()`
   */
  findAll: function (req, res) {

    Post.find()
      .populate('user')
      .populate('category')
      .then(_posts => {
        if (!_posts || _posts.length === 0) {
          //throw new Error('No post found');
        }
        return res.ok(_posts);

      })
      .catch(err => res.serverError(err));
  },


  /**
   * `PostController.findOne()`
   */
  findOne: function (req, res) {

    let postId = req.params.id;

    if (!postId) return res.badRequest({ err: 'missing post_id field' });

    Post.findOne({ id: postId })
      .populate('category')
      .populate('user')
      .then(_post => {

        if (!_post) return res.notFound({ err: 'No post found' });

        return res.ok(_post);
      })
      .catch(err => res.serverError(err));
  },


  /**
   * `PostController.delete()`
   */
  delete: function (req, res) {
    let postId = req.params.id;

    if (!postId) return res.badRequest({ err: 'missing post_id field' });

    Post.destroy({ id: postId })
      .then(_post => {
        if (!_post || _post.length === 0) return res.notFound({ err: 'No post found in our record' });
        return res.ok(`Post is deleted with id ${postId}`);
      })
      .catch(err => res.serverError(err));  
  },


  /**
   * `PostController.update()`
   */
  update: function (req, res) {

    let title = req.param('title'),
      content = req.param('content'),
      userId = req.param('user_id'),
      categoryId = req.param('category_id'),
      postId = req.params.id;

    if (!postId) return res.badRequest({ err: 'post id is missing' });

    let post = {};

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    if (userId) {
      post.user = userId;
    }
    if (categoryId) {
      post.category = categoryId
    }

    Post.update({ id: postId }, post)
      .then(_post => {

        if (!_post[0] || _post[0].length === 0) return res.notFound({ err: 'No post found' });

        return res.ok(_post);

      }).catch(err => res.serverError(err));  
  }
};

