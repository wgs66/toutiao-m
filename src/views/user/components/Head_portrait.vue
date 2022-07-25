<template>
  <div>
    <div class="bgc">
      <img :src="photo" alt="" ref="img" class="photos" />
    </div>
    <span class="bottom-left" @click="isShow">取消</span>
    <span class="bottom-right" @click="confirm">确认</span>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhoto } from '@/api/user'
export default {
  data() {
    return {
      shows: true
    }
  },
  props: ['photo'],

  mounted() {
    const img = this.$refs.img

    this.myCropper = new Cropper(img, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    /*
      multipart/form-data
    */
    confirm() {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true
        })
        fm.append('photo', blob)
        try {
          await uploadPhoto(fm)
          this.$emit('succes')
        } catch (error) {
          const status = error.response.status
          if (status === 400) {
            throw new Error(error.response.data.message)
          } else if (status === 401) {
            throw new Error(error.response.data.message)
          } else if (status === 507) {
            throw new Error(error.response.data.message)
          } else {
            this.$toast.fail('请刷新重试！')
          }
        }
      })
    },
    isShow() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.bgc {
  position: fixed;
  left: 0;
  top: 20%;
}
.photos {
  width: 100%;
}
.bottom-left {
  color: #fff;
  position: fixed;
  left: 20px;
  bottom: 20px;
  font-size: 30px;
}
.bottom-right {
  color: #fff;
  position: fixed;
  right: 20px;
  bottom: 20px;

  font-size: 30px;
}
</style>
