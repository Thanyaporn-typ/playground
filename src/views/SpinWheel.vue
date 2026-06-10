<template>
    <div class="spin-page">
        <div class="container py-5 text-center">
            <!-- <h2 class="mb-2">🎡 Lucky Spin</h2>
            <p class="text-muted mb-4">หมุนวงล้อลุ้นรับของรางวัล</p> -->

            <div class="wheel-wrap mx-auto">
                <div class="pointer"></div>

                <div class="wheel" :style="{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }">
                    <div v-for="(prize, index) in prizes" :key="prize.id" class="segment"
                        :style="getSegmentStyle(index, prize.color)">
                        <div class="segment-content" :style="getTextRotateStyle(index)">
                            <div class="segment-text">
                                <strong>{{ prize.shortName }}</strong>
                                <!-- <small>{{ prize.remaining }} รางวัล</small> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button class="spin-btn mt-4" :disabled="spinning || totalRemaining === 0" @click="spinWheel">
                {{ spinning ? 'กำลังหมุน...' : totalRemaining === 0 ? 'ของรางวัลหมดแล้ว' : 'หมุนวงล้อ' }}
            </button>

            <div v-if="result" class="result-box mt-4">
                <h4 class="mb-2">🎉 คุณได้รับ</h4>
                <div class="result-title">{{ result.name }}</div>
                <div class="result-sub">คงเหลือ {{ result.remaining }} รางวัล</div>
            </div>

            <div class="prize-list mt-5 text-start">
                <h5 class="mb-3">รายการของรางวัล</h5>
                <div v-for="prize in prizes" :key="prize.id" class="prize-item">
                    <div>
                        <div class="fw-bold">{{ prize.name }}</div>
                        <div class="text-muted small">จำนวนทั้งหมด {{ prize.total }} รางวัล</div>
                    </div>
                    <div class="remain-badge" :class="{ empty: prize.remaining === 0 }">
                        เหลือ {{ prize.remaining }}
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>
  
<script>
export default {
    name: "SpinWheel",
    data() {
        return {
            rotation: 0,
            spinning: false,
            result: null,
            prizes: [
                {
                    id: 1,
                    name: "LINE MAN VIP 3 month มูลค่า 1,000 บาท",
                    shortName: "LINE MAN\nVIP",
                    total: 500,
                    remaining: 500,
                    color: "#f46e0b"
                },
                {
                    id: 2,
                    name: "กระเป๋าผ้า Origin Pawrents",
                    shortName: "Origin\nBag",
                    total: 500,
                    remaining: 500,
                    color: "#ff8c42"
                },
                {
                    id: 3,
                    name: "Smart Pet Tracker 4G",
                    shortName: "Pet\nTracker",
                    total: 2,
                    remaining: 2,
                    color: "#ffd6b8"
                },
                {
                    id: 4,
                    name: "Smart Camera 4Pro AI & Cloud 3 months",
                    shortName: "Smart\nCamera",
                    total: 2,
                    remaining: 2,
                    color: "#fff1e8"
                }
            ]
        };
    },
    computed: {
        segmentAngle() {
            return 360 / this.prizes.length;
        },
        totalRemaining() {
            return this.prizes.reduce((sum, item) => sum + item.remaining, 0);
        }
    },
    methods: {
        getSegmentStyle(index, color) {
            const angle = this.segmentAngle;
            return {
                transform: `rotate(${index * angle}deg) skewY(${90 - angle}deg)`,
                background: color
            };
        },

        weightedRandomPrizeIndex() {
            const available = this.prizes
                .map((prize, index) => ({ ...prize, index }))
                .filter(item => item.remaining > 0);

            const total = available.reduce((sum, item) => sum + item.remaining, 0);
            let random = Math.floor(Math.random() * total);

            for (let i = 0; i < available.length; i++) {
                if (random < available[i].remaining) {
                    return available[i].index;
                }
                random -= available[i].remaining;
            }

            return available[0].index;
        },

        spinWheel() {
            if (this.spinning || this.totalRemaining === 0) return;

            this.spinning = true;
            this.result = null;

            const targetIndex = this.weightedRandomPrizeIndex();
            const fullSpins = 6;
            const anglePerSegment = this.segmentAngle;

            // pointer อยู่ด้านบน = 0deg
            // ต้องหมุนให้ "กลางช่องรางวัล" ไปอยู่ตรง pointer
            const targetAngle = 360 - (targetIndex * anglePerSegment + anglePerSegment / 2);

            // rotation สุดท้าย
            const finalRotation = this.rotation + fullSpins * 360 + targetAngle - (this.rotation % 360);

            this.rotation = finalRotation;

            setTimeout(() => {
                this.prizes[targetIndex].remaining -= 1;
                this.result = { ...this.prizes[targetIndex] };
                this.spinning = false;
            }, 5000);
        },
        getTextRotateStyle(index) {
            const angle = this.segmentAngle;
            return {
                transform: `rotate(${index * angle + angle / 2}deg)`
            };
        }
    }
};
</script>
  
