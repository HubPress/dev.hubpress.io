import Settings from './components/Settings'

export default function settingsPlugin (context) {
  context.on('application:routes', (opts) => {
    console.info('settingsPlugin - application:routes')
    console.log('settingsPlugin - application:routes', opts)

    opts.nextState.routes.push({
      label: 'Settings',
      path: 'settings',
      name: 'settings',
      component: Settings
    })
    console.log('settingsPlugin - application:routes - return', opts)
    return opts
  })
}
