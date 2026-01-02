import NodeCache from 'node-cache'

export const cache = new NodeCache({
  deleteOnExpire: true,
  stdTTL: 43200 // 12 hours time to live
});