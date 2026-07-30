<template>
  <div class="background-animation-wrapper">
    <div class="ball ballA ball1"></div>
    <div class="ball ballB ball2"></div>
    <div class="ball ballC ball3"></div>
  </div>
</template>

<style scoped lang="scss">
.background-animation-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.ball {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: floatBall 8s infinite ease-in-out;
}

.ballA {
  width: 40rem;
  height: 40rem;
  opacity: 0.4;
  background: #8139ff;
}

.ballB {
  width: 36rem;
  height: 36rem;
  opacity: 0.35;
  background: #0004ff;
}

.ballC {
  width: 30rem;
  height: 30rem;
  opacity: 0.3;
  background: #d000ff;
}

.ball1 {
  top: -20%;
  left: -8%;
  animation-delay: 0s;
}

.ball2 {
  top: 10%;
  right: -10%;
  animation-delay: -3s;
}

.ball3 {
  bottom: -15%;
  left: 30%;
  animation-delay: -5s;
}

@keyframes floatBall {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(3rem, -4rem) scale(1.1);
  }
  66% {
    transform: translate(-2rem, 3rem) scale(0.95);
  }
}
</style>
