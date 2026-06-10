<template>
    <div class="container py-4">

        <h2>📊 Dashboard</h2>

        <div class="mb-3">
            <button class="btn btn-primary me-2" @click="fetchStock">
                Refresh
            </button>

            <button class="btn btn-danger" @click="resetStock">
                Reset
            </button>
        </div>

        <div class="row">
            <div class="col-md-3 mb-3" v-for="item in stock" :key="item.id">
                <div class="card p-3 text-center shadow">
                    <h6>{{ item.name }}</h6>

                    <h2 :class="item.remain <= 5 ? 'text-danger' : 'text-success'">
                        {{ item.remain }}
                    </h2>

                    <div class="progress mt-2">
                        <div class="progress-bar" :class="item.remain <= 5 ? 'bg-danger' : 'bg-success'"
                            :style="{ width: getPercent(item) + '%' }">
                        </div>
                    </div>

                    <small class="text-muted">
                        ใช้ไป {{ (item.total || 500) - item.remain }} ชิ้น
                    </small>

                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import { mockStock, mockReset } from '@/mock/mock-spin'

// ✅ toggle
const USE_MOCK = true

export default {
    data() {
        return {
            eventDay: 1,
            stock: [],
            interval: null // ✅ กัน memory leak
        }
    },
    watch: {
        stock: {
            handler(newVal) {
                newVal.forEach(item => {
                    if (item.remain === 0) {
                        console.warn('ของหมด:', item.name)
                    }
                })
            },
            deep: true
        }
    },

    mounted() {
        this.fetchStock()

        // realtime
        this.interval = setInterval(this.fetchStock, 3000)
    },

    beforeDestroy() {
        // ✅ สำคัญมาก (กัน setInterval ค้าง)
        clearInterval(this.interval)
    },

    methods: {
        async fetchStock() {
            try {
                if (USE_MOCK) {
                    this.stock = await mockStock()
                } else {
                    const res = await fetch(`/api/spin/stock?event_day=${this.eventDay}`)
                    this.stock = await res.json()
                }
            } catch (err) {
                console.error('fetchStock error:', err)
            }
        },

        async resetStock() {
            if (!confirm('Reset stock ?')) return

            if (USE_MOCK) {
                mockReset()
                this.fetchStock()
            } else {
                await fetch('/api/spin/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_day: this.eventDay })
                })

                this.fetchStock()
            }
        },

        // ✅ กัน total undefined
        getPercent(item) {
            const total = item.total || 500 // fallback
            return (item.remain / total) * 100
        }
    }
}
</script>