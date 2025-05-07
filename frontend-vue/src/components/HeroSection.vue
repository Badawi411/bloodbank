<template>
  <div class="hero-section">
    <v-container max-width="lg">
      <v-row align="center" justify="left">
        <v-col cols="12" class="ml-6">
          <div class="hero-content">
            <h1 class="text-h3 font-weight-bold mb-4">
              Donate Blood, Save Lives
            </h1>
            <p class="text-h5 mb-6">
              Your donation can make a difference. Join our mission to ensure
              blood supply for those in need.
            </p>
            <div class="d-flex flex-wrap gap-6" style="gap: 16px">
              <RouterLink to="/donor">
                <v-btn color="red-darken-4" large>Donate Now</v-btn>
              </RouterLink>
              <RouterLink to="/hospital">
                <v-btn
                  variant="outlined"
                  color="white"
                  large
                  class="text-white border-white"
                  >Request Blood</v-btn
                >
              </RouterLink>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;

  color: white;
  padding: 64px 0;
  margin-bottom: 32px;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 24px;
}
</style>