<style scoped>
.spin-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fff 0%, #fff4ec 100%);
}

.wheel-wrap {
    position: relative;
    width: min(480px, 90vw);
    /* ขยายอัตโนมัติ */
    height: min(480px, 90vw);
}

.pointer {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
    border-top: 48px solid #f46e0b;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
    z-index: 5;
}

.wheel {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    border: 12px solid #fff;
    box-shadow:
        0 20px 50px rgba(244, 110, 11, 0.25),
        inset 0 0 20px rgba(255, 255, 255, 0.6);
    background: radial-gradient(circle, #fff 0%, #ffe9dc 100%);
    background: #eee;
}

.segment {
    position: absolute;
    width: 50%;
    height: 50%;
    top: 0;
    left: 50%;
    transform-origin: 0% 100%;
    border: 1px solid rgba(255, 255, 255, 0.45);
}

.segment-label {
    position: absolute;
    left: -12px;
    bottom: -115px;
    width: 130px;
    transform: skewY(-45deg) rotate(22deg);
    text-align: center;
    color: #222;
    font-size: 12px;
    line-height: 1.2;
}

.segment-label strong {
    display: block;
    font-size: 13px;
}

.segment-label small {
    display: block;
    margin-top: 4px;
    font-size: 11px;
}

.spin-btn {
    border: none;
    padding: 12px 28px;
    border-radius: 999px;
    background: linear-gradient(135deg, #f46e0b, #ff8c42);
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    box-shadow: 0 10px 25px rgba(244, 110, 11, 0.35);
    transition: all 0.25s ease;
    cursor: pointer;
}

.spin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(244,110,11,0.5);
}

.spin-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.result-box {
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.result-title {
    font-size: 20px;
    font-weight: 700;
    color: #f46e0b;
}

.result-sub {
    margin-top: 6px;
    color: #666;
}

.prize-list {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.prize-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    background: #fff;
    padding: 14px 16px;
    border-radius: 14px;
    margin-bottom: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.remain-badge {
    white-space: nowrap;
    font-weight: 700;
    background: #eef7ff;
    color: #1677ff;
    border-radius: 999px;
    padding: 8px 12px;
}

.remain-badge.empty {
    background: #fff1f0;
    color: #cf1322;
}

@media (max-width: 576px) {
    .wheel-wrap {
        width: 85vw;
        /* เต็มจอ */
        height: 85vw;
    }

    .segment-label {
        bottom: -102px;
        width: 110px;
        font-size: 11px;
    }

    .segment-label strong {
        font-size: 12px;
    }
}

.segment-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}

.segment-text {
    /* transform: translateY(-15%) rotate(-90deg); */
    width: clamp(90px, 20vw, 140px);
    /* ลดความกว้าง */
    text-align: center;

    font-size: 16px;
    font-weight: 600;
    color: #222;
    line-height: 1.2;

    word-break: break-word;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

    /* ตัดคำ */
}

.segment-text strong {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* แสดงแค่ 2 บรรทัด */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.segment-text small {
    display: block;
    margin-top: 4px;
    font-size: 10px;
}

.segment-text strong {
    white-space: pre-line;
}
</style>