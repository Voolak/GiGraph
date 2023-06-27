<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-deep-purple pa-2" theme="dark" permanent>
                <img class="ma-11 mb-2" src="../assets/logo.png" alt="logo" style="height: 100px">
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Romain Bedouret"></v-list-item>  
                    <div>
                        <v-file-input prepend-icon="" v-model="files" label="Ajouter un document" variant="solo-filled" @change="ajouterDocument"></v-file-input>
                        <v-card class="mx-auto">
                          <v-list :items="items"></v-list>
                        </v-card>
                      </div>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block>
                            Logout
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
            <v-main style="height: 100vh">
                <div class="messages">
                    <div v-for="message in messages" class="mb-5">
                        <v-row v-if="message.type == 0">
                            <b-col><v-icon size="x-large" color="green-darken-2" icon="mdi-account-box"
                                    class="mx-8"></v-icon></b-col>
                            <b-col>
                                <p>{{ message.message }}</p>
                            </b-col>
                        </v-row>
                        <v-row v-if="message.type == 1" style="justify-content: end;">
                            <b-col class="text-right">
                                <p>{{ message.message }}</p>
                            </b-col>
                            <b-col class="text-right"><img class="ma-11 mb-2" src="../assets/logo.png" alt="logo" style="height: 30px"></b-col>
                        </v-row>
                    </div>

                </div>
                <v-row class="ask" align="center" justify="center">
                    <div class="col">
                        <v-select label="Select" class="select"
                            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select>
                    </div>
                    <v-textarea class="mx-12" counter label="Posez votre question ici" maxlength="50" single-line
                        v-model="question"></v-textarea>
                    <v-col cols="auto">
                        <v-btn @click="postMessage()" icon="mdi-send" size="x-large" color="deep-purple"></v-btn>
                    </v-col>
                </v-row>
            </v-main>
        </v-layout>
    </v-card>
</template>
  
<script setup>
import { reactive, ref, onMounted } from "vue";

const question = ref("");
const messages = ref([]);
const files = ref([]);
const items = ref([]);

function postMessage() {
    messages.value.push({ 'message': question.value, 'type': 0 })
    messages.value.push({ 'message': "ta gueule enfete", 'type': 1 })
}

function ajouterDocument() {
  items.value.push(files.value[files.value.length - 1].name);
}
</script>


<style>
.messages {
    padding: 2.5vw;
  height:50vh;
}

.ask {
    display: flex;
    justify-content: center;
    width: calc(100% - 300px);
    position: absolute;
    bottom: 30px;
    left: 300px;

}

.select {
    width: 150px;
    max-height: 150px;
    font-size: 11px;
    height: 100px;
}

p {
    position: relative;
    max-width: 30em;
    background-color: #fff;
    padding: 1.125em 1.5em;
    font-size: 1.25em;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}
.ajouter{
    margin: 20px;
}
</style>