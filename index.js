var Couchbase = require("couchbase")

function CacherMemcached(cluster, bucket, opts) {
    if ( (!bucket) && (typeof cluster !== 'object') && (cluster.constructor.name !== 'Bucket') ) throw 'give me bucket object or info or already cluster.openBucket() return value';
    if ( (cluster) && (typeof cluster == 'string') ) cluster = new couchbase.Cluster(cluster);
    if ( (cluster) && (typeof cluster == 'object') && (!cluster.constructor.name == 'Cluster') && (!cluster.constructor.name == 'Bucket') ) cluster = new couchbase.Cluster(cluster);
    if ( (typeof cluster == 'object') && (cluster.constructor.name == 'Bucket') ) { 
        debug('cluster is a inited bucket')
        this.bucket = cluster
        return
    } else if ( (typeof bucket == 'object') && (!bucket.constructor.name == 'Bucket') ) {
        debug('init cluster')
        debug(typeof bucket, typeof cluster)
        if (!cluster) throw 'give me cluster object or info or already couchbase.cluster() return value';    
        else {
            if (Object.keys(bucket).length == 3) this.bucket = cluster.openBucket(bucket[0], bucket[1], bucket[2])
            if (Object.keys(bucket).length == 2) this.bucket = cluster.openBucket(bucket[0], bucket[1]) 
        }
        debug(cluster, this.bucket)
    } else if (typeof bucket == 'string') this.bucket = cluster.openBucket(bucket);
    else {
        // already got a bucket from a couchbase cluster
        debug('we got a bucket')
        this.bucket = bucket
    }
    // var model.bucket = model.bucket || bucket
    // debug('return', cluster, '\n##########################\n',model.bucket)
    // console.log(cluster.buckets)
    this.cluster = cluster
    return
}

CacherMemcached.prototype.get = function(key, cb) {
  this.client.get(key, cb)
}

CacherMemcached.prototype.set = function(key, cacheObject, ttl, cb) {
  cb = cb || function() {}
  this.client.upsert(key, cacheObject, ttl, cb)
}

CacherMemcached.prototype.invalidate = function(key, cb) {
  cb = cb || function() {}
  this.client.del(key, cb)
}

module.exports = CacherMemcached
