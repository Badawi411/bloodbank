<script setup>
import { ref } from 'vue';

const drawer = ref(false);

const pages = [
  { title: 'Home', path: '/' },
  { title: 'Donate Blood', path: '/donor' },
  { title: 'Request Blood', path: '/hospital' },
  { title: 'Admin', path: '/admin' },
];

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<template>
  <v-app-bar app color="red-darken-4" dark>
    <v-container>
      <v-toolbar-title class="d-none d-md-flex me-4">
        <v-icon class="me-2">mdi-blood-bag</v-icon>
        <RouterLink
          to="/"
          class="text-decoration-none text-white font-weight-bold"
        >
          BLOODBANK
        </RouterLink>
      </v-toolbar-title>

      <v-spacer />

      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon class="d-md-none me-4" @click="toggleDrawer" />

      <!-- Drawer for Mobile -->
      <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
        <v-list>
          <v-list-item
            v-for="page in pages"
            :key="page.title"
            @click="toggleDrawer"
          >
            <RouterLink :to="page.path" class="text-decoration-none text-black">
              <v-list-item-title>{{ page.title }}</v-list-item-title>
            </RouterLink>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Desktop Menu -->
      <div class="d-none d-md-flex">
        <v-btn
          v-for="page in pages"
          :key="page.title"
          :to="page.path"
          text
          class="text-white"
          router
        >
          {{ page.title }}
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
