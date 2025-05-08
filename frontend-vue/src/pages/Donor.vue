<script setup>
import Navbar from '@/components/Navbar.vue';
import AppFooter from '@/components/AppFooter.vue';
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
    if (!data.donor && formStore.donorForm.nationalId) {
      formStore.donorExists = false; // Explicitly set to false
      return;
    }
    if (!response.ok) {
      // formStore.donorExists = null;
      throw new Error(data.message || 'Failed to register donor');
    }

    if (data.status === 'rejected') {
      formStore.rejectedMessage = data.message;
      formStore.activeStep = 1;
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
  <v-container class="py-10" fluid style="background-color: white">
    <v-card class="mx-auto" elevation="3" max-width="1000">
      <v-card-title class="text-h5 font-weight-bold text-center">
        Blood Donation Process
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-stepper v-model="formStore.activeStep" flat>
          <v-stepper-header
            class="d-flex align-center gap-2 mb-4 spacing-between"
            style="height: 60px"
          >
            <v-stepper-step
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
              :complete="formStore.activeStep > 1"
              step="1"
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
            <v-divider style="max-width: 250px; margin: 0 auto" />
            <v-stepper-step
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
              :complete="formStore.activeStep > 2"
              step="2"
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
            <v-divider style="max-width: 250px; margin: 0 auto" />
            <v-stepper-step
              class="d-flex align-center justify-center w-50 px-0 spacing-around"
              step="3"
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
            <v-stepper-content :step="formStore.activeStep">
              <v-alert
                v-if="formStore.error"
                class="text-center"
                outlined
                type="error"
              >
                {{ formStore.error }}
              </v-alert>
              <v-alert
                v-else-if="formStore.rejectedMessage"
                class="text-center"
                outlined
                type="error"
              >
                {{ formStore.rejectedMessage }}
              </v-alert>
              <v-alert
                v-else-if="formStore.success"
                class="text-center"
                outlined
                type="success"
              >
                Thank you for your donation! Your contribution will help save
                lives.
              </v-alert>
            </v-stepper-content>

            <!-- Step 1: Donor Registration -->
            <v-stepper-content v-if="formStore.activeStep === 1" step="1">
              <v-form ref="donorFormRef" @submit.prevent="handleDonorSubmit">
                <v-text-field
                  v-model="formStore.donorForm.nationalId"
                  dense
                  name="nationalId"
                  label="National ID"
                  outlined
                  required
                ></v-text-field>
                <div v-if="formStore.donorExists === false">
                  <v-text-field
                    v-model="formStore.donorForm.name"
                    dense
                    label="Full Name"
                    outlined
                    :readonly="formStore.donorExists === true"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="formStore.donorForm.city"
                    dense
                    :items="cities"
                    label="City"
                    outlined
                    :readonly="formStore.donorExists === true"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="formStore.donorForm.email"
                    dense
                    label="Email"
                    outlined
                    :readonly="formStore.donorExists === true"
                    required
                  ></v-text-field>
                </div>
                <v-btn
                  block
                  class="mt-4"
                  color="red-darken-4"
                  :loading="formStore.loading"
                  type="submit"
                >
                  Continue
                </v-btn>
              </v-form>
            </v-stepper-content>

            <!-- Step 2: Donation Details -->
            <v-stepper-content v-if="formStore.activeStep === 2" :step="2">
              <v-form
                ref="donationFormRef"
                @submit.prevent="handleDonationSubmit"
              >
                <v-select
                  v-model="formStore.donationForm.bloodType"
                  dense
                  :items="bloodTypes"
                  label="Blood Type"
                  outlined
                  required
                ></v-select>
                <v-select
                  v-model="formStore.donationForm.virusTestResult"
                  dense
                  :items="virusTestResults"
                  label="Virus Test Result"
                  outlined
                  required
                ></v-select>
                <v-select
                  v-model="formStore.donationForm.bloodBankCity"
                  dense
                  :items="cities"
                  label="Blood Bank City"
                  outlined
                  required
                ></v-select>
                <v-btn
                  block
                  class="mt-4"
                  color="red-darken-4"
                  :loading="formStore.loading"
                  type="submit"
                >
                  Submit Donation
                </v-btn>
              </v-form>
            </v-stepper-content>

            <v-btn
              v-if="formStore.success"
              block
              class="mt-4"
              color="red-darken-4"
              @click="formStore.resetForms()"
            >
              Donate Again
            </v-btn>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-container>
  <AppFooter />
</template>
