<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {type Product, useAggregatorAuthStore, useAggregatorStore} from "@/stores";
import moment from "moment/moment";
import DialogModal from "@/components/commonComponent/DialogModal.vue";
import {showAlert} from "@/modules/sweetAlert.ts";
import router from "@/router";


export interface DataTableAjaxData {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: boolean
  }
  order:  Array<{
    column: number
    dir: string
  }>
  columns: Array<{
    data: string,
    name: string
    searchable: boolean
    orderable: boolean
    search: {
      value: string
      regex: boolean
    }
  }>
}

// const  BASE_URL = 'http://localhost:3000'
// const BASE_URL = import.meta.env.VITE_BASE_URL
// const material_table_el = ref<HTMLElement | null>(null)
const aggregatorStore = useAggregatorStore()
const aggregatorAuthStore = useAggregatorAuthStore()
const selectedProduct = ref(false)
const product = ref<Product>()
const route = useRouter()
const openDialog = ref(
    {isOpen: false}
)
const isLoading = ref(false)

const handleDeleteProduct = ()=>{
  isLoading.value = true
  aggregatorStore.deleteProduct(product.value?.id as number)
      .then(resp =>{
        console.log('Delete', resp?.data)
        if(resp?.data){
          setTimeout(()=>{
            closeDialog()
            showAlert({
              type: 'success',
              message: "Product deleted successfully"
            })
          }, 1500)

        }
        else{
          isLoading.value = false
          closeDialog()
          showAlert({
            type: 'error',
            message: "Product not deleted, kindly try again"
          })

        }
      })
      .catch(err=>{
        closeDialog()
        showAlert({
          type: 'error',
          message: "Product not deleted, kindly try again"
        })
      })




}

const closeDialog = ()=>{
  openDialog.value.isOpen = false
  isLoading.value = false
}


watch(()=>selectedProduct.value, (val)=>{
  console.log('selectedProduct', val)
})
console.log()

const columns = [
  {data: null, title: '',
    render: (data: string, type: string, row: Record<string, number | string>) =>{
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
  { data: 'short_description', title: 'Description'},
  { data: 'stock_quantity', title: 'Quantity'},
  // { data: 'weight', title: 'Units'},
  { data: 'date_created', title: 'Date',
    render:(data: string, type: string, row: Record<string, number | string> )=>{
      return moment(row.created_at).format('DD MMMM YYYY-hh:mm a')
    }
  },
  {
    data: 'status', title: 'Status',
    render: (data: string, type: string, row:  Record<string, number | string>)=>{
      if(row.status === 'publish') {
        return `<span class="bg-conifer-600 text-white rounded-lg px-2 py-1.5">published</span>`
      } else{
        return `<span class="bg-yellow-600 text-white rounded-lg px-2 py-1.5">draft</span>`
      }
    }
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    render: (data: string, type:string, row: Record<string, number | string> ) =>{
      return `
        <div class="flex">
          <button id='view-btn' class="view btn btn-sm" >
          <span class="material-icons-outlined text-conifer-500">fullscreen</span>
</button>
         <button id="resend-btn" class="edit  btn btn-sm">
          <span class="material-icons-outlined text-main-500">
edit
</span>
</button>
          <button id="resend-btn" class="delete btn btn-sm">
          <span class="material-icons-outlined text-rose-500">
delete
</span>
</button>

        </div>
      `
    }
  }
]

const exceptedColumns = Array.from({ length: columns.length-2}, (v, k) => k + 1)
// const acceptedColumns = [0, 1, 4, 5]

$(document).ready(function() {
  // material_table_el.value = $('#myTable');

  const table = $('#myTable').DataTable({
    processing: true,
    serverSide: true,
    pageLength: 10,
    ajax: function(data, callback, settings){
      const ajaxData = data as DataTableAjaxData
      console.log('data', data)
      console.log('settings', settings)
      let searchValue = ajaxData.search.value
      let page = Math.floor(settings._iDisplayStart / settings._iDisplayLength) + 1
      $.ajax({
        url: `https://recommerce.mzawadi.com/wp-json/dokan/v1/products`,
        headers: {
          'Authorization': `Bearer ${aggregatorAuthStore.getDokanToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          per_page: settings._iDisplayLength,
          page: page,
          search: searchValue,
          status: 'publish'
        },
        success: function(response, textStatus, jqXHR){
          console.log('All Headers', jqXHR.getAllResponseHeaders())
          callback({
            draw: ajaxData.draw,
            recordsTotal: jqXHR.getResponseHeader('X-WP-Total'),
            recordsFiltered: jqXHR.getResponseHeader('X-WP-Total'),
            data: response,
          })
          console.log('X-WP-Total', jqXHR.getResponseHeader('X-WP-Total'))
        },
        // In case an error occurs when loading data from the server
        error: function(errorThrown, textStatus, jqXHR){
          callback({
            draw: ajaxData.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
            error: 'Failed to load data , kindly refresh page'
          })
        }
      })
    },
    columns: columns,
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
    paging: true,
    select: true,
    responsive: true
  })

  $('#myTable').on('click', '.delete', function(){
    console.log('clicked delete button')
    product.value = table.row($(this).closest('tr')).data()
    console.log('product', product.value)
    openDialog.value.isOpen = true

  })

  $('#myTable').on('click', '.view', function(){
    console.log('clicked view button')
    product.value = table.row($(this).closest('tr')).data()
    router.push({
      name: 'Aggregator-View-Product',
      params: {
        userId: aggregatorAuthStore.getAggregatorInfo()?.userId,
        productId: product.value?.id
      }
    })
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

    <teleport to="body">
      <DialogModal :is-open="openDialog.isOpen"
                   @close-modal="closeDialog">
        <template #title>
          <div class="flex justify-center items-center">
            <button class=" btn btn-sm btn-ghost bg-rose-300 btn-circle">
              <span class="material-icons-outlined text-red-500">error_outline</span>
<!--              <span  v-else class="loading loading-bars loading-md text-red-500 "></span>-->
            </button>

          </div>

        </template>
        <template #body>
          <div class="space-y-2">
            <p class="text-center text-normal font-semibold">Deleting {{product?.name}} product</p>
            <div class="">
              <p>Are you sure you want to delete <span class="text-rose-500">{{}}?</span>
              </p>
              <p>Once deleted cannot be recovered</p>
            </div>

          </div>
        </template>
        <template #footer>
          <div class="flex justify-center gap-10">
            <button class="btn btn-sm btn-ghost bg-slate-200 px-8" @click="closeDialog">Cancel
            </button>
            <button class="btn btn-sm btn-ghost text-white bg-rose-500 px-8 hover:bg-rose-600" @click="handleDeleteProduct">
              <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
              <span v-else>Delete</span>
            </button>

          </div>
        </template>

      </DialogModal>
    </teleport>
  </div>

</template>

<style scoped>

</style>