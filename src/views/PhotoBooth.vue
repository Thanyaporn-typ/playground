<template>
    <div class="booth">

        <!-- START -->
        <div v-if="step === 'start'" class="center">
            <button class="main-btn" @click="step = 'frame'">
                เริ่มถ่าย
            </button>
        </div>

        <!-- FRAME SELECT -->
        <div v-if="step === 'frame'" class="center ">
            <img src="@/assets/images/frames/icon-photo-boot.png" class="icon intro-pop" />
            <div class="mb-2">
                <h3>เลือกเฟรมที่ต้องการ</h3>
            </div>

            <div class="frame-list intro-zoom">
                <img v-for="f in frames" :key="f" :src="f" :class="{ active: selectedFrame === f }"
                    @click="selectedFrame = f" />
            </div>
            <div class="btn-row intro-up">
                <button class="main-btn" :disabled="!selectedFrame" @click="startCamera">
                    START
                </button>

                <label class="main-btn upload-btn" :class="{ disabled: !selectedFrame }">
                    เลือกรูปจากเครื่อง
                    <input type="file" accept="image/*" @change="handleUpload" hidden />
                </label>
            </div>

        </div>

        <!-- CAMERA -->
        <div v-show="step === 'camera'" class="camera">
            <img src="@/assets/images/frames/icon-photo-boot.png" class="img-fluid icon" />

            <video class="mirrored" ref="video" playsinline webkit-playsinline muted :class="{ mirrored: facingMode === 'user' }"></video>


            <div class="flash" v-if="flash"></div>

            <div class="camera-actions">
                <button class="switch-btn" @click="switchCamera" type="button">
                    <i class="bi bi-arrow-repeat"></i>
                </button>

                <button class="capture-btn" @click="capture">
                    <i class="bi bi-camera-fill"></i>
                </button>
            </div>

        </div>

        <!-- PREVIEW -->
        <div v-if="step === 'preview'" class="preview">
            <img src="@/assets/images/frames/icon-photo-boot.png" class="icon intro-pop" />

            <img :src="finalUrl" class="result-img bounce-in" />

            <div class="preview-actions intro-up">
                <button class="main-btn m-1" @click="shareImage">แชร์</button>
                <button class="main-btn m-1" @click="downloadImage">ดาวน์โหลด</button>
                <button class="main-btn m-1" @click="resetBooth">ถ่ายใหม่</button>
            </div>
        </div>


        <canvas ref="canvas" style="display:none;"></canvas>
        <!-- <audio ref="shutter" src="/shutter.mp3"></audio> -->


        <div v-if="showToast" class="download-toast">
            ดาวน์โหลดสำเร็จแล้ว
        </div>


    </div>
</template>
  
