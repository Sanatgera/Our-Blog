const moment = require('moment')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const Flash = require('../utils/Flash')
const Category = require('../models/Category')

function genDate(days) {
    const date = moment().subtract(days, 'days')
    // above code substract days from cureent time
    return date.toDate()
}

function generateFilterObject(filter) {
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week': {
            filterObj: {
                createdAt: {
                    $gt: genDate(7)
                }
            }
            order = -1
            break
        }

        case 'month': {
            filterObj: {
                createdAt: {
                    $gt: genDate(30)
                }
            }
            order = -1
            break
        }

        case 'all': {
            order = -1
            break
        }
    }

    return {
        filterObj,
        order
    }
}

exports.explorerGetController = async (req, res, next) => {

    const filter = req.query.filter || 'latest'
    const currentPage = parseInt(req.query.page) || 1
    const itemPerPage = 6

    const { filterObj, order } = generateFilterObject(filter.toLowerCase())

    try {
        const posts = await Post.find(filterObj)
            .populate('author', 'username')
            .populate('category', 'name')
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            // sort method will not work for latest because by default it sort from latest to oldest
            .skip((currentPage * itemPerPage) - itemPerPage)
            // skip will skip the number of post
            .limit(itemPerPage)

        const totalPost = await Post.countDocuments()
        const totalPage = totalPost / itemPerPage

        let bookmarks = []

        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore All Post',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            currentPage,
            itemPerPage,
            totalPage,
            bookmarks
        })

    } catch (error) {
        next(error)
    }

}

exports.explorerGetAllCategoryController = async (req, res, next) => {
    console.log('get all category')
    const category = await Category.find()
    
    res.json(category)
}


exports.explorerGetCategoryController = async (req, res, next) => {
    const filter = req.query.filter || 'latest'
    const { categoryId } = req.params
    const currentPage = parseInt(req.query.page) || 1
    const itemPerPage = 6
    const { filterObj, order } = generateFilterObject(filter.toLowerCase())
    try {
        const posts = await Post.find({ category: categoryId })
            .populate('author', 'username')
            .populate('category', 'name')
            .skip((currentPage * itemPerPage) - itemPerPage)
            .limit(itemPerPage)

        const totalPost = await Post.countDocuments({ category: categoryId })
        const totalPage = totalPost / itemPerPage

        let bookmarks = []

        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore All Post',
            flashMessage: Flash.getMessage(req),
            filter,
            posts,
            currentPage,
            itemPerPage,
            totalPage,
            bookmarks
        })

    } catch (error) {
        next(error)
    }
}

exports.singlePostGetController = async (req, res, next) => {
    const {postId} = req.params

    try {
        const post = await Post.findById(postId)
            .populate('author', 'username profilePics')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePics'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'username profilePics'
                }
            })
            .populate('category', 'name')

        if(!post) {
            const error = new Error('404 page not found')
            error.status = 404
            throw error
        }

        let bookmarks = []

        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/single-page.ejs', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            bookmarks,
            post
        })
    } catch (error) {
        next(error)
    }
}