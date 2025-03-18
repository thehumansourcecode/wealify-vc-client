<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})
</script>
<template>
  <AuthForgotMain />
</template>
