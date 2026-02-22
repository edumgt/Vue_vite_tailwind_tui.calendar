<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <header class="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <div>
        <h1 class="text-lg font-bold">JWT Calendar SPA</h1>
        <p class="text-xs text-slate-500">Vue + Node.js + PostgreSQL</p>
      </div>
      <button
        v-if="token"
        class="rounded bg-slate-900 px-3 py-2 text-sm text-white"
        @click="isDrawerOpen = true"
      >
        메뉴
      </button>
    </header>

    <main class="mx-auto w-full max-w-6xl p-4">
      <section v-if="!token" class="mx-auto mt-12 max-w-md rounded-xl bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">로그인</h2>
        <form class="space-y-3" @submit.prevent="handleLogin">
          <input v-model="username" class="w-full rounded border p-2" placeholder="username" />
          <input
            v-model="password"
            class="w-full rounded border p-2"
            placeholder="password"
            type="password"
          />
          <button class="w-full rounded bg-blue-600 py-2 font-semibold text-white">로그인</button>
        </form>
        <p class="mt-3 text-xs text-slate-500">테스트 계정: alice / bob / carol (비밀번호: Passw0rd!)</p>
        <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
      </section>

      <section v-else class="space-y-4">
        <div class="rounded-lg bg-white p-4 shadow">
          <p class="text-sm">안녕하세요, <strong>{{ user?.displayName }}</strong>님</p>
        </div>
        <CalendarView :events="events" />
      </section>
    </main>

    <div
      class="fixed inset-0 z-30 bg-black/40 transition"
      :class="isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
      @click="isDrawerOpen = false"
    ></div>

    <aside
      class="fixed right-0 top-0 z-40 h-full w-72 bg-white p-4 shadow-xl transition-transform"
      :class="isDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold">오프캔버스 메뉴</h3>
        <button class="rounded border px-2 py-1" @click="isDrawerOpen = false">닫기</button>
      </div>
      <ul class="space-y-2 text-sm">
        <li class="rounded bg-slate-100 p-2">캘린더</li>
        <li>
          <button class="w-full rounded bg-red-500 p-2 text-white" @click="logout">로그아웃</button>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CalendarView from './components/CalendarView.vue';

type User = { id: number; username: string; displayName: string };
type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  category: 'time' | 'task';
  start: string;
  end: string;
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const username = ref('alice');
const password = ref('Passw0rd!');
const token = ref(localStorage.getItem('token') || '');
const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
const events = ref<CalendarEvent[]>([]);
const error = ref('');
const isDrawerOpen = ref(false);

async function fetchEvents() {
  if (!token.value) {
    return;
  }

  const response = await fetch(`${apiUrl}/api/calendar/events`, {
    headers: { Authorization: `Bearer ${token.value}` },
  });

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error('일정을 불러오지 못했습니다.');
  }

  events.value = await response.json();
}

async function handleLogin() {
  error.value = '';
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '로그인 실패');
    }

    const data = await response.json();
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    await fetchEvents();
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류';
  }
}

function logout() {
  token.value = '';
  user.value = null;
  events.value = [];
  isDrawerOpen.value = false;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

onMounted(async () => {
  if (token.value) {
    try {
      await fetchEvents();
    } catch {
      logout();
    }
  }
});
</script>
