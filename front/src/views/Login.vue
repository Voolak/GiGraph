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
            <v-alert v-if="alert" class="mt-6" density="compact" type="warning"
              title="Identifiant ou mot de passe incorrect"
              text="Veuillez vÃ©rifier vos informations de connexions"></v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';

const email = ref('')
const password = ref('')
const loading = ref(false)
const alert = ref(false)
const router = useRouter()

async function goChat() {
  const options = {
    method: 'POST',
    url: 'http://127.0.0.1:3000/auth/login',
    headers: {
      cookie: 'connect.sid=s%253AhX8dQcHMbpo3ngx8QbkCi2mBhz-VxToN.8fvPraHK4PaSOkeQUNX9xi34cnqqwhBIpwn2314wX%252BM',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { email: email.value, password: password.value }
  };

  axios.request(options).then(function (response) {
    if (response.status == 200) {
      loading.value = true
      router.push({ name: "Chat" });
    } else {
      loading.value = true
      alert.value = true
      loading.value = false
    }
  }).catch(function (error) {
    console.error(error);
    loading.value = true
    alert.value = true
    loading.value = false
  });
}

</script>

<style>
main {
  background-color: rgba(33, 150, 243, 0.3);
  display: flex;
  align-items: center;
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