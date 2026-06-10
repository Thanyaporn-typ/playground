// mock database (จำลอง server)
let mockPrizes = [
    { id: 1, name: 'LINE MAN VIP', remain: 500, total: 500 },
    { id: 2, name: 'Bag', remain: 500, total: 500 },
    { id: 3, name: 'Tracker', remain: 2, total: 2 },
    { id: 4, name: 'Camera', remain: 2, total: 2 }
  ]
  
  // random แบบ weighted (เหมือน backend)
  function getRandomPrize() {
    const available = mockPrizes.filter(p => p.remain > 0)
  
    const total = available.reduce((sum, p) => sum + p.remain, 0)
    let rand = Math.random() * total
  
    for (let p of available) {
      if (rand < p.remain) return p
      rand -= p.remain
    }
  }
  
  // 🎡 mock spin API
  export function mockSpin() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prize = getRandomPrize()
  
        if (!prize) {
          resolve({ success: false })
          return
        }
  
        // ลด stock เหมือน server
        prize.remain--
  
        resolve({
          success: true,
          prize: {
            id: prize.id,
            name: prize.name
          }
        })
      }, 500) // delay ให้เหมือน API
    })
  }
  
  // 📊 mock stock API
  export function mockStock() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPrizes])
      }, 300)
    })
  }
  
  // 🔄 reset
  export function mockReset() {
    mockPrizes = [
      { id: 1, name: 'LINE MAN VIP', remain: 500, total: 500 },
      { id: 2, name: 'Bag', remain: 500, total: 500 },
      { id: 3, name: 'Tracker', remain: 2, total: 2 },
      { id: 4, name: 'Camera', remain: 2, total: 2 }
    ]
  }