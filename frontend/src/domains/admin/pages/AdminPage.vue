<template>
    <div class="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard. Only users with the `ROLE_ADMIN` can access this page.</p>
    </div>
    </template>
    
<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
    