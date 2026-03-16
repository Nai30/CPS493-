<script setup>
import { users} from '../store/userStore';

</script>

<template>
    <div class="pt-6">
         <button class="button is-primary"> Add User </button>
<table class="table">

    <thead>
        <tr>
            <th> </th>
            <th> </th>

        <th> Name </th>
        <th> Email adress</th>
        <th> Account type </th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>  <button class="button is-primary"> Delete User </button> </td>
        <td> <button class="button is-primary"> Edit </button></td>
        <td>{{users[0].name}} </td>
        <td>{{users[0].email}} </td>
        <td> {{ users[0].role }}</td>
        </tr>
        <tr>
         <td>  <button class="button is-primary"> Delete User </button> </td>
         <td> <button class="button is-primary"> Edit </button></td>
        <td>{{users[1].name}} </td>
        <td>{{users[1].email}} </td>
        <td> {{ users[1].role }}</td>
        </tr>


    </tbody>
</table>
    </div>
</template>

<style lang="scss" scoped>

</style>