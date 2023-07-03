<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer class="bg-deep-purple pa-2 pt-10" theme="dark" permanent>
        <v-img class="mx-16" :width="100" cover src="../assets/logo.png"></v-img>
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-account-box" title="Bastien Oswald" class="mb-7"></v-list-item>
          <v-file-input prepend-icon="" v-model="files" label="AJOUTER UN DOCUMENT" variant="solo-filled"
            accept=".pdf,.csv,.sql" @change="ajouterDocument" class="custom-label"></v-file-input>
          <v-card class="mx-auto" max-width="400">
            <v-list v-show="showdocuments">
              <v-card v-for="(document, index) in documents" :key="index" class="mx-auto" max-width="400">
                <v-list-item>
                  <v-list-item-content class="centered-content">
                    <v-list-item-title v-if="index === 0">{{ document.title }}</v-list-item-title>
                    <template v-else>
                      <v-list-item-subtitle>{{ document }}</v-list-item-subtitle>
                      <v-list-item-action class="align-right">
                        <v-btn size="x-small" variant="outlined" icon @click="deleteDocument(index)">
                          <v-icon size="x-large">mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </template>
                  </v-list-item-content>
                </v-list-item>

              </v-card>
            </v-list>
          </v-card>
          <v-btn v-show="showtraiterdocuments" class="my-5" @click="traiterDocuments()">
            Traiter les documents
          </v-btn>
        </v-list>



        <template v-slot:append>
          <div class="pa-2">
            <v-btn @click="goBack" block>
              Déconnexion
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 100vh; background-color: white">
        <div class="messages">
          <div v-show="showdocuments" v-for="message in messages" class="mb-12">
            <v-row v-if="message.type == 1">
              <b-col class="text-right"><img class="mx-5 mb-2" src="../assets/logo.png" alt="logo"
                  style="height: 30px"></b-col>
              <b-col>
                <p v-show="message.loading == false">
                <div :id="'graph' + (message.id).toString()" style="width: 800px;height:400px;"></div>
                </p>
                <p v-show="message.loading == true"><v-progress-circular color="primary"
                    indeterminate></v-progress-circular></p>
              </b-col>
            </v-row>
            <v-row v-if="message.type == 0" style="justify-content: end;">
              <b-col class="text-right">
                <p>{{ message.message }}</p>
              </b-col>
              <b-col><v-icon size="x-large" color="green-darken-2" icon="mdi-account-box" class="mx-8"></v-icon></b-col>

            </v-row>
          </div>
          <div v-show="!showdocuments"
            style="font-size: 20px; align-items: center; display: flex; justify-content: center; margin-top: 40vh">Veuillez
            ajouter des documents avant de poser une question</div>
        </div>

        <v-form v-if="showdocuments" validate-on="submit lazy" @submit.prevent="submit" style="width: ;">
          <v-row class="ask" align="center" justify="center">
            <!-- <div class="col">
                            <v-select :items="items2" item-value="value" item-text="text"
                                :menu-props="{ offsetY: true, closeOnContentClick: false }">
                                <template #selection="{ item }">
                                    <v-img src="../assets/logo.png" max-height="20" max-width="20"></v-img>
                                </template>
                                <template #item="{ item }">
                                    <v-list-item-avatar>
                                        <v-img src="../assets/logo.png" max-height="20" max-width="20"></v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.value }}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-select>
                        </div> -->
            <!-- <v-textarea class="mx-12" counter label="Posez votre question ici" maxlength="50" single-line
                        v-model="question"></v-textarea> -->
            <!-- <div class="col chat">
              <v-select label="Select" class="select" hide-details hide-no-data
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select>
            </div> -->
            <v-textarea v-model="question" hide-details class="mx-14 chat " variant="filled" auto-grow
              label="Envoyer un message" rows="2" row-height="20"></v-textarea>
            <v-col cols="auto">
              <v-btn type="submit" :disabled="loading" @click="postMessage()" icon="mdi-send" size="x-large"
                class="bg-blue"></v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-main>
    </v-layout>
  </v-card>
</template>
  
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';
import * as echarts from 'echarts';

