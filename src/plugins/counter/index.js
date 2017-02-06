export default function counterPlugin (context) {
  context.on('increment', (opts) => {
    console.log('increment', opts)
    opts.nextState.count++
    return opts
  })
  context.on('decrement', (opts) => {
    opts.nextState.count--
    return opts
  })
  context.on('*', (opts) => {
    console.log('Event :', opts.event)
    console.log('Opts :', opts)
    return opts
  })
  context.on('store', () => {

  })
}
