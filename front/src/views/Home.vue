<template>
  <div class="main-container">
    <TopHeader />
    <v-container fluid class="font">
      <v-row class="d-flex justify-center align-center vh-100">
        <v-col cols="12" md="8">
          <v-card class="text-center">
            <v-card-text>
              <h3><strong>Bonjour et bienvenue sur GiGraph. </strong></h3><br>
              Grâce à cette application web, vous pouvez visualiser vos données sous forme de texte et/ou de graphe en
              chargeant vos documents .PDF, .TXT et .docs.
              <br><br>
              <strong>Attention :</strong> Veillez à toujours cliquer sur le bouton 'Traiter les documents' lorsque vous
              ajoutez/supprimez un nouveau document.
            </v-card-text>
            <v-card-text>
              <br>
              <h3><strong>Voici un exemple d'utilisation : </strong></h3><br>
              <strong>Première étape :</strong>
              Ajoutez un document (dans l'exemple ci dessous, nous avons téléchargé un document concernant l'alternance à
              l'IUT de bordeaux)
              <br><br>
              <strong>Deuxième étape :</strong>
              Poser une question sur votre document.<br>Si vous souhaitez une réponse graphique, il faut préciser dans
              l'énoncé de votre question, sous quelle forme vous souhaitez obtenir le résultat (texte ou graphique).
            </v-card-text>
            <v-img class="mx-16" :width="950" cover src="../assets/screen.png"></v-img>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <footer class="footer">
      <div class="graph-icon">GiGraph</div>
      <div class="year">2023</div>
    </footer>
  </div>
</template>

<script setup>
  import TopHeader from '@/components/TopHeader.vue'
</script>

<style>
  .font {
    background-color: rgba(33, 150, 243, 0.3);
  }

  .main-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .graph-icon {
    font-size: 20px;
    font-weight: bold;
  }

  .year {
    text-align: right;
  }
</style>