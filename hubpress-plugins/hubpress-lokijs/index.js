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

    hubpress.on('deck:request-local-synchronization', opts => {
        console.info('lokijsPlugin - deck:request-local-synchronization')
        console.log('lokijsPlugin - deck:request-local-synchronization', opts)

        const contentCollection = db.getCollection('content')

        const documents = opts.payload.documents || []
        opts.nextState.decks = documents.map(document => {
            document.type = document.type || opts.payload.defaultType
            const savedContent = contentCollection.findOne({
                'original.name': document.name
            })
            let returnedDocument
            if (!savedContent) {
                console.log(`lokijsPlugin - ${document.type} not found`, document.name)
                document._id = uuid.v4()
                returnedDocument = contentCollection.insert(document)
            } else {
                console.log(`lokijsPlugin - ${document.type} found`, document.name)
                if (
                    (savedContent.original &&
                        savedContent.original.content !== document.content) ||
                    savedContent.published !== document.published
                ) {
                    console.log(`lokijsPlugin - ${document.type} have changed`, document.name)
                    document.$loki = savedContent.$loki
                    document.meta = savedContent.meta
                    returnedDocument = contentCollection.update(document)
                }
                else {
                    console.log(`lokijsPlugin - ${document.type} have not changed`, document.name)
                    returnedDocument = savedContent
                }
            }
            db.saveDatabase()
            return returnedDocument
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
                unique: ['name', 'type']
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
            type: {
              $in: ['post', 'page']
            }
        })
        .simplesort('name', {
            desc: true
        })
        .data()

        opts.nextState.posts = savedPosts
        return opts
    })

    hubpress.on('deck:request-local-decks', opts => {
      console.info('lokijsPlugin - deck:request-local-decks')
      console.log('lokijsPlugin - deck:request-local-decks', opts)
      const contentCollection = db.getCollection('content')
      const savedDecks = contentCollection.chain()
      .find({
          type: 'deck'
      })
      .simplesort('name', {
          desc: true
      })
      .data()

      opts.nextState.decks = savedDecks
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
    hubpress.on('deck:request-local-deck', opts => {
        console.info('lokijsPlugin - deck:request-local-deck')
        console.log('lokijsPlugin - deck:request-local-deck', opts)
        const contentCollection = db.getCollection('content')
        const selectedPost = contentCollection.findOne({
            _id: opts.payload.deck._id
        })

        if (selectedPost) {
            opts.nextState.deck = selectedPost
        } else {
            opts.nextState.deck = {
                _id: opts.payload.deck._id,
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

    hubpress.on('deck:request-save-local-deck', opts => {
        console.info('lokijsPlugin - deck:request-save-local-deck')
        console.log('lokijsPlugin - deck:request-save-local-deck', opts)
        const contentCollection = db.getCollection('content')

        const existingPostWithName = contentCollection.findOne({
            _id: {
                $ne: opts.payload.deck._id
            },
            name: opts.payload.deck.name,
        })

        if (existingPostWithName) {
            throw new Error(
                `${opts.payload.deck.type} with the name ${opts.payload.deck.name} already exist`,
            )
        }
        const currentSavedDocument = contentCollection.findOne({
            _id: opts.payload.deck._id
        })
        if (currentSavedDocument) {
            const mergedDocument = Object.assign(currentSavedDocument, opts.payload.deck)
            mergedDocument.type = opts.nextState.deck.type || currentSavedDocument.type || 'deck'
            opts.nextState.deck = contentCollection.update(mergedDocument)
        } else {
            opts.nextState.deck = contentCollection.insert(opts.payload.deck)
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
    hubpress.on('deck:request-delete-local-deck', opts => {
        console.info('lokijsPlugin - deck:request-delete-local-deck')
        console.log('lokijsPlugin - deck:request-delete-local-deck', opts)
        const contentCollection = db.getCollection('content')
        contentCollection.findAndRemove({
            _id: opts.payload.deck._id
        })
        db.saveDatabase()

        return opts
    })
}
