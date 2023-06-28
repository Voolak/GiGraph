<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-deep-purple pa-2" theme="dark" permanent>
                <img class="ma-11 mb-2" src="../assets/logo.png" alt="logo" style="height: 100px">
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Bastien Oswald" class="mb-7"></v-list-item>
                    <v-btn class="ajouter" @click="ouvrirGestionnaireFichiers">Ajouter un document</v-btn>
                    <v-card class="mx-auto" max-width="400">
                        <v-list :items="documents"></v-list>
                    </v-card>
                    <v-btn class="my-5">
                        Traiter les documents
                    </v-btn>
                    <!-- <v-card class="mx-auto" max-width="400">
                        <v-list :items="discussions"></v-list>
                    </v-card> -->
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
                    <div v-for="message in messages" class="mb-12">
                        <v-row v-if="message.type == 1">
                            <b-col class="text-right"><img class="mx-5 mb-2" src="../assets/logo.png" alt="logo"
                                    style="height: 30px"></b-col>
                            <b-col>
                                <p v-if="message.loading == false">{{ message.message }}</p>
                                <p v-if="message.loading == true"><v-progress-circular color="primary"
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
                            label="Two rows" rows="2" row-height="20"></v-textarea>
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

const question = ref("");
const messages = ref([])
const loading = ref(false);

const documents = ref([
    { type: 'subheader', title: 'Vos documents' },
    {
        title: 'Item #1',
        value: 1,
    },
    {
        title: 'Item #2',
        value: 2,
    },
    {
        title: 'Item #3',
        value: 3,
    }
],);

const discussions = ref([
    { type: 'subheader', title: 'Vos dicussions' },
    {
        title: 'Item #4',
        value: 4,
    },
    {
        title: 'Item #5',
        value: 5,
    },
    {
        title: 'Item #6',
        value: 6,
    },
],);


async function postMessage() {
    if (question.value != "") {
        loading.value = true;
        messages.value.push({ 'message': question.value, 'type': 0 });
        messages.value.push({ 'message': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat nibh eget metus consequat volutpat", 'type': 1, 'loading': true });

        question.value = ""

        await new Promise(r => setTimeout(r, 2000));

        const lastMessage = messages.value[messages.value.length - 1];
        lastMessage.loading = false;
        loading.value = false;

        // const chatContainer = document.querySelectorAll('.messages')[0];
        // chatContainer.scrollTop = chatContainer.scrollHeight
    }

}

</script>

<style>
.messages {
    padding: 5vh 5vw;
    height: calc(100vh - 240px);
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
    max-width: 30em;
    background-color: #fff;
    padding: 1.125em 1.5em;
    font-size: 1.25em;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}
</style>