<script setup>
import { onMounted, ref, toRaw, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();
const tab = ref(0);
// const donors = ref([]);
// const requests = ref([]);
// const stock = ref([]);
const loading = ref(false);
const username = ref('');
const password = ref('');
const token = ref(localStorage.getItem('token'));

// blood stock headers
const bloodStockHeaders = [
  { text: 'Blood Type', value: 'bloodType' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'City', value: 'city' },
  { text: 'Donor Name', value: 'donorName' },
  { text: 'Expire Date', value: 'expireDate' },
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false },
];

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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const fetchData = async function (authToken) {
  loading.value = true;
  try {
    const [donorRes, requestRes, stockRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/v1/admin/donors`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${API_BASE_URL}/api/v1/admin/hospitals-requests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${API_BASE_URL}/api/v1/admin/stock`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    if (!donorRes.ok || !requestRes.ok || !stockRes.ok) {
      throw new Error('Failed to fetch data');
    }

    // Assuming the API returns JSON data

    // donors.value = await donorRes.json();
    // requests.value = await requestRes.json();
    // stock.value = await stockRes.json();
    // console.log(toRaw(stock.value).data.bloodStock);
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
    await fetchData(data.token);
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
    fetchData(token.value);
  }
});
</script>

<template>
  <Navbar />

  <v-container class="py-10" v-if="!token">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-5">
          <v-card-title class="text-h5 text-center"
            >Admin Dashboard</v-card-title
          >
          <v-card-text>
            <v-form>
              <v-text-field
                label="Username"
                type="text"
                v-model="username"
                required
              ></v-text-field>
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                required
              ></v-text-field>
              <v-btn color="red-darken-4" block @click="handleLogin">
                Login
              </v-btn>
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
      <v-tab value="0">Blood Stock</v-tab>
      <v-tab value="1">Donors</v-tab>
      <v-tab value="2">Hospital Requests</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="0">
        <v-card flat>
          <v-card-text>
            <v-data-table class="elevation-1" />
            <v-row>
              <v-col cols="12">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <div></div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item value="1">
        <v-card flat>
          <v-card-text>
            <v-data-table
              :headers="hospitalRequestHeaders"
              :items="requests"
              class="elevation-1"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-data-table
              :headers="donorHeaders"
              :items="donors"
              class="elevation-1"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>

    <!-- <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          <v-row justify="center">
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </v-container>
  <AppFooter />
</template>

<style scoped>
h1 {
  margin: 0;
}
</style>
