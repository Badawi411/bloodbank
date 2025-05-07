<script setup>
import Navbar from '@/components/Navbar.vue';
import { ref } from 'vue';
import { useFormStore } from '@/stores/formStore';

const formStore = useFormStore();
const donorFormRef = ref(null);
const donationFormRef = ref(null);

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

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const virusTestResults = ['Negative', 'Positive'];

const handleDonorSubmit = async () => {
  formStore.loading = true;
  try {
    const response = await fetch(
      'http://localhost:5000/api/v1/donors/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formStore.donorForm),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register donor');
    }
    if (data.status === 'rejected') {
      formStore.rejectedMessage = data.message;
      formStore.activeStep = 3;
      return;
    }
    if (response.status === 200 && data.donor) {
      formStore.donorForm = {
        nationalId: data.donor.nationalId,
        name: data.donor.name,
        city: data.donor.city,
        email: data.donor.email,
      };
      formStore.donorExists = true;
      formStore.donorId = data.donor._id;
      formStore.activeStep = 2;
    } else if (response.status === 201) {
      formStore.donorId = data.donorId;
      formStore.activeStep = 2;
    }
  } catch (err) {
    formStore.error = err.message || 'Something went wrong.';
  } finally {
    formStore.loading = false;
  }
};

const handleDonationSubmit = async () => {
  formStore.loading = true;
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/donors/${formStore.donorId}/donate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formStore.donationForm),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process donation');
    }
    formStore.success = true;
    formStore.activeStep = 3;
  } catch (err) {
    formStore.error =
      err.message || 'Failed to process donation. Please try again.';
  } finally {
    formStore.loading = false;
  }
};
</script>

<template>
  <Navbar />
  <v-container class="py-10" style="background-color: white" fluid>
    <v-card class="mx-auto" max-width="1000" elevation="3">
      <v-card-title class="text-h5 font-weight-bold text-center">
        Blood Donation Process
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-stepper v-model="formStore.activeStep" flat>
          <v-stepper-header
            class="d-flex align-center gap-2 mb-4 spacing-between"
            style="height: 60px"
          >
            <v-stepper-step
              :complete="formStore.activeStep > 1"
              step="1"
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
            >
              <div
                :class="[
                  'd-flex align-center justify-center rounded-circle',
                  formStore.activeStep === 1
                    ? 'bg-red-darken-4'
                    : 'bg-grey-darken-1',
                ]"
                style="width: 25px; height: 25px; color: white"
              >
                <span class="text-h6 font-weight-bold">1</span>
              </div>
              <span class="text-center w-100">Donor Registration</span>
            </v-stepper-step>
            <v-divider style="max-width: 250px; margin: 0 auto"></v-divider>
            <v-stepper-step
              :complete="formStore.activeStep > 2"
              step="2"
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
            >
              <div
                :class="[
                  'mx-auto d-flex align-center justify-center rounded-circle',
                  formStore.activeStep === 2
                    ? 'bg-red-darken-4'
                    : 'bg-grey-darken-1',
                ]"
                style="width: 25px; height: 25px; color: white"
              >
                <span class="text-h6 font-weight-bold">2</span>
              </div>
              Donation Details
            </v-stepper-step>
            <v-divider style="max-width: 250px; margin: 0 auto"></v-divider>
            <v-stepper-step
              step="3"
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
            >
              <div
                :class="[
                  'mx-auto d-flex align-center justify-center rounded-circle',
                  formStore.activeStep === 3
                    ? 'bg-red-darken-4'
                    : 'bg-grey-darken-1',
                ]"
                style="width: 25px; height: 25px; color: white"
              >
                <span class="text-h6 font-weight-bold">3</span>
              </div>
              Confirmation
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- Step 1: Donor Registration -->
            <v-stepper-content step="1">
              <v-form ref="donorFormRef" @submit.prevent="handleDonorSubmit">
                <v-text-field
                  label="National ID"
                  v-model="formStore.donorForm.nationalId"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  label="Full Name"
                  v-model="formStore.donorForm.name"
                  required
                  outlined
                  dense
                  :readonly="formStore.donorExists === true"
                ></v-text-field>
                <v-select
                  label="City"
                  :items="cities"
                  v-model="formStore.donorForm.city"
                  required
                  outlined
                  dense
                  :readonly="formStore.donorExists === true"
                ></v-select>
                <v-text-field
                  label="Email"
                  v-model="formStore.donorForm.email"
                  required
                  outlined
                  dense
                  :readonly="formStore.donorExists === true"
                ></v-text-field>
                <v-btn
                  type="submit"
                  :loading="formStore.loading"
                  color="primary"
                  block
                  class="mt-4"
                >
                  Continue
                </v-btn>
              </v-form>
            </v-stepper-content>

            <!-- Step 2: Donation Details -->
            <v-stepper-content step="2">
              <v-form
                ref="donationFormRef"
                @submit.prevent="handleDonationSubmit"
              >
                <v-select
                  label="Blood Type"
                  :items="bloodTypes"
                  v-model="formStore.donationForm.bloodType"
                  required
                  outlined
                  dense
                ></v-select>
                <v-select
                  label="Virus Test Result"
                  :items="virusTestResults"
                  v-model="formStore.donationForm.virusTestResult"
                  required
                  outlined
                  dense
                ></v-select>
                <v-select
                  label="Blood Bank City"
                  :items="cities"
                  v-model="formStore.donationForm.bloodBankCity"
                  required
                  outlined
                  dense
                ></v-select>
                <v-btn
                  type="submit"
                  :loading="formStore.loading"
                  color="primary"
                  block
                  class="mt-4"
                >
                  Submit Donation
                </v-btn>
              </v-form>
            </v-stepper-content>

            <!-- Step 3: Confirmation -->
            <v-stepper-content step="3">
              <v-alert
                type="success"
                v-if="formStore.success"
                class="text-center"
                outlined
              >
                Thank you for your donation! Your contribution will help save
                lives.
              </v-alert>
              <v-alert type="error" v-else class="text-center" outlined>
                {{ formStore.error }}
              </v-alert>
              <v-btn
                @click="formStore.resetForms()"
                color="primary"
                block
                class="mt-4"
              >
                Donate Again
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-container>
</template>
