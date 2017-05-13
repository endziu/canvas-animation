const raf = require('./raf')()
const particle = require('./particle')
const vector = require('./vector')
const utils = require('./utils')
const { drawCircle, drawLine, wrapBounds } = require('./helpers')

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

let numParticles = parseInt(width / 10 ,10)
let maxDist = parseInt(width / 15, 10)

let particles = []

const init = () => {
  window.addEventListener('resize', windowResizeHandler, false)
  if (canvas && canvas.getContext) {
    context.globalCompositeOperation = 'destination-over'  
    canvas.oncontextmenu = function (e) {
      e.preventDefault()
    }
    createParticles(numParticles)
    update()
  }
}

const update = () => {
  context.clearRect(0, 0, width, height)
  particles.map(updateAndDraw)
  window.requestAnimationFrame(update)
}

const updateAndDraw = (current_particle, index, arr) => {
  wrapBounds(current_particle, width, height)
  current_particle.update()
  drawCircle(context, 2, current_particle)

  particles.forEach((item, i, arr) => {
    if (i > index - 1 && i < arr.length && item.distanceTo(current_particle) < maxDist) {
      const line_width = 5 - (current_particle.distanceTo(item) / maxDist) * 5
      drawLine(context, current_particle, item, line_width)
    }
  })
}

const createParticles = (numParticles) => {
  particles = []
  for (var i = 0; i < numParticles; i++) {
    var p = particle.create(
			utils.randomRange(50, width - 50),
			utils.randomRange(50, height - 50),
			utils.randomRange(0.5, 2.0),
			utils.randomRange(0, 2 * Math.PI)
		)
    p.friction = 1
    particles.push(p)
  }
}

function windowResizeHandler() {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  numParticles = parseInt(width / 10 ,10)
  maxDist = parseInt(width / 15, 10)
  createParticles(numParticles)
}

init()
