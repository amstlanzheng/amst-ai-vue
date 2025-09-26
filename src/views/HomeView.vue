<template>
  <div id="homeView">
    <div class="header">
      <n-h1>AI应用中心</n-h1>
      <p class="subtitle">探索智能未来，体验科技魅力</p>
    </div>
    

    <div class="features-header">
      <div class="welcome-text">
        <p>{{ speak }}</p>
      </div>
      <div class="budget-meter">
        <div class="meter-header">
          <span>当前资源使用情况</span>
          <span>35% 已使用</span>
        </div>
        <div class="meter-bar">
          <div class="meter-fill"></div>
        </div>
      </div>
      
      <div class="features" @click="openModal()">
        <div class="feature">
          <i class="fas fa-robot"></i>
          <h3>开始使用</h3>
          <p>与AI助手进行自然流畅的对话，获取信息与帮助</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router';

const speak = ref('欢迎来到我的AI应用中心，哥们是个穷人，省点用（/(ㄒoㄒ)/~~）')
const openModal = () => {
  router.push('/home')
}


</script>

<style scoped>
#homeView {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px;
  max-width: 1200px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
}



.header {
  margin-bottom: 30px;
}

h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 30px;
  font-weight: 400;
}

.welcome-text {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 25px;
  border-radius: 16px;
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 40px;
  box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
  position: relative;
  overflow: hidden;
}

.welcome-text::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
  transform: rotate(30deg);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature {
  background: white;
  padding: 25px 20px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature h3 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  color: #4a5568;
}

.feature p {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
}

.footer {
  color: #a0aec0;
  font-size: 0.9rem;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.budget-meter {
  background: #edf2f7;
  border-radius: 12px;
  padding: 20px;
  margin: 30px 0;
}

.meter-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 50vh;
  color: #4a5568;
}

.meter-bar {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  border-radius: 6px;
  width: 35%;
  position: relative;
}

.meter-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  animation: move 1s linear infinite;
}
.features-header{
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

@media (max-width: 768px) {
  #homeView {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .welcome-text {
    font-size: 1.2rem;
    padding: 20px;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}

</style>