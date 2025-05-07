<template>
  <v-card class="blood-card" elevation="2">
    <v-card-text class="flex-grow-1">
      <h2 class="text-center text-red-darken-4 font-weight-bold text-h4 mb-4">
        {{ type }}
      </h2>

      <div class="mb-3">
        <h4 class="text-subtitle-1 font-weight-medium mb-1">Can donate to:</h4>
        <p class="text-body-2 text-red-darken-4">
          {{ canDonateTo.join(', ') }}
        </p>
      </div>

      <div>
        <h4 class="text-subtitle-1 font-weight-medium mb-1">
          Can receive from:
        </h4>
        <p class="text-body-2 text-red-darken-4">
          {{ canReceiveFrom.join(', ') }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  type: String,
  canDonateTo: Array,
  canReceiveFrom: Array,
});
</script>

<style scoped>
.blood-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}
.blood-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--v-shadow-6);
}
</style>
