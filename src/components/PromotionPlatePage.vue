<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
defineProps<{ name: string; description: string; imageUrl: string | null }>();
const root = ref<HTMLElement | null>(null),
  showGuide = ref(false);
let observer: IntersectionObserver | undefined;
const promotionAssetBase = "https://static.itchensi.com/tagcode/promotion";
const scrollToStories = () =>
  document.querySelector("#stories")?.scrollIntoView({ behavior: "smooth" });
const stories = [
  {
    no: "01",
    kind: "pet",
    label: "宠物防走失",
    title: "给它一个码，\n多一条回家的路",
    copy: "好心人扫码即可查看你愿意公开的信息，在最需要的时候联系到你。",
    image: `${promotionAssetBase}/story-dog-v1.png`,
  },
  {
    no: "02",
    kind: "car",
    label: "临时挪车",
    title: "爱车有话说，\n联系更从容",
    copy: "不必把手机号码直接留在车外，扫码后按你的设置发起联系。",
    image: `${promotionAssetBase}/story-car-v1.png`,
  },
  {
    no: "03",
    kind: "luggage",
    label: "物品防丢",
    title: "背包和行李，\n也有自己的名片",
    copy: "内容可以随时更新，二维码不用反复更换，让每件重要物品都有迹可循。",
    image: `${promotionAssetBase}/story-luggage-v1.png`,
  },
];
onMounted(() => {
  observer = new IntersectionObserver(
    (es) =>
      es.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
    { threshold: 0.2 },
  );
  root.value?.querySelectorAll(".reveal").forEach((e) => observer?.observe(e));
});
onBeforeUnmount(() => observer?.disconnect());
</script>
<template>
  <main ref="root" class="story-page">
    <section class="hero">
      <div class="hero-bg"></div>
      <header>
        <img src="/images/mini-program-logo.png" alt="贴个码" />
        <div><strong>贴个码</strong><span>给生活里的东西，贴个码</span></div>
      </header>
      <div class="hero-copy">
        <small>小小一枚码 · 连接更大的安心</small>
        <h1>一个码，<br /><em>能有多大用？</em></h1>
        <p>让重要的信息，在需要的时候及时出现。</p>
      </div>
      <div class="stage">
        <div class="plate">
          <i></i><img src="/images/mini-program-logo.png" alt="" /><strong
            >贴个码</strong
          ><b>安心</b><small>扫一扫 · 找到重要的信息</small>
        </div>
        <img
          class="dog"
          :src="`${promotionAssetBase}/story-dog-v1.png`"
          alt="佩戴铭牌的小狗"
        /><img
          class="hero-car"
          :src="`${promotionAssetBase}/story-car-v1.png`"
          alt="贴有铭牌的汽车"
        />
      </div>
      <button class="more" @click="scrollToStories">
        <span>看看它能做什么</span><i class="arrow-down" aria-hidden="true"></i>
      </button>
    </section>
    <section
      id="stories"
      v-for="story in stories"
      :key="story.kind"
      :class="['scene', 'reveal', story.kind]"
    >
      <div>
        <span>{{ story.no }} · {{ story.label }}</span>
        <h2>{{ story.title }}</h2>
        <p>{{ story.copy }}</p>
      </div>
      <img :src="story.image" :alt="story.label" /><i
        v-if="story.kind === 'car'"
        >P</i
      ><b v-if="story.kind === 'pet'">扫一扫<br />帮我回家</b>
    </section>
    <section class="steps reveal">
      <small>简单三步</small>
      <h2>贴上它，就连接好了</h2>
      <ol>
        <li>
          <b>1</b>
          <div>
            <strong>创建信息</strong
            ><span>选择场景，自定义你愿意展示的内容</span>
          </div>
        </li>
        <li>
          <b>2</b>
          <div>
            <strong>贴上铭牌</strong
            ><span>宠物、汽车、背包和生活用品都可以</span>
          </div>
        </li>
        <li>
          <b>3</b>
          <div>
            <strong>扫码连接</strong><span>重要的信息，在关键时刻被看见</span>
          </div>
        </li>
      </ol>
    </section>
    <section v-if="imageUrl" class="poster reveal">
      <img :src="imageUrl" :alt="name" />
    </section>
    <footer class="reveal">
      <img src="/images/mini-program-logo.png" alt="" />
      <p>{{ description || "小小的码，让生活多一点安心。" }}</p>
      <button @click="showGuide = true">
        <span>打开小程序看看</span
        ><i class="arrow-right" aria-hidden="true"></i></button
      ><small>在微信中搜索“贴个码”</small>
    </footer>
    <div v-if="showGuide" class="guide" @click.self="showGuide = false">
      <div>
        <button
          class="guide-close"
          aria-label="关闭"
          @click="showGuide = false"
        >
          <i></i></button
        ><img src="/images/mini-program-logo.png" alt="贴个码" />
        <h2>打开微信小程序</h2>
        <p>请在微信中搜索“贴个码”，开始制作你的专属铭牌。</p>
        <strong>贴个码</strong>
      </div>
    </div>
  </main>
