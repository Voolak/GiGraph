<template>
  <v-app>
    <v-main class="main">
      <v-container fluid fill-height>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="4">
            <v-card loading align="center" outlined>
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
                  <v-text-field label="Identifiant" outlined></v-text-field>
                  <v-text-field label="Mot de passe" outlined type="password"></v-text-field>
                  <v-btn class="connexion-button--custom" dark>Connexion</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>

main{
  background-color: #FFE4B5;
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
