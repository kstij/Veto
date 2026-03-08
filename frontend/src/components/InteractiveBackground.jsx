import { useEffect, useRef } from 'react'

const PACKAGES = [
  { name: 'chalk@5.3.0', score: 84, grade: 'B' },
  { name: 'moment@2.29.4', score: 42, grade: 'D' },
  { name: 'express@4.18.0', score: 88, grade: 'A' },
  { name: 'lodash@4.17.21', score: 61, grade: 'C' },
  { name: 'left-pad@1.3.0', score: 18, grade: 'F' },
  { name: 'dayjs@1.11.0', score: 91, grade: 'A' },
  { name: 'vite@5.0.0', score: 88, grade: 'A' },
  { name: 'webpack@5.89.0', score: 69, grade: 'C' },
  { name: 'nanoid@5.0.0', score: 91, grade: 'A' },
  { name: 'got@13.0.0', score: 89, grade: 'A' },
  { name: 'request@2.88.2', score: 12, grade: 'F' },
  { name: 'commander@11.1.0', score: 84, grade: 'B' },
  { name: 'sass@1.69.0', score: 85, grade: 'A' },
  { name: 'node-sass@9.0.0', score: 31, grade: 'F' },
  { name: 'react@18.2.0', score: 74, grade: 'B' },
  { name: 'typescript@5.3.0', score: 75, grade: 'B' },
  { name: 'esbuild@0.19.0', score: 87, grade: 'A' },
  { name: 'colors@1.4.0', score: 22, grade: 'F' },
  { name: 'ink@4.4.1', score: 84, grade: 'B' },
  { name: 'es-toolkit@1.0.0', score: 93, grade: 'A' },
  { name: 'uuid@9.0.0', score: 78, grade: 'B' },
  { name: 'axios@1.6.0', score: 71, grade: 'C' },
  { name: 'zod@3.22.0', score: 92, grade: 'A' },
  { name: 'dotenv@16.3.0', score: 68, grade: 'C' },
  { name: 'prettier@3.1.0', score: 86, grade: 'A' },
]

const GRADE_COLORS = { A: '#4ECDC4', B: '#FFDE00', C: '#FF9F1C', D: '#FF6B6B', F: '#a06060' }
const CONNECT_DIST = 180
const NODE_OPACITY = 0.18
const LINE_OPACITY = 0.06

export default function InteractiveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let nodes = []

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      nodes = PACKAGES.map((pkg) => ({
        ...pkg,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 28 + Math.random() * 10,
      }))
    }

    init()
    window.addEventListener('resize', init)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connection lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = LINE_OPACITY * (1 - dist / CONNECT_DIST)
            ctx.beginPath()
            ctx.strokeStyle = GRADE_COLORS[nodes[i].grade]
            ctx.globalAlpha = alpha
            ctx.lineWidth = 1
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const color = GRADE_COLORS[node.grade]

        // Outer glow ring
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2)
        ctx.strokeStyle = color
        ctx.globalAlpha = NODE_OPACITY * 0.4
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Circle fill
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = NODE_OPACITY * 0.12
        ctx.fill()

        // Circle border
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.strokeStyle = color
        ctx.globalAlpha = NODE_OPACITY * 0.6
        ctx.lineWidth = 1
        ctx.stroke()

        // Grade label (center)
        ctx.font = 'bold 13px Space Mono, monospace'
        ctx.fillStyle = color
        ctx.globalAlpha = NODE_OPACITY * 1.2
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.grade, node.x, node.y)

        // Package name (below)
        ctx.font = '9px Space Mono, monospace'
        ctx.globalAlpha = NODE_OPACITY * 0.7
        ctx.fillText(node.name, node.x, node.y + node.r + 11)

        // Score (above)
        ctx.font = '9px Space Mono, monospace'
        ctx.globalAlpha = NODE_OPACITY * 0.5
        ctx.fillText(node.score + '/100', node.x, node.y - node.r - 7)

        // Move node
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < node.r || node.x > canvas.width - node.r) node.vx *= -1
        if (node.y < node.r || node.y > canvas.height - node.r) node.vy *= -1
      }

      ctx.globalAlpha = 1
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  )
}
