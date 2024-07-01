const { dashboardGetController, createProfileGetController, createProfilePostController, editProfileGetController, DelCategoryGetController, editProfilePostController, bookmarksGetController, commentsGetController, getCategoryGetController, PostCategoryGetController } = require('../controllers/dashboardController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const profileValidator = require('../validator/dashboard/profileValidator')

const router = require('express').Router()


router.get('/addcategory', isAuthenticated, getCategoryGetController)
router.post('/addcategory', isAuthenticated, PostCategoryGetController)
router.post('/delcategory', isAuthenticated, DelCategoryGetController)
router.get('/bookmarks', isAuthenticated, bookmarksGetController)
router.get('/comments', isAuthenticated, commentsGetController)
router.get('/create-profile', isAuthenticated, createProfileGetController)
router.post('/create-profile', isAuthenticated, profileValidator, createProfilePostController)

router.get('/edit-profile', isAuthenticated, editProfileGetController)
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostController)
router.get('/', isAuthenticated, dashboardGetController)

module.exports = router