<template>
  <div class="rounded-full w-fit shadow-lg m-auto mt-5 bg-slate-200">
    <div class="flex p-3">
      <div class="flex-auto mt-2 ml-2">{{ clockToShow }}</div>
      <div class="flex-auto mx-3">
        <button
          :class="`btn-pill ${
            clockStatus === 'start' ? 'btn-gray' : 'btn-success'
          }`"
          @click="
            clockStatus === 'stop'
              ? startClock()
              : clockStatus === 'pause'
              ? (clockStatus = 'start')
              : pauseClock()
          "
        >
          {{
            clockStatus === "pause"
              ? "Reanudar"
              : clockStatus === "start"
              ? "Pausar"
              : "Entrar"
          }}
        </button>
        <button class="btn-pill btn-danger ml-3" @click="stopClock">
          Button
        </button>
      </div>
      <div class="vl px-3"></div>

      <div class="relative">
        <DropDown>
          <template v-slot:list>
            <DropDown listItemAtLeft>
              <template v-slot:button>
                <svg
                  class="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
                <h4
                  class="text-lg ml-10 py-3 font-semibold text-center md:text-left"
                >
                  Mis cuentas
                </h4>
              </template>
              <template v-slot:list>
                <a
                  href="/"
                  class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
                >
                  Sesame1
                </a>
                <a
                  href="/"
                  class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
                >
                  Sesame2
                </a>
              </template>
            </DropDown>
            <a
              href="/"
              class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
            >
              Vista empleado
            </a>
            <a
              href="/"
              class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
            >
              Mi perfil
            </a>
            <a
              href="/"
              class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
            >
              Cerrar sesión
            </a>
          </template>
        </DropDown>
      </div>
    </div>
  </div>

  <LoadingSpinner v-show="loading" />
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import moment from "moment";
import _ from "lodash";
import api from "./config/api";
import LoadingSpinner from "./components/Loading";
import "vue3-toastify/dist/index.css";
import DropDown from "./components/DropDown.vue";
export default {
  name: "App",
  components: {
    LoadingSpinner,
    DropDown,
  },
  setup() {
    const loading = ref(false);
    const clockStatus = ref("stop");
    const clock = ref(moment().startOf("day").valueOf());
    const clockToShow = ref(moment("000000", "HHmmss").format("HH:mm:ss"));
    const apiTime = ref(null);
    const userId = "b99a6cd9-3a3d-4635-9eea-e089c90ac45a";

    const getEmployeeInfo = async () => {
      loading.value = true;
      const [response, error] = await api("work-entries", "get", {
        params: { from: "2023-03-02" },
      });
      loading.value = false;
      if (error) return toast.error(error);

      apiTime.value = _.filter(response.data, (d) => {
        return !d.workEntryOut;
      });

      if (apiTime.value.length > 0) {
        const now = moment().valueOf();
        const dateToSubtract = moment(
          apiTime.value[0].workEntryIn.date
        ).valueOf();
        clockStatus.value = "start";
        clock.value = moment(now - dateToSubtract).valueOf();
      }
    };

    const startClock = async () => {
      loading.value = true;
      const toSend = {
        employeeId: userId,
        workEntryIn: {
          coordinates: {
            latitud: null,
            longitude: null,
          },
        },
      };
      const [response, error] = await api(
        "work-entries/clock-in",
        "post",
        toSend
      );
      loading.value = false;
      if (error) return toast.error(error);
      clockStatus.value = "start";
      console.log(response, "ClockIn response");
      toast.success("El temporizador ha empezado");
    };

    const stopClock = async () => {
      loading.value = true;
      const toSend = {
        employeeId: userId,
        workEntryIn: {
          coordinates: {
            latitud: null,
            longitude: null,
          },
        },
      };
      const [response, error] = await api(
        "work-entries/clock-out",
        "post",
        toSend
      );
      loading.value = false;
      if (error) return toast.error(error);
      clockStatus.value = "stop";
      clock.value = ref(moment().startOf("day").valueOf());
      console.log(response, "ClockOut response");
      toast.success("El temporizador se ha detenido");
    };

    const pauseClock = async () => {
      clockStatus.value = "pause";
    };

    onMounted(async () => {
      window.setInterval(() => {
        if (clockStatus.value === "start") {
          clock.value = moment(clock.value).add(1, "s");
        }
      }, 1000);

      await getEmployeeInfo();
    });

    watch(clock, () => {
      clockToShow.value = moment(clock.value).format("HH:mm:ss");
    });

    return {
      loading,
      clockStatus,
      clock,
      clockToShow,
      startClock,
      stopClock,
      pauseClock,
    };
  },
};
</script>
<style>
.btn {
  @apply py-2 px-16 rounded;
}
.btn-pill {
  @apply py-2 px-16 rounded-full;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

.btn-success {
  @apply bg-teal-400 text-white;
}

.btn-success:hover {
  @apply bg-teal-500;
}

.btn-danger {
  @apply bg-red-300 text-white;
}

.btn-danger:hover {
  @apply bg-red-400;
}

.btn-gray {
  @apply bg-gray-400 text-white;
}

.btn-gray:hover {
  @apply bg-gray-500;
}

.vl {
  border-left: 3px solid rgb(156, 156, 156);
  height: 40px;
}
</style>