</template>
<style scoped>
.story-page {
  --orange: #f36b2b;
  --brown: #4a2518;
  width: min(100%, 480px);
  margin: auto;
  overflow: hidden;
  background: #fff9ed;
  color: var(--brown);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  box-shadow: 0 0 38px #4d2b1122;
}
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: 22px 22px 70px;
  box-sizing: border-box;
}
.hero-bg {
  position: absolute;
  inset: -4%;
  background: url("https://static.itchensi.com/tagcode/promotion/story-town-bg-v1.png") center/cover
    no-repeat;
  animation: bg-in 1.6s both;
}
.hero-bg:after {
  position: absolute;
  inset: 0;
  background: linear-gradient(#fffaf0dd, #fff8df44 48%, #4a210d18);
  content: "";
}
header,
.hero-copy,
.stage,
.more {
  position: relative;
  z-index: 2;
}
header {
  display: flex;
  align-items: center;
  gap: 9px;
  animation: rise 0.7s both;
}
header img {
  width: 42px;
  height: 42px;
  border-radius: 12px;
}
header div {
  display: flex;
  flex-direction: column;
}
header strong {
  font-size: 24px;
  line-height: 1;
}
header span {
  margin-top: 5px;
  font-size: 11px;
  letter-spacing: 2px;
}
.hero-copy {
  margin-top: 6vh;
  text-align: center;
}
.hero-copy small,
.steps > small {
  color: #a86434;
  font-weight: 700;
  letter-spacing: 2px;
}
.hero-copy h1 {
  margin: 12px 0 8px;
  font-size: 44px;
  line-height: 1.06;
  letter-spacing: -2px;
  animation: rise 0.9s 0.2s both;
}
.hero-copy em {
  color: var(--orange);
  font-style: normal;
}
.hero-copy p {
  margin: 0;
  font-size: 14px;
  animation: rise 0.8s 0.4s both;
}
.stage {
  height: 43vh;
  min-height: 340px;
}
.plate {
  position: absolute;
  z-index: 3;
  top: 7%;
  left: 50%;
  display: flex;
  width: 53%;
  aspect-ratio: 0.86;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  padding: 17px 12px;
  border: 3px solid #dca85c;
  border-radius: 24px;
  background: linear-gradient(145deg, #fffef5, #f4dfb9);
  box-shadow:
    0 22px 40px #532d1147,
    inset 0 0 0 2px white;
  transform: translateX(-50%);
  animation:
    plate-in 1s 0.45s both,
    float 4s 1.5s ease-in-out infinite;
}
.plate:before,
.plate:after {
  position: absolute;
  top: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ac6d20;
  content: "";
}
.plate:before {
  left: 9px;
}
.plate:after {
  right: 9px;
}
.plate img {
  width: 35px;
  height: 35px;
  border-radius: 10px;
}
.plate strong {
  font-size: 20px;
}
.plate b {
  display: grid;
  width: 72%;
  aspect-ratio: 1;
  place-items: center;
  margin-top: 8px;
  border: 9px double #4a291c;
  border-radius: 16px;
  background: repeating-linear-gradient(45deg, #4a291c 0 6px, #fff8e9 6px 12px);
  color: white;
  text-shadow: 0 1px 4px #321;
  font-size: 17px;
}
.plate small {
  margin-top: auto;
  font-size: 9px;
}
.stage > .dog,
.stage > .hero-car {
  position: absolute;
  filter: drop-shadow(0 12px 12px #42230e3d);
}
.dog {
  z-index: 4;
  bottom: -2%;
  left: -16%;
  width: 55%;
  animation:
    dog-in 0.9s 0.9s both,
    breathe 3.5s 2s ease-in-out infinite;
}
.hero-car {
  z-index: 2;
  right: -23%;
  bottom: 1%;
  width: 63%;
  animation: car-in 1.1s 1s both;
}
.more {
  position: absolute;
  right: 0;
  bottom: 23px;
  left: 0;
  display: flex;
  width: max-content;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: auto;
  border: 0;
  background: none;
  color: white;
  font-weight: 800;
  text-shadow: 0 2px 8px #5f321e;
  animation: nudge 1.5s infinite;
}
.more span {
  margin: 0;
  color: inherit;
  font-size: 14px;
  letter-spacing: 0;
}
.arrow-down {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-3px);
}
.scene {
  position: relative;
  min-height: 670px;
  overflow: hidden;
  padding: 76px 28px;
  box-sizing: border-box;
}
.scene > div {
  position: relative;
  z-index: 3;
  transition: 0.8s;
  opacity: 0;
  transform: translateY(25px);
}
.scene.visible > div {
  opacity: 1;
  transform: none;
}
.scene span {
  color: var(--orange);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}
.scene h2,
.steps h2 {
  margin: 13px 0 12px;
  font-size: 34px;
  line-height: 1.18;
  white-space: pre-line;
}
.scene p {
  max-width: 310px;
  margin: 0;
  color: #7a6255;
  font-size: 14px;
  line-height: 1.8;
}
.scene > img {
  position: absolute;
  opacity: 0;
  transition: 1s cubic-bezier(0.2, 0.9, 0.25, 1);
}
.pet {
  background: linear-gradient(165deg, #fff7e8, #f5dfb9);
}
.pet > img {
  right: -10%;
  bottom: -2%;
  width: 92%;
  transform: translate(25%, 18%) rotate(8deg);
}
.pet.visible > img {
  opacity: 1;
  transform: none;
}
.pet > b {
  position: absolute;
  z-index: 4;
  right: 24px;
  bottom: 260px;
  padding: 12px 18px;
  border: 2px solid #d89f61;
  border-radius: 10px;
  background: #fff5db;
  box-shadow: 0 8px 16px #85502322;
  transform: rotate(5deg);
}
.car {
  background: linear-gradient(165deg, #eaf5ff, #cfe8f1);
}
.car > img {
  right: -28%;
  bottom: 50px;
  width: 110%;
  transform: translateX(45%);
}
.car.visible > img {
  opacity: 1;
  transform: none;
}
.car > i {
  position: absolute;
  right: 34px;
  bottom: 330px;
  display: grid;
  width: 62px;
  height: 72px;
  place-items: center;
  border: 5px solid white;
  border-radius: 8px;
  background: #347bc5;
  color: white;
  font-size: 42px;
  font-style: normal;
  font-weight: 900;
}
.luggage {
  background: linear-gradient(165deg, #fff8e8, #ead0a1);
}
.luggage > img {
  right: -4%;
  bottom: 20px;
  width: 96%;
  transform-origin: 50% 100%;
  transform: translateY(38%) scale(0.9);
}
.luggage.visible > img {
  animation:
    luggage-in 1.05s cubic-bezier(0.18, 0.88, 0.25, 1.18) both,
    luggage-float 4s 1.05s ease-in-out infinite;
}
.steps {
  padding: 76px 28px;
  background: #fffdf7;
  text-align: center;
}
.steps > * {
  transition: 0.8s;
  opacity: 0;
  transform: translateY(24px);
}
.steps.visible > * {
  opacity: 1;
  transform: none;
}
.steps ol {
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
  text-align: left;
}
.steps li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid #eadfce;
}
.steps li > b {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 15px;
  background: #fff0dc;
  color: var(--orange);
}
.steps li div {
  display: flex;
  flex-direction: column;
}
.steps li span {
  margin-top: 5px;
  color: #8a7668;
  font-size: 12px;
}
.poster {
  padding: 16px;
  background: #fff;
}
.poster img {
  display: block;
  width: 100%;
  border-radius: 22px;
}
footer {
  display: flex;
  min-height: 520px;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  padding: 64px 28px;
  background: linear-gradient(165deg, #fff4dc, #f7d49e);
  text-align: center;
  transition: 0.8s;
  opacity: 0;
  transform: translateY(24px);
}
footer.visible {
  opacity: 1;
  transform: none;
}
footer > img {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  box-shadow: 0 12px 24px #a75c2a33;
}
footer p {
  margin: 22px 0;
  color: #77513b;
}
footer > button {
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 0;
  border-radius: 22px;
  background: linear-gradient(120deg, #ff8736, #ef5925);
  box-shadow: 0 14px 28px #e35e2c55;
  color: white;
  font-size: 20px;
  font-weight: 800;
}
.arrow-right {
  width: 11px;
  height: 11px;
  border-top: 3px solid currentColor;
  border-right: 3px solid currentColor;
  transform: rotate(45deg);
}
footer small {
  margin-top: 14px;
}
.guide {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #2b170dbb;
  backdrop-filter: blur(8px);
}
.guide > div {
  position: relative;
  width: min(100%, 350px);
  box-sizing: border-box;
  padding: 34px 24px;
  border-radius: 26px;
  background: #fffaf0;
  text-align: center;
}
.guide-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #f5eadb;
}
.guide-close i,
.guide-close i:after {
  display: block;
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: #755744;
  content: "";
}
.guide-close i {
  transform: rotate(45deg);
}
.guide-close i:after {
  transform: rotate(90deg);
}
.guide img {
  width: 68px;
  height: 68px;
  border-radius: 18px;
}
.guide h2 {
  margin: 16px 0 8px;
}
.guide p {
  color: #7a6255;
  line-height: 1.7;
}
.guide strong {
  color: var(--orange);
  font-size: 22px;
}
@keyframes bg-in {
  from {
    opacity: 0;
    transform: scale(1.08);
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
@keyframes plate-in {
  from {
    opacity: 0;
    transform: translate(-50%, 50px) scale(0.78) rotate(-5deg);
  }
}
@keyframes float {
  50% {
    transform: translate(-50%, -6px) rotate(1deg);
  }
}
@keyframes dog-in {
  from {
    opacity: 0;
    transform: translate(-60%, 20%) rotate(-10deg);
  }
}
@keyframes breathe {
  50% {
    transform: translateY(-4px) rotate(-1deg);
  }
}
@keyframes car-in {
  from {
    opacity: 0;
    transform: translateX(90%) rotate(3deg);
  }
}
@keyframes luggage-in {
  0% {
    opacity: 0;
    transform: translateY(38%) scale(0.9);
  }
  70% {
    opacity: 1;
    transform: translateY(-3%) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes luggage-float {
  0%,
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-8px) rotate(0.7deg);
  }
}
@keyframes nudge {
  50% {
    transform: translateY(5px);
  }
}
@media (max-height: 700px) {
  .hero-copy {
    margin-top: 3vh;
  }
  .hero-copy h1 {
    font-size: 38px;
  }
  .stage {
    height: 42vh;
    min-height: 295px;
  }
  .plate {
    width: 49%;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *:before,
  *:after {
    animation: none !important;
    transition: none !important;
  }
  .reveal > *,
  footer {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
