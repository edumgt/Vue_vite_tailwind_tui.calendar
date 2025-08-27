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
