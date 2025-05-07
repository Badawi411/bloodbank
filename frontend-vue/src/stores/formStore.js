// stores/formStore.js
import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    donorForm: {
      nationalId: '',
      name: '',
      city: '',
      email: '',
    },
    donationForm: {
      bloodType: '',
      virusTestResult: '',
      bloodBankCity: '',
    },
    donorExists: null,
    donorId: null,
    activeStep: 1,
    success: false,
    error: null,
    loading: false,
    rejectedMessage: null,
  }),
  actions: {
    resetForms() {
      this.donorForm = {
        nationalId: '',
        name: '',
        city: '',
        email: '',
      };
      this.donationForm = {
        bloodType: '',
        virusTestResult: '',
        bloodBankCity: '',
      };
      this.donorExists = null;
      this.donorId = null;
      this.activeStep = 1;
      this.success = false;
      this.error = null;
      this.loading = false;
      this.rejectedMessage = null;
    },
  },
});
