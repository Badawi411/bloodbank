<template>
  <v-container fluid class="py-10">
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="8">
        <h2 class="text-center font-weight-bold text-h4">How It Works</h2>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" dense>
      <v-col
        v-for="(step, index) in steps"
        :key="index"
        cols="12"
        md="4"
        class="text-center px-6"
      >
        <div
          class="mx-auto mb-4 d-flex align-center justify-center rounded-circle elevation-3 bg-red-darken-4"
          style="width: 64px; height: 64px; color: white"
        >
          <span class="text-h5 font-weight-bold">{{ index + 1 }}</span>
        </div>
        <h3 class="text-h6 font-weight-medium mb-2">{{ step.title }}</h3>
        <p class="text-body-1 text-grey">
          {{ step.description }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const steps = [
  {
    title: 'Register as a Donor',
    description:
      'Complete a simple registration form with your personal details and medical history.',
  },
  {
    title: 'Donate Blood',
    description:
      'Visit a blood bank location to donate. The process takes about 10-15 minutes.',
  },
  {
    title: 'Save Lives',
    description:
      'Your donation is processed, tested, and distributed to hospitals to help patients in need.',
  },
];
</script>
