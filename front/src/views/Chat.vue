<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-blue pa-2 pt-10" theme="" permanent>
                <v-img class="mx-16" :width="100" cover src="../assets/logo.png"></v-img>
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Robert Girafe" class="mb-7"></v-list-item>
                    <v-file-input prepend-icon="" v-model="files" label="AJOUTER UN DOCUMENT" variant="solo-filled" 
                      accept=".pdf,.csv,.sql" @change="ajouterDocument" class="custom-label"></v-file-input>
                    <v-card class="mx-auto" max-width="400">
                        <v-list v-show="showdocuments">
                            <v-card v-for="(document, index) in documents" :key="index" class="mx-auto" max-width="400">
                                <v-list-item :style="{ border: !document[1] && !document.title ? '2px solid red' : '' }">
                                    <v-list-item-content class="centered-content">
                                      <v-list-item-title v-if="index === 0">{{ document.title }}</v-list-item-title>
                                      <template v-else>
                                        <v-list-item-subtitle>{{ document[0] }}</v-list-item-subtitle>
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
                    <div v-if="hasToTreatDocs" :style="{fontSize: '17px', padding: '3px', backgroundColor: 'white', margin: 'auto', opacity: '60%', width: '90%', borderRadius: '5px', color: 'red', textAlign: 'center', marginTop: '10px'}">Vous avez des documents à traiter.</div>
                    <v-btn v-show="hasToTreatDocs" class="my-5" @click="traiterDocuments()">
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
      <v-main style="height: 100vh">
        <div class="messages">
          <div v-show="showdocuments" v-for="message in messages" class="mb-12">
            <v-row v-if="message.type == 1">
              <b-col class="text-right"><img class="mx-5 mb-2" src="../assets/logo.png" alt="logo"
                  style="height: 30px"></b-col>
              <b-col>
                <p v-show="message.loading == false">
                <div v-if="message.isMessage == true">{{ message.message }}</div>
                <div v-else :id="'graph' + (message.id).toString()" style="width: 800px;height:400px;">
                </div>

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
            style="font-size: 20px; align-items: center; display: flex; justify-content: center; margin-top: 40vh">
            Veuillez
            ajouter des documents avant de poser une question
          </div>
        </div>

        <v-form v-if="showdocuments" validate-on="submit lazy" @submit.prevent="submit" style="width: ;">
          <v-row class="ask" align="center" justify="center">
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

  const showdocuments = ref(false);
  const hasToTreatDocs = ref(false);

  const documents = ref([
    { type: 'subheader', title: 'Vos documents' }
  ],);

  const discussions = ref([
    { type: 'subheader', title: 'Vos dicussions' }
  ],);

  onMounted(() => {
    axios
      .get('http://127.0.0.1:3000/document/get', { 
        params: {
          userId: 1,
        }
      }).then(response => {
        console.log('success');
        response.data.map((line) => {
          let processed = true;
          if (line[1] !== 'PROCESSED') {
            hasToTreatDocs.value = true;
            processed = false;
          }
          documents.value.push([line[0].name, processed, line[0].id]);
        });
        
        shouldTreatDocs();
        
        showdocuments.value = documents.value.length > 1;
      }).catch(error => {
        console.error(error);
      });
  });

  async function postMessage() {
    if (question.value != "") {
      var id = counter.value;
      loading.value = true;
      messages.value.push({ 'message': question.value, 'type': 0 });
      messages.value.push({ 'type': 1, 'loading': true, 'id': id });
      counter.value++;
      
      const options = {
        method: 'POST',
        url: 'http://127.0.0.1:3000/backend/agent',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          prompt: question.value
        }
      };

      axios.request(options).then(function (response) {
        const graph = response.data.response;
        console.log(graph);
        const lastMessage = messages.value[messages.value.length - 1];
        lastMessage.loading = false;
        loading.value = false;
        question.value = "";
        var myChart;
        var option;
        console.log('graph' + (counter.value - 1).toString());
        if (graph.type) {
          myChart = echarts.init(document.getElementById('graph' + (counter.value - 1).toString()));
        }

      console.log("Graph type :" + graph.type)
      switch (graph.type) {
        case 'bar': option = {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          title: {
            text: graph.title
          },
          tooltip: {},
          legend: {
            data: [graph.name]
          },
          xAxis: {
            data: graph.columnsName
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              data: graph.values
            }
          ]
        };
          // Display the chart using the configuration items and data just specified.
          myChart.setOption(option);
          break;
        case 'pie': option = {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          title: {
            text: graph.title,
            subtext: graph.subtitle,
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: graph.datas,
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
          // Display the chart using the configuration items and data just specified.
          myChart.setOption(option);
          break;
        case 'line': option = {
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: graph.columnsName
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              data: graph.values,
              type: 'line',
              areaStyle: {}
            }
          ]
        };
          // Display the chart using the configuration items and data just specified.
          myChart.setOption(option);
          break;
        default:
          console.log(response);
          question.value = "";
          messages.value.pop();
          messages.value.push({ 'message': response.data.response, 'type': 1, 'loading': false, "isMessage": true });

          const lastMessage = messages.value[messages.value.length - 1];
      };

    }).catch(function (error) {
      console.error(error);
    });


    // const chatContainer = document.querySelectorAll('.messages')[0];
    // chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  function ajouterDocument() {
    let formData = new FormData();
    formData.append('file', files.value[files.value.length - 1])

    let documentSaved;
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
        documentSaved = response.document;
        console.log('success');
      }).catch(function (error) {
        console.error(error);
      });

    documents.value.push([documentSaved.name, false, documentSaved.id]);
    files.value = [];
    afficherDocuments();
    shouldTreatDocs();
  }

  function deleteDocument(index) {
    if (index > 0) {
      axios.post('http://127.0.0.1:3000/document/delete',
      {
        documentId: documents.value[index][2]
      })
      .then(function (response) {
        console.log('success');
      }).catch(function (error) {
        console.error(error);
      });
      
      documents.value.splice(index, 1);
      afficherDocuments();
      shouldTreatDocs();
    }
  }

  function afficherDocuments() {
    if (documents.value.length >= 2) {
      showdocuments.value = true;
    } else {
      showdocuments.value = false;
    }
  }

  function shouldTreatDocs() {
    let hasOneNotProcessed = false;
    documents.value.map((line) => {
      if (!line[1] && !line.title) {
        hasOneNotProcessed = true;
      }
    });
    hasToTreatDocs.value = hasOneNotProcessed;
  }

  function traiterDocuments() {
    axios
      .get('http://127.0.0.1:3000/backend/embedding', { 
        params: {
          userId: 1,
        }
      }).then(response => {
        console.log('success');
        
        documents.value.map((line) => {
          if (!line.title) {
            line[1] = true;
          }
        });

        hasToTreatDocs.value = false;
      }).catch(error => {
        console.error(error);
      });
    
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