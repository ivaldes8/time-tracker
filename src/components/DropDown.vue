<template>
  <div class="relative">
    <!-- Dropdown toggle button -->
    <button @click="show = !show" class="flex items-center">
      <slot name="button">
        <img
          src="https://source.unsplash.com/75x75/?portrait"
          alt=""
          class="rounded-full w-10"
        />

        <h4 class="text-lg ml-5 font-semibold text-center md:text-left">
          Ivan Gonzalez
        </h4>
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </slot>
    </button>

    <!-- Dropdown menu -->
    <div
      v-show="show"
      :class="
        listItemAtLeft
          ? 'absolute mx-3 top-3 right-60 rounded-md shadow-xl w-60 bg-white divide-y'
          : 'absolute py-2 mt-2 right-0 rounded-md shadow-xl w-60 bg-white divide-y'
      "
    >
      <slot name="list">
        <a
          href="/"
          class="block px-16 text-sm hover:bg-slate-100 text-center py-3"
        >
          Mis cuentas
        </a>
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
      </slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
// const props = defineProps(['content'])
export default {
  name: "DropDown",
  props: {
    listItemAtLeft: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const show = ref(false);

    return { show };
  },
};
</script>
