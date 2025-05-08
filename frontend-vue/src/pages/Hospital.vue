<script setup>
import { ref } from 'vue';
import { useBloodRequestStore } from '@/stores/bloodRequestStore';
import Navbar from '@/components/Navbar.vue';
import AppFooter from '@/components/AppFooter.vue';

const bloodStore = useBloodRequestStore();

const form = ref({
  hospitalName: '',
  bloodType: '',
  quantity: '',
  city: '',
  patientStatus: '',
});

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cities = [
  'Cairo',
  'Alexandria',
  'Giza',
  'Sharm El Sheikh',
  'Luxor',
  'Aswan',
  'Hurghada',
  'Port Said',
  'Suez',
  'Mansoura',
  'Tanta',
  'Ismailia',
  'Faiyum',
  'Zagazig',
  'Damietta',
  'Qena',
  'Sohag',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Damanhur',
  'Qalyubia',
  'Kafr El Sheikh',
  'Beheira',
  'Sharqia',
  'Monufia',
  'Gharbia',
  'Dakahlia',
  'Matruh',
  'Red Sea',
  'New Valley',
  'North Sinai',
  'South Sinai',
];
const patientStatuses = ['Normal', 'Urgent', 'Immediate'];

const handleSubmit = async () => {
  bloodStore.requestForm = form.value;

  await bloodStore.submitRequest(bloodStore.requestForm);

  if (bloodStore.success) {
    form.value = {
      hospitalName: '',
      bloodType: '',
      quantity: '',
      city: '',
      patientStatus: '',
    };
  }
};
</script>

<template>
  <Navbar />
  <v-container class="py-10">
    <v-card class="pa-6" elevation="4">
      <v-card-title class="text-h5 text-center mb-6"
        >Hospital Blood Request</v-card-title
      >

      <v-alert v-if="bloodStore.success" type="success" class="mb-4">
        Your blood request has been submitted successfully. We will process it
        as soon as possible.
      </v-alert>

      <v-alert v-if="bloodStore.error" type="error" class="mb-4">
        {{ bloodStore.error }}
      </v-alert>

      <v-form @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="form.hospitalName"
              label="Hospital Name"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.bloodType"
              :items="bloodTypes"
              label="Blood Type"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.quantity"
              type="number"
              :min="1"
              label="Quantity (Units)"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.city"
              :items="cities"
              label="City"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.patientStatus"
              :items="patientStatuses"
              label="Patient Status"
              outlined
              required
            />
          </v-col>

          <v-col cols="12">
            <v-btn
              :loading="bloodStore.loading"
              type="submit"
              color="primary"
              class="mt-4"
              block
            >
              Submit Request
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
  <AppFooter />
</template>

<style scoped>
.v-card {
  max-width: 700px;
  margin: auto;
}
</style>
