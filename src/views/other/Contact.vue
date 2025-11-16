<script setup lang="ts">
import ImgLoader from "@/components/ImgLoader.vue";
</script>

<template>
  <div id="contact-view" class="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
    <div class="flex items-center gap-4 mb-6">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">
        联系我们 | Contact us
      </h2>
    </div>

    <div class="my-6">
      <p class="text-base leading-7 text-slate-700">
        感谢您对TOGAPhotos的关注！如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们。
      </p>
    </div>

    <div class="my-8">
      <h3
        class="text-lg md:text-xl font-semibold text-[var(--color-toga)] mb-4"
      >
        联系方式 | Contact Information
      </h3>
      <div class="p-5 rounded-lg bg-gray-100/80">
        <p class="text-base leading-7 text-slate-700">
          <strong class="font-semibold text-slate-900">邮箱：</strong>
          <a
            class="text-[var(--color-toga)] hover:underline"
            href="mailto:contact@togaphotos.com"
            >support@togaphotos.com</a
          >
        </p>
        <p class="text-base leading-7 text-slate-700 mt-2">
          <strong class="font-semibold text-slate-900">博客：</strong>
          <a
            class="text-[var(--color-toga)] hover:underline"
            href="https://blog.togaphotos.com"
            target="_blank"
            >blog.togaphotos.com</a
          >
        </p>
        <div class="py-2">
          <el-tabs>
            <el-tab-pane label="小红书">
              <ImgLoader
                className="mx-auto mt-4 w-1/2 h-auto"
                src="https://cos-125-tp-cdn.794td.cn/assets/RedNote.webp"
                alt="TOGAPhotos小红书二维码"
              />
            </el-tab-pane>
            <el-tab-pane label="微博">
              <ImgLoader
                className="mx-auto mt-4 w-1/2 h-auto"
                src="https://cos-125-tp-cdn.794td.cn/assets/Weibo.webp"
                alt="TOGAPhotos微博二维码"
              />
            </el-tab-pane>
            <el-tab-pane label="抖音">
              <ImgLoader
                src="https://cos-125-tp-cdn.794td.cn/assets/Douyin.webp"
                className="mx-auto mt-4 w-1/2 h-auto"
                alt="TOGAPhotos抖音二维码"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <div class="my-8">
      <h3
        class="text-lg md:text-xl font-semibold text-[var(--color-toga)] mb-4"
      >
        常见问题 | FAQ
      </h3>
      <div class="space-y-5">
        <div class="border-2 border-[#409EFF]">
          <div class="py-4 px-6 bg-[#409EFF] text-white">
            <p class="font-semibold">我们需要多久才能回复您的信息？</p>
          </div>
          <div class="py-4 px-6">
            <p class="leading-7">
              TOGAPhotos是一个由志愿者维护的项目，我们无法对回复时间做出承诺。TOGAPhotos在收到您的消息后会尽快与您取得联系。通常情况下，我们会在3-5个工作日内回复您的邮件。如果您的问题紧急，请在邮件中注明，我们会优先处理。
            </p>
          </div>
        </div>
        <div class="border-2 border-[#67C23A]">
          <div class="py-4 px-6 bg-[#67C23A] text-white">
            <p class="font-semibold">我们欢迎哪些信息？</p>
          </div>
          <div class="py-4 px-6">
            <p class="leading-7">
              我们欢迎任何与TOGAPhotos相关的反馈、建议和合作意向，包括但不限于：
            </p>
            <ul class="list-disc list-inside mt-2">
              <li>网站功能改进建议</li>
              <li>上传和版权相关问题</li>
              <li>合作推广和媒体合作</li>
              <li>其他任何您认为有价值的信息</li>
            </ul>
          </div>
        </div>

        <div class="border-2 border-[#f14668]">
          <div class="py-4 px-6 bg-[#f14668] text-white">
            <p class="font-semibold">我们不欢迎哪些信息？</p>
          </div>
          <div class="py-4 px-6">
            <p class="leading-7">
              为了确保沟通的高效和有益，我们不欢迎以下类型的信息：
            </p>
            <ul class="list-disc list-inside mt-2">
              <li>与TOGAPhotos无关的内容</li>
              <li>重复提交的相同问题或建议</li>
              <li>包含不当语言或攻击性的内容</li>
              <li>垃圾邮件或广告性质的信息</li>
            </ul>
            <p class="leading-7 mt-2">
              我们保留不回复或删除含有上述内容的邮件或消息的权利。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
