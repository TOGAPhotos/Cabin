<script setup lang="ts">
import InfoLabel from '@/components/InfoLabel.vue';


</script>
<template>
    <div id="about-view">
        <div class="flex-row title">
            <h2>TOGA | 关于页面</h2>
            <InfoLabel class="inline" label="最后更新于" value="2024.10.12"/>
        </div>
        <div style="margin: 12px auto;">
            <p class="cn-content">
                TOGAPhotos是一个以航空摄影为主题的网站。
            </p>
        </div>
        <div>
            <h3 class="block-title">
                博客 | Blog
            </h3>
            <div>
                <p class="cn-content">
                    我们非常欢迎你来我们的博客逛一逛。除了记录网站的更新日志，我们也会在上面分享一些有趣的内容。
                    聊一聊TOGA未来的发展，分享一些团队的幕后故事。
                    希望你能通过博客更好地了解我们的项目，以及我们一路走来的成长和挑战。
                </p>
                <p class="cn-content">
                    <a href="https://blog.togaphotos.com">>>点击进入博客</a>
                </p>
            </div>
        </div>
        <div>
            <h3 class="block-title">
                隐私政策 | Privacy Policy
            </h3>
            <div>
                <p class="cn-content">
                    我们非常重视用户的隐私，我们的隐私政策会详细说明我们如何收集、使用、存储和保护用户的个人信息。
                    我们会尽最大努力保护用户的隐私，保护用户的个人信息不被泄露、滥用或篡改。
                </p>
                <p class="cn-content">
                    <a href="/privacy">>>查看隐私政策</a>
                </p>
            </div>
        </div>
        <div>
            <h3 class="block-title">
                服务条款 | Terms of Service
            </h3>
            <div>
                <p class="cn-content">
                    我们的服务条款会详细说明用户在使用我们的服务时需要遵守的规则和条款。
                    用户在使用我们的服务时，需要遵守我们的服务条款，否则我们有权终止用户的服务。
                </p>
                <p class="cn-content">
                    <a href="/privacy">>>查看服务条款</a>
                </p>
            </div>
        </div>
    </div>
</template>
<style scoped>
#about-view{
    max-width: 1000px;
}
.title{
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    text-wrap: nowrap;
}
h3.block-title{
    margin: 1.2rem 0 0 0;
}
.info-label{
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>