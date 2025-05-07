<template>
  <v-footer class="bg-grey-lighten-3 pa-8">
    <v-container>
      <v-row>
        <!-- About Us -->
        <v-col cols="12" sm="4">
          <h6 class="mb-2 text-h6">About Us</h6>
          <p class="text-body-2" style="color: rgba(0, 0, 0, 0.6)">
            We are dedicated to saving lives through efficient blood donation
            management. Our mission is to connect donors with those in need.
          </p>
        </v-col>

        <!-- Contact Us -->
        <v-col cols="12" sm="4">
          <h6 class="mb-2 text-h6">Contact Us</h6>
          <p class="text-body-2" style="color: rgba(0, 0, 0, 0.6)">
            123 Main Street, Anytown, Egypt
          </p>
          <p class="text-body-2" style="color: rgba(0, 0, 0, 0.6)">
            Email: info@bloodbank.com
          </p>
          <p class="text-body-2" style="color: rgba(0, 0, 0, 0.6)">
            Phone: +20 123 456 789
          </p>
        </v-col>

        <!-- Follow Us -->
        <v-col cols="12" sm="4">
          <h6 class="mb-2 text-h6">Follow Us</h6>
          <v-btn
            icon
            :href="'https://www.facebook.com/'"
            target="_blank"
            variant="text"
          >
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn
            icon
            :href="'https://www.instagram.com/'"
            target="_blank"
            variant="text"
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn
            icon
            :href="'https://www.twitter.com/'"
            target="_blank"
            variant="text"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Copyright -->
      <v-row justify="center" class="mt-8">
        <v-col cols="12" class="text-center">
          <p class="text-body-2" style="color: rgba(0, 0, 0, 0.6)">
            © {{ new Date().getFullYear() }}
            <RouterLink
              to="/"
              style="color: rgba(0, 0, 0, 0.6); text-decoration: underline"
            >
              Blood Bank Management System
            </RouterLink>
            .
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