<script>
export default {
    data() {
        return {
            step: "frame",
            frames: [
                require("@/assets/images/frames/frame-01.png"),
                require("@/assets/images/frames/frame-02.png"),
                require("@/assets/images/frames/frame-03.png"),
                require("@/assets/images/frames/frame-04.png"),

                // require("@/assets/frames/frameB.png"),
            ],
            selectedFrame: null,
            showToast: false,
            stream: null,
            finalBlob: null,
            finalUrl: null,
            flash: false,
            facingMode: "environment",
        };
    },

    beforeDestroy() {
        this.stopCamera();
    },

    methods: {
        async startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: this.facingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    },
                    audio: false
                });

                this.stream = stream;

                // แสดง camera ก่อน
                this.step = "camera";

                // รอ DOM render
                await this.$nextTick();

                const video = this.$refs.video;

                // bind stream
                video.srcObject = stream;

                // รอให้ video พร้อม
                await new Promise((resolve) => {
                    video.onloadedmetadata = () => resolve();
                });

                await video.play();
                console.log(video.videoWidth, video.videoHeight);


            } catch (err) {
                console.error(err.name, err.message);
                alert("เปิดกล้องไม่สำเร็จ");
            }
        }

        ,

        stopCamera() {
            if (this.stream) {
                this.stream.getTracks().forEach(t => t.stop());
                this.stream = null;
            }
        },

        async capture() {
            const video = this.$refs.video;
            if (!video.videoWidth) return;

            this.flash = true;
            setTimeout(() => (this.flash = false), 150);

            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");

            const W = 2160;
            const H = 2700;

            canvas.width = W;
            canvas.height = H;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            const vw = video.videoWidth;
            const vh = video.videoHeight;

            const canvasRatio = W / H;
            const videoRatio = vw / vh;

            let sx = 0;
            let sy = 0;
            let sw = vw;
            let sh = vh;

            // 🎯 ใช้สูตรเดียวกับ object-fit: cover (ตรงกับ preview)
            if (videoRatio > canvasRatio) {
                sw = vh * canvasRatio;
                sx = (vw - sw) / 2;
            } else {
                sh = vw / canvasRatio;
                sy = (vh - sh) / 2;
            }

            // ⭐ mirror แบบเสถียรกว่า (เหมือน iPhone)
            if (this.facingMode === "user") {
                ctx.save();
                ctx.translate(W, 0);   // เลื่อนไปขวาก่อน
                ctx.scale(-1, 1);      // แล้วค่อยกลับด้าน
                ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
                ctx.restore();
            } else {
                ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
            }

            const frameImg = await this.loadImg(this.selectedFrame);
            ctx.drawImage(frameImg, 0, 0, W, H);

            const blob = await new Promise((res) =>
                canvas.toBlob(res, "image/jpeg", 0.95)
            );

            this.finalBlob = blob;
            this.finalUrl = URL.createObjectURL(blob);

            this.stopCamera();
            this.step = "preview";
        }


        ,

        loadImg(src) {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = src;
            });
        },

        async shareImage() {
            const file = new File([this.finalBlob], "photo.jpg", {
                type: "image/jpeg"
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            }
        },

        downloadImage() {
            const a = document.createElement("a");
            a.href = this.finalUrl;
            a.download = "photo.jpg";
            a.click();

            // ⭐ แสดงแจ้งเตือน
            this.showToast = true;

            setTimeout(() => {
                this.showToast = false;
            }, 2000);
        },

        resetBooth() {
            this.finalUrl = null;
            this.finalBlob = null;
            this.selectedFrame = null;
            this.step = "frame";
        },
        async handleUpload(event) {
            if (!this.selectedFrame) return;

            const file = event.target.files[0];
            if (!file) return;

            const img = await this.loadImg(URL.createObjectURL(file));

            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");

            const W = 2160;
            const H = 2700;

            canvas.width = W;
            canvas.height = H;

            // ✅ ครอปภาพให้เป็น 4:5 แบบไม่ยืด
            const iw = img.width;
            const ih = img.height;

            const targetRatio = 4 / 5;
            const imgRatio = iw / ih;

            let sx, sy, sw, sh;

            if (imgRatio > targetRatio) {
                sh = ih;
                sw = ih * targetRatio;
                sx = (iw - sw) / 2;
                sy = 0;
            } else {
                sw = iw;
                sh = iw / targetRatio;
                sx = 0;
                sy = (ih - sh) / 2;
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

            // ใส่เฟรม
            const frameImg = await this.loadImg(this.selectedFrame);
            ctx.drawImage(frameImg, 0, 0, W, H);

            const blob = await new Promise(res =>
                canvas.toBlob(res, "image/jpeg", 0.95)
            );

            this.finalBlob = blob;
            this.finalUrl = URL.createObjectURL(blob);

            this.step = "preview";
        },
        async switchCamera() {
            // สลับค่า
            this.facingMode = this.facingMode === "user" ? "environment" : "user";

            // ปิดของเดิมก่อน
            this.stopCamera();

            // เปิดใหม่ด้วยกล้องที่สลับ
            await this.startCamera();
        }


    }
};
</script>
  
<style scoped>
.booth {
    min-height: 100vh;
    background: #000;
    color: #fff;
    overflow: hidden;
}

/* ---------- screens ---------- */

