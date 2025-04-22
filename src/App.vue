<script setup lang="ts">


import {useNotificationsStore} from "@/stores";
import ToastContainer from "@/components/commonComponent/toast/ToastContainer.vue";
import ToastAlert from "@/components/commonComponent/toast/ToastAlert.vue";

const notificationStore = useNotificationsStore()

</script>

<template>
<RouterView #default="{Component, route}">
  <template v-if="Component">
    <component :is="Component" :key="route.fullPath" />
  </template>
</RouterView>
<teleport to="body">
  <ToastContainer v-if="notificationStore.hasNotifications">
    <template v-for="notification in notificationStore.getNotifications" :key="notification.id">
      <ToastAlert
        v-if="notification.id && notification.isShown"
        :id="notification.id"
        :is-shown="notification.isShown"
        :message="notification.message"
        :type="notification.type"
      />
    </template>
  </ToastContainer>
</teleport>
</template>

<style scoped>

</style>
