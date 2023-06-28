<template>
  <v-app>
    <v-main class="main">
      <v-container fluid fill-height>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="4">
            <v-card :loading="loading" align="center" outlined>
              <v-card-title class="login-title">
                <v-row align="center" justify="center">
                  <v-col cols="3">
                    <v-img src="../assets/logo.png" contain></v-img>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center">
                    <span class="login-title-text">GiGraph</span>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text class="text-center">
                <v-form>
                  <v-text-field v-model="email" label="Identifiant" outlined></v-text-field>
                  <v-text-field v-model="password" label="Mot de passe" outlined type="password"></v-text-field>
                  <v-btn @click="goChat" class="connexion-button--custom" dark>Connexion</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
            <v-alert v-if="alert" class="mt-6" density="compact" type="warning" title="Identifiant ou mot de passe incorrect"
              text="Veuillez vérifier vos informations de connexions"></v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref('')
const password = ref('')
const loading = ref(false)
const alert = ref(false)
const router = useRouter()

async function goChat() {
  if (email.value == "root" && password.value == "root") {
    loading.value = true
    await new Promise(r => setTimeout(r, 2000));
    router.push({ name: "Chat" });
  }
  else {
    loading.value = true
    await new Promise(r => setTimeout(r, 1000));
    alert.value = true
    loading.value = false
  }
}

</script>

<style>
.main {
  display: flex;
  align-items: center;
  background-color: #FFE4B5;
}

.login-title {
  margin-top: 20px;
  margin-bottom: 20px;
}

.login-title-text {
  font-size: 20px;
}

.connexion-button--custom {
  width: 30%;
  color: #000000;
}
</style>
