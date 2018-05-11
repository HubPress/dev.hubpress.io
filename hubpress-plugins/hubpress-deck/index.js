export function deckPlugin(hubpress) {

  hubpress.on('application:routes', opts => {
    console.info('hubpressPlugin - application:routes')
    console.log('hubpressPlugin - application:routes', opts)

    opts.nextState.routes.push({
      id: 'hubpress-deck',
      label: 'Hubpress Deck',
      entries: [
        {
          label: 'Decks',
          name: 'decks',
          path: 'decks',
          template: '<template><div>Test</div></template>',
        },
        // {
        //   name: 'deck',
        //   path: 'decks/:id',
        //   component: Post,
        // }
      ]
    })
    console.log('hubpressPlugin - application:routes - return', opts)
    return opts
  })

  return {
    getName: () => 'deckPlugin'
  }
}
