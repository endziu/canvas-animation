const raf = require('./raf')()
const particle = require('./particle')
const vector = require('./vector')
const utils = require('./utils')

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let width
let height
let index = 0
let particles = []
let numMasses = 0
let masses = []
let repulsions = []
let numRepuls = 0
const numParticles = 45
const c = {
  c1: 'rgba(255, 30, 40, 0.25)',
  c2: 'rgba(0, 0, 0, 0.25)',
  c3: 'rgba(0, 0, 0, 0.25)',
  c4: 'rgba(30, 255, 40, 0.25)'
}

function init () {
  canvas.oncontextmenu = function (e) {
    e.preventDefault()
  }
  if (canvas && canvas.getContext) {
    context.globalCompositeOperation = 'destination-over'
    window.addEventListener('mousedown', mouseDownHandler, false)
    window.addEventListener('resize', windowResizeHandler, false)
    windowResizeHandler()
    createParticles()
    update()
  }
}


function update () {
  context.clearRect(0, 0, width, height)
  for (var i = 0; i < numMasses; i++) {
    var m = masses[i]
    m.update()
    drawCircle(m, c.c1)
  }
  for (var i = 0; i < numRepuls; i++) {
    var r = repulsions[i]
    r.update()
    drawCircle(r, c.c4)
  }
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i]
    p.update()
    wrapBounds(p)
    drawCircle(p, c.c2)
    for (var j = particles.length - 1; j >= 0; j--) {
      var pp = particles[j]
      if (i != j) {
        var dist = utils.distance(p, pp)
        if (dist < (window.innerWidth / 6) && dist > 6) {
          drawLine(p, pp, c.c3)
        }
      }
    };
  }
  window.requestAnimationFrame(update)
}

function createParticles () {
  for (var i = 0; i < numParticles; i++) {
    var p = particle.create(
			utils.randomRange(50, width - 50),
			utils.randomRange(50, height - 50),
			utils.randomRange(0.1, 0.5),
			utils.randomRange(0, 2 * Math.PI)
		)
    p.radius = 8
    p.friction = 1
    particles.push(p)
  }
}

function mouseDownHandler (event) {
  console.log(index)
  var x = event.clientX - canvas.offsetLeft
  var y = event.clientY - canvas.offsetTop
  if (index < 10) {
    if (event.button == 0) {
      index++
      var m = particle.create(x, y, 0, 0)
      m.mass = 30
      m.radius = 5
      numMasses += 1
      masses.push(m)
      for (var i = 0; i < numParticles; i++) {
        particles[i].addGravitation(m)
      }
    }

    if (event.button == 2) {
      index++
      var r = particle.create(x, y, 0, 0)
      r.mass = 80
      r.radius = 5
      numRepuls += 1
      repulsions.push(r)
      for (var i = 0; i < numParticles; i++) {
        particles[i].addRepulsion(r)
      }
    }
  }
}

function drawCircle (p, color) {
  context.fillStyle = color
  context.beginPath()
  context.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false)
  context.fill()
}

function drawLine (p1, p2, color) {
  context.beginPath()
  context.moveTo(p1.x, p1.y)
  context.lineTo(p2.x, p2.y)
  context.strokeStyle = color
  context.stroke()
}

function wrapBounds (p) {
  if (p.x < 0) p.x = width
  if (p.x > width) p.x = 0
  if (p.y < 0) p.y = height
  if (p.y > height) p.y = 0
}

function windowResizeHandler () {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

init()
