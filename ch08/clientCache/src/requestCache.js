export default function requestCache(target) {
  target._cache = {};
  const Request = target.Request;

  Request.prototype._origin_end = Request.prototype.end;
  Request.prototype._end_wrapper = function(cb) {
    this._origin_end(cb);
  };
  Request.prototype.end = function(cb) {
    if (this.url in target._cache) {
      cb(null, target._cache[this.url]);
    } else
      this._end_wrapper((err, response) => {
        if (err) return cb(err);
        target._cache[this.url] = response;
        cb(err, response);
      });
  };
 
  return target;
}
