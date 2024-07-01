const {explorerGetController, singlePostGetController, explorerGetCategoryController, explorerGetAllCategoryController} = require('../controllers/explorerController')
const router = require('express').Router()

router.get('/:postId', singlePostGetController)
router.get('/getallCategory/all', explorerGetAllCategoryController )
router.get('/', explorerGetController)
// get post by category
router.get('/category/:categoryId', explorerGetCategoryController)

module.exports = router