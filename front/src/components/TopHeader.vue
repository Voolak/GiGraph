<template>
    <header>
        <div class="right">
            <img src="../assets/logo.png" alt="logo">
            <h1>GiGraph</h1>
        </div>
        <v-btn @click="connexion">
            Connexion
        </v-btn>
    </header>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter()

function connexion() {
  router.push({ name: "Login"});
}
</script>

<style>
header {
    height: 125px;
    width: 100%;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .15) !important;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 5vw;
}

header .right {
    display: flex;
    flex-direction: row;
    align-items: center;
}

header .right img {
    width: 100px;
    margin-right: 30px;
}
</style>