import Q from 'q'
import _ from 'lodash'
import uuid from 'node-uuid'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)

window.PouchDB = PouchDB

const TYPE_POST = 'post'
let db // = new PouchDB('hubpress');

export function pouchDbPlugin(hubpress) {
  hubpress.on('hubpress:request-local-synchronization', opts => {
    console.info('pouchDbPlugin - hubpress:request-local-synchronization')
    console.log('pouchDbPlugin - hubpress:request-local-synchronization', opts)
    const posts = opts.nextState.posts || []

    const postPromises = posts.map(post => {
      post.type = post.type || TYPE_POST
      return function getPost(completePosts = []) {
        const defer = Q.defer()
        delete post._links
        db
          .find({
            selector: {
              type: { $eq: post.type },
              'original.name': { $eq: post.name },
            },
            limit: 1,
          })
          .then(values => {
            console.log('POST find values', values)
            if (!values.docs.length) {
              console.log('pouchDbPlugin - post not found', post.name)
              post._id = uuid.v4()
              
              // Doc not found
              db
                .put(post)
                .then(result => {
                  post._rev = result.rev
                  completePosts.push(post)
                  defer.resolve(completePosts)
                })
                .catch(e => {
                  defer.reject(e)
                })
            } else {
              console.log('pouchDbPlugin - post found', post.name)
              const existingPost = values.docs[0]
              if (
                (existingPost.original &&
                  existingPost.original.content !== post.content) ||
                existingPost.published !== post.published
              ) {
                console.log('pouchDbPlugin - post have changed', post.name)
                post._id = existingPost._id
                post._rev = existingPost._rev
                
                db
                  .put(post)
                  .then(() => {
                    post._rev = existingPost._rev
                    completePosts.push(post)
                    defer.resolve(completePosts)
                  })
                  .catch(e => {
                    defer.reject(e)
                  })
              } else {
                console.log('pouchDbPlugin - post have not changed', post.name)
                post._id = existingPost._id
                post._rev = existingPost._rev
                // post.type = TYPE_POST
                completePosts.push(post)
                defer.resolve(completePosts)
              }
            }
          })

        return defer.promise
      }
    })

    const reducePromise = (postPromises || [])
      .reduce((memo, promise) => memo.then(promise), Q([]))

    const remotePostNames = posts.map(post => post.name)
    // Refresh posts which are not on the Remote repository
    const refreshLocalPosts = db
      .find({
        selector: {
          type: { $eq: TYPE_POST },
          'original.name': { $nin: remotePostNames },
        },
      })
      .then(values => {
        if (!values.docs.length) {
          return []
        } else {
          const posts = values.docs.map(doc =>
            _.pick(doc, [
              '_id',
              '_rev',
              'attributes',
              'content',
              'excerpt',
              'html',
              'name',
              'path',
              'title',
              'type',
              'url',
            ]),
          )
          // console.log('POUCHDB posts', posts);
          return db.bulkDocs(posts)
        }
      })

    return refreshLocalPosts.then(() => reducePromise).then(posts => {
      opts.nextState.posts = posts
      return opts
    })
  })

  hubpress.on('application:receive-config', opts => {
    console.info('pouchDbPlugin - application:receive-config')
    console.log('pouchDbPlugin - application:receive-config', opts)

    if (db) return opts

    db = new PouchDB(
      'hubpress-' +
        opts.nextState.config.meta.username +
        '-' +
        opts.nextState.config.meta.repositoryName,
    )

    db.info().then(data => {
      console.log('PouchDB infos', data)
    })

    return db
      .createIndex({
        index: { fields: ['name', 'type'] },
      })
      .then(() =>
        db.createIndex({
          index: { fields: ['type'] },
        }),
      )
      .then(() =>
        db.createIndex({
          index: { fields: ['original.name', 'type'] },
        }),
      )
      .then(() =>
        db.createIndex({
          index: { fields: ['published', 'type'] },
        }),
      )
      .then(() =>
        db.createIndex({
          index: { fields: ['original.name', 'published', 'type'] },
        }),
      )
      .then(() => opts)
  })

  hubpress.on('hubpress:request-local-posts', opts => {
    console.info('pouchDbPlugin - hubpress:request-local-posts')
    console.log('pouchDbPlugin - hubpress:request-local-posts', opts)

    return db
      .find({
        selector: { name: { $gt: null }, type: { $eq: TYPE_POST } },
        sort: [{ name: 'desc' }],
      })
      .then(posts => {
        opts.nextState = Object.assign({}, opts.nextState, {
          posts: posts.docs,
        })
        return opts
      })
  })

  hubpress.on('requestSelectedPost', opts => {
    console.info('pouchDbPlugin - requestSelectedPost')
    console.log('pouchDbPlugin - requestSelectedPost', opts)
    return db.get(opts.data.post._id).then(selectedPost => {
      const data = Object.assign({}, opts.data, { selectedPost })
      return Object.assign({}, opts, { data })
    })
  })

  hubpress.on('hubpress:request-local-post', opts => {
    console.info('pouchDbPlugin - hubpress:request-local-post')
    console.log('pouchDbPlugin - hubpress:request-local-post', opts)
    const defer = Q.defer()
    db
      .get(opts.nextState.post._id)
      .then(post => {
        opts.nextState = Object.assign({}, opts.nextState, { post })
        defer.resolve(opts)
      })
      .catch(e => {
        if (e.status === 404) {
          opts.nextState = Object.assign({}, opts.nextState, {
            post: {
              _id: opts.nextState.post._id,
            },
          })
          defer.resolve(opts)
        } else {
          defer.reject(e)
        }
      })
    return defer.promise
  })

  hubpress.on('requestSaveLocalPost', opts => {
    console.info('pouchDbPlugin - requestSaveLocalPost')
    console.log('pouchDbPlugin - requestSaveLocalPost', opts)
    const defer = Q.defer()

    db
      .find({
        selector: {
          _id: { $ne: opts.nextState.post._id },
          name: { $eq: opts.nextState.post.name },
          type: { $eq: TYPE_POST },
        },
        limit: 1,
      })
      .then(posts => {
        if (posts.docs.length) {
          throw new Error(
            `Post with the name ${opts.nextState.post.name} already exist`,
          )
        } else {
          return opts.nextState.post._id
        }
      })
      .then(id => db.get(id))
      .then(post => {
        // HERE
        const mergedPost = Object.assign({}, post, opts.nextState.post)
        mergedPost._rev = post._rev
        mergedPost.type = opts.nextState.post.type || post.type || TYPE_POST
        db
          .put(mergedPost)
          .then(result => {
            mergedPost._rev = result.rev
            opts.nextState.post = mergedPost
            defer.resolve(opts)
          })
          .catch(e => defer.reject(e))
      })
      .catch(e => {
        if (e.status === 404) {
          const docToSave = opts.nextState.post
          db
            .put(docToSave)
            .then(result => {
              docToSave._rev = result.rev
              opts.nextState.post = docToSave
              defer.resolve(opts)
            })
            .catch(e => defer.reject(e))
        } else {
          defer.reject(e)
        }
      })

    return defer.promise
  })

  hubpress.on('requestLocalPublishedPosts', opts => {
    console.info('pouchDbPlugin - requestLocalPublishedPosts')
    console.log('pouchDbPlugin - requestLocalPublishedPosts', opts)
    return db
      .find({
        selector: {
          'original.name': { $gt: null },
          published: { $eq: 1 },
          type: { $eq: TYPE_POST },
        },
        sort: [{ 'original.name': 'desc' }],
      })
      .then(result => {
        console.log('requestLocalPublishedPosts => ', result)
        opts.nextState.publishedPosts = result.docs
        return opts
      })
  })

  hubpress.on('requestDeleteLocalPost', opts => {
    console.info('pouchDbPlugin - requestDeleteLocalPost')
    console.log('pouchDbPlugin - requestDeleteLocalPost', opts)

    return db
      .remove(opts.nextState.post._id, opts.nextState.post._rev)
      .then(() => {
        return opts
      })
  })
}