.center {
    min-height: 100vh;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    text-align: center;

    /* 👇 ใส่รูปพื้นหลัง */
    background-image: url('@/assets/images/frames/bg-photo-boot.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

h3 {
    font-size: 20px;
    margin-bottom: 8px;
}

/* ---------- buttons ---------- */

.main-btn {
    padding: 14px 28px;
    border-radius: 999px;
    background: #ffffff;
    border: none;
    color: #e87d2f;
    font-size: 16px;
    font-weight: 600;
}

.main-btn:disabled {
    opacity: 0.5;
}

/* ---------- frame list ---------- */

.frame-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* ⭐ Desktop 4 ช่อง */
    gap: 24px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}

/* Tablet */
/* @media (max-width: 992px) {
    .frame-list {
        grid-template-columns: repeat(3, 1fr);
    }
} */

/* Mobile */
@media (max-width: 768px) {
    .frame-list {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

.frame-list img {
    width: 100%;
    /* aspect-ratio: 4 / 5; */
    object-fit: cover;
    border-radius: 14px;
    background: #fff;
    cursor: pointer;
    transition: 0.25s ease;
    box-shadow: 0 6px 14px rgba(0, 0, 0, .12);
}


@media (max-width: 360px) {
    .frame-list {
        gap: 10px;
    }
}

/* hover */
.frame-list img:hover {
    opacity: 1;
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.25);
}

/* เลือกแล้ว */
.frame-list img.active {
    opacity: 1;
    transform: scale(1.12);
    z-index: 2;

    box-shadow:
        0 0 0 4px #fff,
        0 0 0 10px rgba(232, 125, 47, 0.25),
        0 15px 35px rgba(0, 0, 0, .35);
}



/* ---------- camera ---------- */

.camera {
    position: relative;
    height: 100vh;
    /* ⭐ ใช้ height แทน min-height */
    overflow: hidden;
    /* ⭐ กัน scroll */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background-image: url('@/assets/images/frames/bg-photo-boot.png');
}

/* ✅ กล้องเป็นกรอบ 4:5 กลางจอ */
video {
    width: min(92vw, 420px);
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: 17px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* ---------- capture button ---------- */

.capture-btn {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #e9e9e9;
    border: 12px solid rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    color: #000;
    z-index: 2;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
}


/* ---------- flash ---------- */

.flash {
    position: absolute;
    inset: 0;
    background: #fff;
    opacity: 0.8;
    animation: fade 0.15s forwards;
}

@keyframes fade {
    to {
        opacity: 0;
    }
}

/* ---------- preview ---------- */

.preview {
    min-height: 100vh;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    background-image: url('@/assets/images/frames/bg-photo-boot.png');
    justify-content: center;

}

.preview .result-img {
    width: min(92vw, 420px);
    height: auto;
    border-radius: 17px;

    box-shadow:
        0 0 0 4px rgba(255, 255, 255, 0.9),
        /* ขอบขาว */
        0 0 35px rgba(232, 125, 47, 0.45),
        /* glow สีแบรนด์ */
        0 30px 70px rgba(0, 0, 0, 0.55);
    /* เงาลึก */
}

.preview .icon {
    width: min(70vw, 280px);
    height: auto;
    display: block;
}

.btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.btn-group button {
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    background: #222;
    color: white;
}



.upload-btn.disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* default (frame / camera) */
.icon {
    width: min(52vw, 190px);
    height: auto;
    display: block;
}

/* preview ให้เล็กลงอีก */
.preview .icon {
    width: min(42vw, 150px);
}

.switch-btn {
    position: absolute;
    right: -80px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #8b3e12;
    color: #fff;
    border: none;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .35);
    top: 40px;
}

.preview-actions {
    display: flex;
    /* gap: 10px;                 */
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;           /* กันล้นจอเล็ก */
}

/* ⭐ Desktop */
.preview-actions .main-btn {
    padding: 12px 18px;
    font-size: 16px;
    white-space: nowrap;
}

/* ⭐ Mobile */
@media (max-width: 768px) {
    .preview-actions .main-btn {
        flex: 1;               /* แบ่งเท่ากัน */
        padding: 10px 8px;
        font-size: 14px;
    }
}

/* ⭐ จอเล็กมาก */
@media (max-width: 380px) {
    .preview-actions .main-btn {
        font-size: 13px;
        padding: 8px 6px;
    }
}


.intro-pop {
    animation: popIn 0.45s cubic-bezier(.18, .89, .32, 1.28);
}

@keyframes popIn {
    0% {
        opacity: 0;
        transform: scale(0.7);
    }

    70% {
        transform: scale(1.08);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.intro-zoom {
    animation: zoomInSoft 0.35s ease-out;
}

@keyframes zoomInSoft {
    from {
        opacity: 0;
        transform: scale(0.92);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.intro-up {
    animation: fadeUpFast 0.35s ease-out;
}

@keyframes fadeUpFast {
    from {
        opacity: 0;
        transform: translateY(18px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bounce-in {
    animation: bounceInFast 0.45s ease;
}

@keyframes bounceInFast {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }

    60% {
        transform: scale(1.05);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.btn-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 20px;
}

/* ⭐ Desktop ปุ่มขนาดปกติ */
.btn-row .main-btn {
    padding: 12px 18px;
    font-size: 16px;
    white-space: nowrap;
}

/* ⭐ Mobile เท่านั้น */
@media (max-width: 768px) {
    .btn-row .main-btn {
        flex: 1;              /* แบ่งพื้นที่เท่ากัน */
        padding: 10px 8px;
        font-size: 14px;
    }
}

@media (max-width: 380px) {
    .btn-row .main-btn {
        font-size: 13px;
        padding: 8px 6px;
    }
}


.download-toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e1e1e;
    color: #fff;
    padding: 12px 22px;
    border-radius: 999px;
    font-size: 14px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    animation: toastPop 0.3s ease;
    z-index: 999;
}

@keyframes toastPop {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* ⭐ ปุ่มรวม */
.camera-actions {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
}

video.mirrored {
    transform: scaleX(-1);
}
</style>
  