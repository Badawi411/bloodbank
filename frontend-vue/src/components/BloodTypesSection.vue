<template>
  <section class="py-8">
    <v-container>
      <v-row justify="center" class="mb-6">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h4 font-weight-bold mb-2">Blood Compatibility</h2>
          <p class="text-body-1">
            Learn which blood types can donate to or receive from others.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="blood in bloodTypes"
          :key="blood.type"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <BloodTypeCard
            :type="blood.type"
            :canDonateTo="blood.canDonateTo"
            :canReceiveFrom="blood.canReceiveFrom"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import BloodTypeCard from '@/components/BloodTypeCard.vue';

const bloodTypes = [
  {
    type: 'A+',
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
  },
  {
    type: 'A-',
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
  },
  {
    type: 'B+',
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
  },
  {
    type: 'B-',
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
  },
  {
    type: 'AB+',
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  {
    type: 'AB-',
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
  },
  {
    type: 'O+',
    canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
    canReceiveFrom: ['O+', 'O-'],
  },
  {
    type: 'O-',
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
  },
];
</script>
