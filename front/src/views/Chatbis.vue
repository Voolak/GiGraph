<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-blue pa-2" permanent>
                <img class="ma-11 mb-2" src="../assets/logo.png" alt="logo" style="height: 100px">
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Romain Bedouret"></v-list-item>  
                    <v-file-input prepend-icon="" v-model="files" label="AJOUTER UN DOCUMENT" variant="solo-filled" multiple accept=".pdf,.csv,.sql" @change="ajouterDocument" class="custom-label"></v-file-input>
                    <v-card class="mx-auto" max-width="400">
                        <v-list :items="documents"></v-list>
                    </v-card>
                    <v-card class="mx-auto">
                        <v-list :items="items"></v-list>
                    </v-card>
                    <v-btn class="my-5">
                            Traiter les documents
                    </v-btn>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn class="btnn" block>
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
                    <div class="col chat">
                        <v-select label="Select" class="select"
                            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select>
                    </div>
                    <v-textarea class="mx-12 chat" counter label="Posez votre question ici" maxlength="50" single-line
                        v-model="question"></v-textarea>
                    <v-col cols="auto">
                        <v-btn @click="postMessage()" icon="mdi-send" size="x-large" class="bg-blue"></v-btn>
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

const documents = ref([
    { type: 'subheader', title: 'Vos documents' }
],);
</script>


<style>
.chat{
    background-color: rgba(33, 150, 243, 0.1);

}
.custom-label .v-label {
    opacity: 1 !important;
}

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