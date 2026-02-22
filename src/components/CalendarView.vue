<template>
  <section class="rounded-lg bg-white p-4 shadow">
    <header class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">내 캘린더</h2>
      <span class="text-xs text-slate-500">{{ events.length }}개 일정</span>
    </header>
    <div ref="calendarEl" class="min-h-[650px] rounded-lg border"></div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';

type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  category: 'time' | 'task';
  start: string;
  end: string;
};

const props = defineProps<{ events: CalendarEvent[] }>();

const calendarEl = ref<HTMLDivElement | null>(null);
let calendar: Calendar | null = null;

function renderSchedules() {
  if (!calendar) {
    return;
  }

  calendar.clear();
  calendar.createSchedules(props.events);
}

onMounted(() => {
  if (!calendarEl.value) {
    return;
  }

  calendar = new Calendar(calendarEl.value, {
    defaultView: 'month',
    taskView: true,
    scheduleView: ['time'],
    template: {
      monthDayname: (dayname) => `<span class=\"text-blue-600\">${dayname.label}</span>`,
    },
  });

  renderSchedules();
});

watch(
  () => props.events,
  () => {
    renderSchedules();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  calendar?.destroy();
  calendar = null;
});
</script>
