# Vue 3 + TypeScript + Vite

vite, tailwind3, tui.calendar 를 이용 하는 vue js
ChatGPT의 말:

Vite + Tailwind CSS v3 + TUI Calendar 조합으로 Vue.js 프로젝트를 구성하는 방법을 정리해드릴게요. 🚀

1. 프로젝트 생성 (Vite + Vue)
npm create vite@latest my-calendar-app
# > Vue 선택
cd my-calendar-app
npm install

2. Tailwind CSS 설치 및 설정
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


📌 tailwind.config.cjs 수정:

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


📌 src/index.css 수정:

@tailwind base;
@tailwind components;
@tailwind utilities;

3. TUI Calendar 설치
npm install tui-calendar
npm install tui-date-picker tui-time-picker


📌 vite.config.js에 alias (선택):

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["tui-calendar"],
  },
});

4. Vue 컴포넌트에서 TUI Calendar 사용

📌 src/components/MyCalendar.vue

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">📅 TUI Calendar + Vue + Tailwind</h1>
    <div ref="calendarEl" class="border rounded-lg shadow-lg"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";

export default {
  name: "MyCalendar",
  setup() {
    const calendarEl = ref(null);

    onMounted(() => {
      const calendar = new Calendar(calendarEl.value, {
        defaultView: "month",
        taskView: true,
        scheduleView: ["time"],
        template: {
          monthDayname: (dayname) => `<span class="text-blue-600">${dayname.label}</span>`
        }
      });

      calendar.createSchedules([
        {
          id: "1",
          calendarId: "1",
          title: "회의",
          category: "time",
          start: "2025-08-27T10:30:00+09:00",
          end: "2025-08-27T12:30:00+09:00",
        },
      ]);
    });

    return { calendarEl };
  },
};
</script>

5. App.vue에서 불러오기
<template>
  <MyCalendar />
</template>

<script>
import MyCalendar from "./components/MyCalendar.vue";
export default { components: { MyCalendar } };
</script>


✅ 실행:

npm run dev


이제 Tailwind 스타일을 유지하면서 Vue + TUI Calendar가 동작할 거예요.
원하면 tui-calendar를 감싼 커스텀 Vue 컴포넌트를 만들어서 props로 schedules, viewMode 등을 넘겨줄 수도 있습니다.

원하시나요? 제가 Vue 전용 TUI Calendar Wrapper 컴포넌트 (재사용 가능한 props/emit 구조)까지 만들어드릴까요?

나의 말:
npm install -D tailwindcss postcss autoprefixer 를 tailwind3 로 정확히
ChatGPT의 말:

좋은 질문이에요 👍
Tailwind CSS v3를 정확히 설치하려면 버전을 명시해서 설치하면 됩니다.

✅ Tailwind v3 설치 명령어
npm install -D tailwindcss@3 postcss autoprefixer


📌 여기서 @3은 메이저 버전 3.x를 의미합니다. (3.4.x 최신 버전으로 설치됨)

✅ 설정 파일 생성
npx tailwindcss init -p


이렇게 하면 자동으로

tailwind.config.cjs

postcss.config.cjs

파일이 생성됩니다.

✅ tailwind.config.cjs 예시 (Vite + Vue 기준)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

✅ src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;


👉 이렇게 하면 Tailwind CSS 3.x 환경이 정확히 세팅됩니다.

원하시면 제가 vite + vue + tailwind3 프로젝트 구조 예시 전체 파일을 만들어 드릴까요?

나의 말:
vue 는 index.css 가 없어
ChatGPT의 말:

맞습니다 👍
Vue(Vite 기반) 프로젝트에서는 기본적으로 index.css 같은 파일이 없고, src/assets/ 안에 CSS 파일을 두거나 App.vue 안에서 직접 불러오는 방식이에요.

✅ Vue + Tailwind 3 설정 방법
1) assets 폴더에 CSS 생성

src/assets/tailwind.css 파일을 새로 만들어서 아래 내용 추가:

@tailwind base;
@tailwind components;
@tailwind utilities;

2) main.js 에서 불러오기

src/main.js 수정:

import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'   // ⬅️ 추가 (Tailwind 적용)

createApp(App).mount('#app')

3) tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

4) 실행
npm run dev


✅ 요약

Vue에는 index.css가 없으니 src/assets/tailwind.css 같은 파일을 만들어야 함

main.js에서 이 파일을 import해야 Tailwind가 전역 적용됨