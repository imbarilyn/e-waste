<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import {onMounted, ref, watch} from "vue";
import {type Product, useAdminAuthStore, useAdminStore} from "@/stores";
import moment from "moment/moment";
import { type DataTableAjaxData} from "@/components/aggregator/inventory/InventoryDataTable.vue";
import DialogModal from "@/components/commonComponent/DialogModal.vue";


// const  BASE_URL = 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL
const material_table_el = ref<JQuery<HTMLElement> | null>(null)
const adminAuthStore = useAdminAuthStore()
const adminStore = useAdminStore()
const selectedProduct = ref(false)
const total = ref<string>('')

export interface PublishProduct {
  id: number
  name: string
  vendorName: string
}
const emits = defineEmits<{
  (event: 'confirmPublish', value: PublishProduct): void
}>()
// watch(()=>total.value, (value)=>{
//   if(value){
//     console.log("Datatables side", value)
//     emits('ShowTotalEntries', value)
//   }
// })
watch(()=>selectedProduct.value, (val)=>{
  console.log('selectedProduct', val)
})



// onMounted(()=>{
//   emits('ShowTotalEntries', total.value)
// })

const columns = [
  {data: null, title: '',
    render: (data: string, type: string, row: Product) =>{
    const selectedProduct = ref(true)
      // console.log('selectedProduct', selectedProduct.value)
    return `<div class="flex">
                <input
                v-model="selectedProduct"

                type="checkbox" class="shrink-0 w-4 h-4 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="checkbox">
<!--                <label for="hs-default-checkbox" class="text-sm text-gray-500 ms-3 dark:text-neutral-400">${{selectedProduct}}</label>-->
            </div>`
    }
  },
  { data: 'name', title: 'Product'},
  {data: 'categories[0].name', title: 'Category'},
  {
    data:'store.name',
    title: 'Vendor'
  },
  {
    data:'store.shop_name',
    title: 'Store'
  },
  {data: 'sale_price', title: 'Sale price'},
  { data: 'regular_price', title: 'Regular price' },
  { data: 'stock_quantity', title: 'Quantity'},
  { data: 'date_modified', title: 'Creation date',
    render:(data: string, type: string, row: Product )=>{
      return moment(row.date_modified).format('DD MMMM YYYY-hh:mm a')
    }
  },
  {
    data: 'status', title: 'Status',
    render: (data: string, type: string, row:  Record<string, number | string>)=>{
      if(row.status === 'publish') {
        return `<span class="bg-conifer-600 text-white rounded-lg px-2 py-1.5">published</span>`
      } else{
        return `<span class="bg-yellow-600 text-white rounded-lg px-2 py-1.5">pending</span>`
      }
    }
  },
  {
    data: null, title: 'Publish',
    render: (data: string, type: string, row:  Record<any, string | number>)=>{
      const isChecked = row.status === 'publish' ? 'checked' : ''
      return `<div class="flex">
<!--<input type="checkbox"  id='status-enable' class="toggle toggle-info" ${isChecked} />-->
<input type="checkbox" id="enable-publish" class="toggle border-slate-300 bg-slate-300 checked:bg-conifer-500 checked:text-main-400 checked:border-conifer-500 " ${isChecked}/>

</div>`
    }
  }
]

const exceptedColumns = Array.from({ length: columns.length-2}, (v, k) => k+1)
// const acceptedColumns = [0, 1, 4, 5]

$(document).ready(function() {

  // material_table_el.value = $('#myTable');

  const table = $('#myTable').DataTable({
    columns: columns,
    processing: true,
    serverSide: true,
    ajax: function (data, callback, settings){
      const ajaxData = data as DataTableAjaxData
      let searchValue = ajaxData.search.value
      let page = Math.floor(settings._iDisplayStart / settings._iDisplayLength) + 1
      $.ajax({
        url: `https://recommerce.mzawadi.com/wp-json/wc/v3/products`,
        headers: {
          'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          per_page:  settings._iDisplayLength,
          page: page,
          search: searchValue,
          status: 'pending'
        },
        type: 'GET',
        success: function (response, textStatus, jqXHR) {
          console.log('response', response)
          total.value = jqXHR.getResponseHeader('X-WP-Total') as string
          console.log('total pending', typeof (jqXHR.getResponseHeader('X-WP-Total')))
          callback({
            draw: ajaxData.draw,
            recordsTotal: jqXHR.getResponseHeader('X-WP-Total'),
            recordsFiltered: jqXHR.getResponseHeader('X-WP-Total'),
            data: response
          })
        },
        error: function(errorThrown, textStatus, jqXHR){
          callback({
            draw: ajaxData.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
            error: 'Failed to load data, please try again'
          })
        }
      })
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
    paging: true,
    // select: true,
    responsive: true
  })

  table.on('click', '#enable-publish', function(){
    const row = table.row($(this).closest('tr')).data()
    console.log("In the datatable publishing", row)
    emits('confirmPublish', {
      id: row.id,
      name: row.name,
      vendorName: row.store.name
    })
  })
})

// const publishHandler = ()=>{
//   adminStore.publishProduct()
//
//
// }

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