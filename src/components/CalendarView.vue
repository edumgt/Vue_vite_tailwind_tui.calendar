<template>
  <section class="p-4">
    <header class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">📅 TUI Calendar + Vue + Tailwind</h1>
      <span class="text-sm text-slate-500">Sample schedule</span>
    </header>
    <div ref="calendarEl" class="min-h-[600px] rounded-lg border shadow-lg"></div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";

const calendarEl = ref<HTMLDivElement | null>(null);
let calendar: Calendar | null = null;

onMounted(() => {
  if (!calendarEl.value) {
    return;
  }

  calendar = new Calendar(calendarEl.value, {
    defaultView: "month",
    taskView: true,
    scheduleView: ["time"],
    template: {
      monthDayname: (dayname) =>
        `<span class=\"text-blue-600\">${dayname.label}</span>`,
    },
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

onBeforeUnmount(() => {
  calendar?.destroy();
  calendar = null;
});
</script>
