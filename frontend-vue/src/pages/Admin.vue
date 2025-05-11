<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import AppFooter from '@/components/AppFooter.vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const router = useRouter();
const tab = ref('0');
const donors = ref([]);
const requests = ref([]);
const stock = ref([]);
const loading = ref(false);
const username = ref('');
const password = ref('');
const token = ref(localStorage.getItem('token'));
const dialog = ref(false);
const selectedItem = ref(null);
const selectedDonationIndex = ref(null);

// blood stock headers
const bloodStockHeaders = ref([
  { text: 'Blood Type', value: 'bloodType' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'City', value: 'city' },
  { text: 'Donation Details', value: 'donationDetails' },
]);

const isExpired = (dateStr) => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
};

const deleteDonation = async (item, index) => {
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/${item._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete donation');
    }
    await fetchData(token.value, 'stock');
  } catch (error) {
    console.error('Error deleting donation:', error);
  } finally {
    loading.value = false;
  }
};

const openDeleteDialog = (item, index) => {
  selectedItem.value = item;
  selectedDonationIndex.value = index;
  console.log('Selected item:', selectedItem.value);
  console.log('Selected index:', selectedDonationIndex.value);
  dialog.value = true;
};

const confirmDelete = () => {
  console.log('Selected item:', selectedItem.value);
  console.log('Selected index:', selectedDonationIndex.value);
  if (selectedItem.value && selectedDonationIndex.value !== null) {
    deleteDonation(selectedItem.value, selectedDonationIndex.value);
  }
  dialog.value = false;
};

const hospitalRequestHeaders = [
  { text: 'Hospital Name', value: 'hospitalName' },
  { text: 'Blood Type', value: 'bloodType' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'City', value: 'city' },
  { text: 'Patient Status', value: 'patientStatus' },
  { text: 'Request Date', value: 'requestDate' },
  { text: 'Status', value: 'status' },
];
const donorHeaders = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Blood Type', value: 'bloodType' },
  { text: 'City', value: 'city' },
  { text: 'Last Donation Date', value: 'lastDonationDate' },
];

const fetchData = async function (authToken, details) {
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/${details}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (details === 'stock') {
      stock.value = data.data.bloodStock;
      console.log(stock.value);
    } else if (details === 'donors') {
      donors.value = data.data.donors;
      console.log(donors.value);
    } else if (details === 'hospitals-requests') {
      requests.value = data.data.hospitals;
      console.log(requests.value);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  const loginData = {
    username: username.value,
    password: password.value,
  };
  if (!username.value || !password.value) {
    console.error('Username and password are required');
    return;
  }
  loading.value = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Login failed');
    }

    localStorage.setItem('token', data.token);
    token.value = data.token;

    username.value = '';
    password.value = '';
    await fetchData(data.token, 'stock');
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  token.value = null;
  router.push('/admin');
};

onMounted(() => {
  if (token.value) {
    tab.value = '0';
    fetchData(token.value, 'stock');
  }
});
</script>

<template>
  <Navbar />

  <v-container v-if="!token" class="py-10">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-5">
          <v-card-title class="text-h5 text-center">Admin Dashboard</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="username" label="Username" required type="text" />
              <v-text-field v-model="password" label="Password" required type="password" />
              <v-btn block color="red-darken-4" @click="handleLogin"> Login </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-if="token" class="py-10">
    <v-row align="center" justify="space-between">
      <v-col>
        <h1>Admin Dashboard</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="handleLogout">Logout</v-btn>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab value="0" @click="fetchData(token, 'stock')">Blood Stock</v-tab>
      <v-tab value="1" @click="fetchData(token, 'donors')">Donors</v-tab>
      <v-tab value="2" @click="fetchData(token, 'hospitals-requests')"> Hospital Requests</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-if="tab === '0'" value="0">
        <v-card flat>
          <v-card-text>
            <v-list-item-title class="text-h5 mb-4">Blood Stock Management</v-list-item-title>
            <v-data-table class="elevation-1" :headers="bloodStockHeaders" :items="stock">
              <template #item.bloodType="{ item }">
                <v-list-item-title class="text-h6">{{ item.bloodType }}</v-list-item-title>
              </template>
              <template #item.quantity="{ item }">
                <v-list-item-title class="text-h6">{{ item.quantity }}</v-list-item-title>
              </template>
              <template #item.city="{ item }">
                <v-list-item-title class="text-h6">{{ item.city }}</v-list-item-title>
              </template>

              <template #item.donationDetails="{ item }">
                <v-row class="donation-card-container">
                  <v-col
                    v-for="(donation, index) in item.donations"
                    :key="index"
                    cols="12"
                    lg="4"
                    md="8"
                  >
                    <v-card
                      class="pa-3"
                      :class="
                        isExpired(donation.expirationDate)
                          ? 'bg-red-lighten-3'
                          : 'bg-grey-lighten-1'
                      "
                      outlined
                    >
                      <v-card-title class="d-flex justify-space-between align-center">
                        <div>
                          <h5 class="headline mb-1">Donor: {{ donation.donor.name }}</h5>
                          <h5 class="subheading">Expires: {{ donation.expirationDate }}</h5>
                        </div>
                        <v-btn
                          v-if="isExpired(donation.expirationDate)"
                          icon="mdi-delete"
                          variant="text"
                          @click="openDeleteDialog(donation, index)"
                        />
                      </v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="tab === '2'" value="2">
        <v-card flat>
          <v-card-text>
            <v-list-item-title class="text-h5"> Hospital Requests Management </v-list-item-title>
            <v-data-table class="elevation-1" :headers="hospitalRequestHeaders" :items="requests">
              <template #item.hospitalName="{ item }">
                <v-list-item-title class="text-h6">{{ item.hospitalName }}</v-list-item-title>
              </template>
              <template #item.bloodType="{ item }">
                <v-list-item-title class="text-h6">{{ item.bloodType }}</v-list-item-title>
              </template>
              <template #item.quantity="{ item }">
                <v-list-item-title class="text-h6">{{ item.quantity }}</v-list-item-title>
              </template>
              <template #item.city="{ item }">
                <v-list-item-title class="text-h6">{{ item.city }}</v-list-item-title>
              </template>
              <template #item.patientStatus="{ item }">
                <v-list-item-title class="text-h6">{{ item.patientStatus }}</v-list-item-title>
              </template>
              <template #item.requestDate="{ item }">
                <v-list-item-title class="text-h6">{{ item.requestDate }}</v-list-item-title>
              </template>
              <template #item.status="{ item }">
                <v-list-item-title class="text-h6">{{ item.status }}</v-list-item-title>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="tab === '1'" value="1">
        <v-card flat>
          <v-card-text>
            <v-list-item-title class="text-h5"> Donors Management </v-list-item-title>
            <v-data-table class="elevation-1" :headers="donorHeaders" :items="donors">
              <template #item.name="{ item }">
                <v-list-item-title class="text-h6">{{ item.name }}</v-list-item-title>
              </template>
              <template #item.email="{ item }">
                <v-list-item-title class="text-h6">{{ item.email }}</v-list-item-title>
              </template>
              <template #item.city="{ item }">
                <v-list-item-title class="text-h6">{{ item.city }}</v-list-item-title>
              </template>
              <template #item.lastDonationDate="{ item }">
                <v-list-item-title class="text-h6">{{ item.lastDonationDate }}</v-list-item-title>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this donation?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <AppFooter />
</template>

<style scoped>
h1 {
  margin: 0;
}

.donation-card-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
