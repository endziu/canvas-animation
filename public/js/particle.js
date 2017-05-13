const utils = require('./utils')
const vector = require('./vector')
const { wrapBounds } = require('./helpers')

module.exports = {
  position: vector.create(0,0),
  velolcity: vector.create(0,0),
  friction: 1,

  create: function (x, y, speed, direction, grav) {
    var obj = Object.create(this)
		obj.position = vector.create(x, y)
		obj.velocity = vector.create(0, 0)
		obj.velocity.setLength(speed)
		obj.velocity.setAngle(direction)
    return obj
  },

  distanceTo: function (p2) {
		var dx = p2.position.getX() - this.position.getX(),
			  dy = p2.position.getY() - this.position.getY()
    return Math.sqrt(dx * dx + dy * dy)
  },

  gravitateTo: function (p2) {
    var dx = p2.x - this.x,
      dy = p2.y - this.y,
      distSQ = dx * dx + dy * dy,
      dist = utils.clamp(Math.sqrt(distSQ), 50, 500),
      force = p2.mass / distSQ,
      ax = dx / dist * force,
      ay = dy / dist * force

    this.vx += ax
    this.vy += ay
  },

  update: function () {
		this.velocity.multiplyBy(this.friction)
		this.position.addTo(this.velocity)
  }
}