const router = useRouter()

const question = ref("");
const messages = ref([])
const loading = ref(false);
const counter = ref(0)
const files = ref([]);
const datas = ref({
  title: 'Je suis un graph',
  subtitle: 'sous-graph',
  datas: [{ value: 1048, name: 'Search Engine' },
  { value: 735, name: 'Direct' },
  { value: 580, name: 'Email' },
  { value: 484, name: 'Union Ads' },
  { value: 300, name: 'Video Ads' }]
})

const bar = ref({
  title: 'je suis un bar chart',
  columnsName: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks'],
  values: [5, 20, 36, 10, 10, 20],
  name: 'sales'
})

const line = ref({
  values: [820, 932, 901, 934, 1290, 1330, 1320],
  columnsName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

const showdocuments = ref(false);
const showtraiterdocuments = ref(false);

const documents = ref([
  { type: 'subheader', title: 'Vos documents' }
],);

const discussions = ref([
  { type: 'subheader', title: 'Vos dicussions' }
],);

function goBack() {
  router.push({ name: "Login" });
}

async function postMessage() {
  if (question.value != "") {
    var id = counter.value
    loading.value = true;
    messages.value.push({ 'message': question.value, 'type': 0 });
    messages.value.push({ 'type': 1, 'loading': true, 'id': id });
    counter.value++
    question.value = ""

    await new Promise(r => setTimeout(r, 2000));

    const lastMessage = messages.value[messages.value.length - 1];
    lastMessage.loading = false;
    loading.value = false;
    console.log('graph' + (counter.value - 1).toString())
    var myChart = echarts.init(document.getElementById('graph' + (counter.value - 1).toString()));
    var option;
    if (counter.value == 1) {
      option = {
        title: {
          text: bar.value.title
        },
        tooltip: {},
        legend: {
          data: [bar.value.name]
        },
        xAxis: {
          data: bar.value.columnsName
        },
        yAxis: {},
        series: [
          {
            name: 'sales',
            type: 'bar',
            data: bar.value.values
          }
        ]
      };
    } if (counter.value == 2) {
      option = {
        title: {
          text: datas.value.title,
          subtext: datas.value.subtitle,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data:
              datas.value.datas
            ,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    } if (counter.value == 2) {
      option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: line.value.columnsName
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: line.value.values,
            type: 'line',
            areaStyle: {}
          }
        ]
      };
    }
    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);
  }

}

function ajouterDocument() {
  documents.value.push(files.value[files.value.length - 1].name);
  console.log(files.value[files.value.length - 1], files);
  let formData = new FormData();
  formData.append('file', files.value[files.value.length - 1])

  axios.post('http://127.0.0.1:3000/document/uploadDocument',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Size': files.value[files.value.length - 1].size
      }
    })
    .then(function (response) {
      console.log(response);
      console.log(response.data.res);
      console.log('success');
    }).catch(function (error) {
      console.error(error);
    });

  files.value = [];
  afficherDocuments();
}

function deleteDocument(index) {
  if (index > 0) {
    documents.value.splice(index, 1);
    afficherDocuments();
  }
}

function afficherDocuments() {
  if (documents.value.length >= 2) {
    showdocuments.value = true;
    showtraiterdocuments.value = true
  } else {
    showdocuments.value = false;
    showtraiterdocuments.value = false
  }
}

function traiterDocuments() {
  showtraiterdocuments.value = false;
}

</script>

<style>
.centered-content {
  display: flex;
  align-items: center;
}

.align-right {
  margin-left: auto;
}


.chat {
  background-color: rgba(33, 150, 243, 0.1);

}

.custom-label .v-label {
  opacity: 1 !important;
}

.messages {
  padding: 5vh 5vw;
  height: calc(100vh - 125px);
  overflow: auto;
}

.ask {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vw;
  position: absolute;
  bottom: 5vh;
  left: 32vw;
}

.select {
  width: 150px;
  max-height: 150px;
  font-size: 11px;
  height: 100px;
}

p {
  position: relative;
  background-color: #fff;
  padding: 1.125em 1.5em;
  font-size: 1em;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}
</style>