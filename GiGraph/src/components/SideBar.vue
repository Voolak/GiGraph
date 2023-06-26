<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-deep-purple pa-2" theme="dark" permanent>
                <img class="ma-11 mb-2" src="../assets/logo.png" alt="logo" style="height: 100px">
                <v-list color="transparent">
                    <v-list-item prepend-icon="mdi-account-box" title="Bastien Oswald" class="mb-7"></v-list-item>
                    <v-card class="mx-auto" max-width="400">
                        <v-list :items="items"></v-list>
                    </v-card>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block>
                            Logout
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
            <v-main>salut</v-main>
        </v-layout>
    </v-card>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";

const items = ref([
    { type: 'subheader', title: 'Vos ducuments' },
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
    },
    { type: 'divider' },
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

</script>