<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import {ref} from "vue";

interface Inventory {
  item_name: string,
  material_type: string,
  weight: number,
  quantity: number,
  condition: string,
  creation_date: string
}

const  BASE_URL = 'http://localhost:3000'
const material_table_el = ref<JQuery<HTMLElement> | null>(null)
const columns = [
  { data: 'item_name', title: 'Name' },
  { data: 'material_type', title: 'Material' },
  { data: 'weight', title: 'Weight',
    render: (data: number, type: string, row: Inventory)=> {
      return `${row.weight} kg`
    }
  },
  { data: 'quantity', title: 'quantity',
    render: (data: number, type: string, row: Inventory)=> {
      return `${row.quantity} pcs`
    }
  },
  { data: 'condition', title: 'condition',
    render: (data: string, type: string, row: Inventory)=> {
      if (row.condition === 'good') {
        return `<span class="bg-conifer-500 text-white rounded-full px-4 py-1">${row.condition}</span>`
      } else if (row.condition === 'fair') {
        return `<span class="bg-main-500 text-white rounded-full px-4 py-1">${row.condition}</span>`
      } else {
        return `<span class="bg-yellow-500 text-white rounded-full px-4 py-1">${row.condition}</span>`

      }
    }
  },
  {data: 'creation_date', title: 'Date'}
]

const exceptedColumns = Array.from({ length: columns.length-1}, (v, k) => k)

$(document).ready(function() {
  material_table_el.value = $('#myTable');

  material_table_el.value?.DataTable({
    columns: columns,
    ajax: {
      url: `${BASE_URL}/data`,
      dataSrc: (json) => {
        console.log('data', json)
        return json;
      }
    },
    // for page length
    layout: {
      // topStart: null,
      topEnd: {
        search: {
          placeholder: 'Search here...'
        }
      }
    },
    scrollX: true,
    paging: false,
    select: true,
    responsive: true
  })
})

</script>

<template>

  <div>
    <div class="py-4">
      <p class="md:text-3xl text-2xl ">Communication</p>
    </div>
    <div class="min-w-80  p-8 shadow-2xl rounded-2xl border border-1 ">
      <div>
        <table id="myTable" class="display">
          <thead>
          <tr></tr>
          </thead>
          <tbody>
          <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>