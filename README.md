# Vite + Tailwind CSS + TUI Calendar (Vue 3)

Vue 3, Vite, Tailwind CSS v3, 그리고 TUI Calendar를 결합한 샘플 프로젝트입니다. 이 레포는 캘린더 UI를 빠르게 시작할 수 있도록 최소 구성과 예시 스케줄을 제공합니다.

## ✨ 주요 기능

- Vite 기반의 빠른 개발 환경
- Tailwind CSS v3 유틸리티 스타일링
- TUI Calendar 월간 뷰 예시
- Vue 3 Composition API로 구성된 컴포넌트

## 🧰 기술 스택

- **Vue 3**
- **Vite**
- **Tailwind CSS v3**
- **TUI Calendar**

## 📦 설치

```bash
npm install
```

## 🏃 실행

```bash
npm run dev
```

## 🗂️ 프로젝트 구조

```
src/
  components/
    CalendarView.vue
  App.vue
  main.ts
  style.css
```

## 🧩 캘린더 컴포넌트 사용 예시

`CalendarView.vue`에서 TUI Calendar 인스턴스를 생성하며, 언마운트 시 `destroy()`로 정리합니다.

```vue
<template>
  <CalendarView />
</template>
```

## ✅ 참고 사항

- Tailwind CSS는 `src/style.css`에서 전역 적용됩니다.
- 캘린더 데이터는 샘플 스케줄로 구성되어 있습니다.

## 📜 라이선스

MIT
