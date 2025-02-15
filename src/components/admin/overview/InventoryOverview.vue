<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import {ref, watch} from "vue";
import {type Product, useAdminAuthStore} from "@/stores";
import moment from "moment/moment";


// const  BASE_URL = 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL
const material_table_el = ref<JQuery<HTMLElement> | null>(null)
const adminAuthStore = useAdminAuthStore()
const selectedProduct = ref(false)

watch(()=>selectedProduct.value, (val)=>{
  console.log('selectedProduct', val)
})
console.log()

const columns = [
  {data: null, title: '',
    render: (data: string, type: string, row: Product) =>{
    const selectedProduct = ref(true)
      console.log('selectedProduct', selectedProduct.value)
    return `<div class="flex">
                <input
                v-model="selectedProduct"

                type="checkbox" class="shrink-0 w-4 h-4 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="checkbox">
<!--                <label for="hs-default-checkbox" class="text-sm text-gray-500 ms-3 dark:text-neutral-400">${{selectedProduct}}</label>-->
            </div>`
    }
  },
  { data: 'name', title: 'Name' },
  { data: 'regular_price', title: 'Price' },
  // { data: 'short_description', title: 'Description'},
  { data: 'stock_quantity', title: 'Quantity'},
  // { data: 'weight', title: 'Units'},
  { data: 'created_at', title: 'Date',
    render:(data: string, type: string, row: Product )=>{
      return moment(row.created_at).format('DD MMMM YYYY-hh:mm a')
    }
  },
  {data: 'full_name', title:'Aggregator'},
//   {
//     data: null,
//     title: 'Actions',
//     orderable: false,
//     searchable: false,
//     render: (data: string, type:string, row: Product) =>{
//       return `
//         <div class="flex">
//           <button id='view-btn' class=" btn btn-sm">
//           <span class="material-icons-outlined text-conifer-500">fullscreen</span>
// </button>
//          <button id="resend-btn" class=" btn btn-sm">
//           <span class="material-icons-outlined text-main-500">
// edit
// </span>
// </button>
//           <button id="resend-btn" class=" btn btn-sm">
//           <span class="material-icons-outlined text-rose-500">
// delete
// </span>
// </button>
//
//         </div>
//       `
//     }
//   }
]

const exceptedColumns = Array.from({ length: columns.length-2}, (v, k) => k+1)
// const acceptedColumns = [0, 1, 4, 5]

$(document).ready(function() {
  material_table_el.value = $('#myTable');

  material_table_el.value?.DataTable({
    columns: columns,
    ajax: {
      url: `${BASE_URL}/admin/get-products/${adminAuthStore.getAdminInfo()?.userId}/?limit=5&offset=0&all_products=0`,
      dataSrc: (json) => {
        console.log('data', json)
        return json;
      }
    },
    dom: '<"flex items-center justify-between"<"w-1/3"l><"w-1/3 text-center"B><"w-1/3 text-right"f>><"mt-8"rt><"flex justify-between pt-4"<"w-1/2"i><"flex justify-end w-1/2"p>>',
    buttons: [
      {
        extend: 'csv',
        className: 'bg-transparent',
        exportOptions: {
          columns: exceptedColumns
        }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        exportOptions: {
          columns: exceptedColumns
        }
      },
      {
        extend: 'pdf',
        className: 'bg-transparent',
        exportOptions: {
          columns: exceptedColumns
        }
      },
      {
        extend: 'excel',
        className: 'bg-transparent',
        exportOptions: {
          columns: exceptedColumns
        }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        exportOptions: {
          columns: exceptedColumns
        }
      }
    ],
    columnDefs: [
      {
        targets: '_all', className: 'dt-body-left dt-head-left'
      }

    ],
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
    // select: true,
    responsive: true
  })
})

</script>

<template>

  <div>
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