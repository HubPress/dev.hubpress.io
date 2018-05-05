import _ from 'lodash'
import uuid from 'node-uuid'
import * as loki from 'lokijs'
import * as LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'

let db

export function lokijsPlugin(hubpress) {
    hubpress.on('hubpress:request-local-synchronization', opts => {
        console.info('lokijsPlugin - hubpress:request-local-synchronization')
        console.log('lokijsPlugin - hubpress:request-local-synchronization', opts)

        const contentCollection = db.getCollection('content')

        const posts = opts.nextState.posts || []
        opts.nextState.posts = posts.map(post => {
            post.type = post.type || 'post'
            const savedContent = contentCollection.findOne({
                'original.name': post.name
            })
            let returnedPost
            if (!savedContent) {
                console.log('lokijsPlugin - post not found', post.name)
                post._id = uuid.v4()
                returnedPost = contentCollection.insert(post)
            } else {
                console.log('lokijsPlugin - post found', post.name)
                if (
                    (savedContent.original &&
                        savedContent.original.content !== post.content) ||
                    savedContent.published !== post.published
                ) {
                    console.log('lokijsPlugin - post have changed', post.name)
                    post.$loki = savedContent.$loki
                    post.meta = savedContent.meta
                    returnedPost = contentCollection.update(post)
                }
                else {
                    console.log('lokijsPlugin - post have not changed', post.name)
                    returnedPost = savedContent
                }
            }
            db.saveDatabase()
            return returnedPost
        })


        return opts
    })
    hubpress.on('application:receive-config', opts => {
        console.info('lokijsPlugin - application:receive-config')
        console.log('lokijsPlugin - application:receive-config', opts)

        if (db) return opts
        const idbAdapter = new LokiIndexedAdapter('hubpress');
        console.log('lokijs indexed', idbAdapter)
        db = new loki(
            'hubpress-' +
            opts.nextState.config.meta.username +
            '-' +
            opts.nextState.config.meta.repositoryName, {
                adapter: idbAdapter
            }
        )

        db.loadDatabase()
        if (!db.getCollection('content')) {
            db.addCollection('content', {
                unique: ['name']
            })
        }
        window.lokiDb = db

        return opts
    })
    hubpress.on('hubpress:request-local-posts', opts => {
        console.info('lokijsPlugin - hubpress:request-local-posts')
        console.log('lokijsPlugin - hubpress:request-local-posts', opts)
        const contentCollection = db.getCollection('content')
        const savedPosts = contentCollection.chain()
        .find({
            // type: 'post'
        })
        .simplesort('name', {
            desc: true
        })
        .data()

        opts.nextState.posts = savedPosts
        return opts
    })
    hubpress.on('requestSelectedPost', opts => {
        console.info('lokijsPlugin - requestSelectedPost')
        console.log('lokijsPlugin - requestSelectedPost', opts)
        const contentCollection = db.getCollection('content')
        const selectedPost = contentCollection.findOne({
            _id: opts.data.post._id
        })

        opts.data.selectedPost = selectedPost
        return opts
    })
    hubpress.on('hubpress:request-local-post', opts => {
        console.info('lokijsPlugin - hubpress:request-local-post')
        console.log('lokijsPlugin - hubpress:request-local-post', opts)
        const contentCollection = db.getCollection('content')
        const selectedPost = contentCollection.findOne({
            _id: opts.nextState.post._id
        })

        if (selectedPost) {
            opts.nextState.post = selectedPost
        } else {
            opts.nextState.post = {
                _id: opts.nextState.post._id,
            }
        }

        return opts
    })
    hubpress.on('requestSaveLocalPost', opts => {
        console.info('lokijsPlugin - requestSaveLocalPost')
        console.log('lokijsPlugin - requestSaveLocalPost', opts)
        const contentCollection = db.getCollection('content')
        const existingPostWithName = contentCollection.findOne({
            _id: {
                $ne: opts.nextState.post._id
            },
            name: opts.nextState.post.name,
        })

        if (existingPostWithName) {
            throw new Error(
                `Post with the name ${opts.nextState.post.name} already exist`,
            )
        }
        const currentSavedPost = contentCollection.findOne({
            _id: opts.nextState.post._id
        })
        if (currentSavedPost) {
            const mergedPost = Object.assign(currentSavedPost, opts.nextState.post)
            mergedPost.type = opts.nextState.post.type || currentSavedPost.type || 'post'
            opts.nextState.post = contentCollection.update(mergedPost)
        } else {
            opts.nextState.post = contentCollection.insert(opts.nextState.post)
        }
        db.saveDatabase()

        return opts
    })
    hubpress.on('requestLocalPublishedPosts', opts => {
        console.info('lokijsPlugin - requestLocalPublishedPosts')
        console.log('lokijsPlugin - requestLocalPublishedPosts', opts)
        const contentCollection = db.getCollection('content')
        const publishedPosts = contentCollection.chain()
        .find({
            'original.name': {$ne: null},
            published: { $eq: 1 },
            type: { $eq: 'post' }
        })
        .simplesort('name', {
            desc: true
        })
        .data()
        opts.nextState.publishedPosts = publishedPosts
        return opts
    })
    hubpress.on('requestLocalPublishedPages', opts => {
        console.info('lokijsPlugin - requestLocalPublishedPages')
        console.log('lokijsPlugin - requestLocalPublishedPages', opts)
        const contentCollection = db.getCollection('content')
        const publishedPages = contentCollection.chain()
        .find({
            'original.name': {$ne: null},
            published: { $eq: 1 },
            type: { $eq: 'page' }
        })
        .simplesort('name', {
            desc: true
        })
        .data()
        opts.nextState.publishedPages = publishedPages
        return opts
    })
    hubpress.on('requestDeleteLocalPost', opts => {
        console.info('lokijsPlugin - requestDeleteLocalPost')
        console.log('lokijsPlugin - requestDeleteLocalPost', opts)
        const contentCollection = db.getCollection('content')
        contentCollection.findAndRemove({
            _id: opts.nextState.post._id
        })
        db.saveDatabase()

        return opts
    })

    return {
        getName: () => 'lokijsPlugin'
    }
}
