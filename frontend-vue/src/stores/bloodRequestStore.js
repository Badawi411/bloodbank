import { defineStore } from 'pinia';
import { toRaw } from 'vue';

export const useBloodRequestStore = defineStore('bloodRequest', {
  state: () => ({
    requestForm: {
      hospitalName: '',
      bloodType: '',
      quantity: '',
      city: '',
      patientStatus: '',
    },
    loading: false,
    error: null,
    success: false,
  }),

  actions: {
    async submitRequest() {
      this.loading = true;
      this.error = null;
      this.success = false;

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

      if (
        !this.requestForm.hospitalName ||
        !this.requestForm.bloodType ||
        !this.requestForm.quantity ||
        !this.requestForm.city ||
        !this.requestForm.patientStatus
      ) {
        this.error = 'All fields are required.';
        this.loading = false;
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/hospitals/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.requestForm),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit request');
        }

        this.success = true;
        this.resetForm();
      } catch (err) {
        this.error =
          err.message || 'Failed to submit request. Please try again.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.requestForm = {
        hospitalName: '',
        bloodType: '',
        quantity: '',
        city: '',
        patientStatus: '',
      };
    },
  },
});
