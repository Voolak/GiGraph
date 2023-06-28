<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-deep-purple pa-2 pt-10" theme="dark" permanent>
                <v-img class="mx-16" :width="100" cover src="../assets/logo.png"></v-img>
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Bastien Oswald" class="mb-7"></v-list-item>
                    <v-file-input class="white--text" prepend-icon="" v-model="files" label="Ajouter un document"
                        variant="solo-filled" @change="ajouterDocument"></v-file-input>
                    <v-card class="mx-auto" max-width="400">
                        <v-list v-show="showdocuments" :items="documents"></v-list>
                    </v-card>
                    <v-btn v-show="showdocuments" class="my-5">
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
                    <div v-for="message in messages" class="mb-12">
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
                            <b-col><v-icon size="x-large" color="green-darken-2" icon="mdi-account-box"
                                    class="mx-8"></v-icon></b-col>

                        </v-row>
                    </div>

                </div>

                <v-form validate-on="submit lazy" @submit.prevent="submit" style="width: ;">
                    <v-row class="ask" align="center" justify="center">
                        <div class="col">
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
                        </div>
                        <!-- <v-textarea class="mx-12" counter label="Posez votre question ici" maxlength="50" single-line
                        v-model="question"></v-textarea> -->
                        <v-textarea v-model="question" hide-details class="mx-14" variant="filled" auto-grow
                            label="Posez votre question" rows="2" row-height="20"></v-textarea>
                        <v-col cols="auto">
                            <v-btn type="submit" :disabled="loading" @click="postMessage()" icon="mdi-send" size="x-large"
                                color="deep-purple"></v-btn>
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
import * as echarts from 'echarts';


const router = useRouter()

const question = ref("");
const messages = ref([])
const loading = ref(false);
const counter = ref(0)
const files = ref([]);

const showdocuments = ref(false);

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
                    text: 'ECharts Getting Started Example'
                },
                tooltip: {},
                legend: {
                    data: ['sales']
                },
                xAxis: {
                    data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
                },
                yAxis: {},
                series: [
                    {
                        name: 'sales',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }
                ]
            };
        } if (counter.value == 2) {
            option = {
                title: {
                    text: 'Referer of a Website',
                    subtext: 'Fake Data',
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
                        data: [
                            { value: 1048, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                            { value: 580, name: 'Email' },
                            { value: 484, name: 'Union Ads' },
                            { value: 300, name: 'Video Ads' }
                        ],
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
        } if(counter.value == 3) {
            option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)'
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 402, 231, 134, 190, 230, 120]
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)'
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 302, 181, 234, 210, 290, 150]
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
    afficherDocuments();
}

function afficherDocuments() {
    if (documents.value.length >= 2) {
        showdocuments.value = true;
    } else {
        showdocuments.value = false;
    }
}

</script>

<style>
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