const Libp2p = require('libp2p')
const IPFS = require('ipfs')
const WebRTCDirect = require('libp2p-webrtc-direct')
const Mplex = require('libp2p-mplex')
const {NOISE} = require('libp2p-noise')
const Bootstrap = require('libp2p-bootstrap')

const libp2pBundle = (opts) => {
  const peerId = opts.peerId

  return new Libp2p({
    peerId,
    modules: {
      transport: [WebRTCDirect],
      streamMuxer: [Mplex],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap]
    },
    config: {
      peerDiscovery: {
        [Bootstrap.tag]: {
          enabled: true,
          list: ['/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct/p2p/QmPj9ZZ6notLfV9khV1FtxH1Goe5sVaUyqgoXrTYQWp382']
        }
      }
    }
  })
}


async function main () {
  const node = await IPFS.create({
    repo: 'ipfs-' + Math.random(),
    libp2p: libp2pBundle
    // How to correctly set bootstrappers?
    // libp2p: (...args) => createLibp2p(...args, ['/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct/p2p/QmYdb3fr52UxH6evf9UnKY8YvvRrnskt9ULKuS2n69THz9']),
    // Bootstrap: ['/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct/p2p/QmYdb3fr52UxH6evf9UnKY8YvvRrnskt9ULKuS2n69THz9']
  })

  setInterval(async () => {
    try {
      const peers = await node.swarm.peers()
      console.log(`The node now has ${peers.length} peers.`)
      console.log(`peers: ${JSON.stringify(peers, null, 2)}`)
    } catch (err) {
      console.log('An error occurred trying to check our peers:', err)
    }
  }, 30000)
}

document.addEventListener('DOMContentLoaded', async () => {
  main()
})
