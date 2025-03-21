<script setup lang="ts">
const profileStore = useProfileStore()
</script>
<template>
  <div>ID: {{ profileStore.profile?.id }}</div>
  <div>Name: {{ profileStore.profile?.full_name }}</div>
  <div>Email: {{ profileStore.profile?.email }}</div>
  <div>Phone Number: {{ profileStore.profile?.phone_number }}</div>
</template>
