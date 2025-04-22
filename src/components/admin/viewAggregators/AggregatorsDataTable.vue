<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import {ref} from "vue";
import {useAdminAuthStore} from "@/stores";
import moment from 'moment'


const adminAuthStore = useAdminAuthStore()
interface Portfolio {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: number,
  address: string,
  created_at: string,
}

interface Result {
  result: string
  message: string
}

// const  BASE_URL = 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL
const aggregatorAuthStore = useAggregatorAuthStore()
const notificationStore = useNotificationsStore()
const isLoading = ref(false)
const portfolioData = ref<Portfolio | null>(null)
const columns = [
  {data: null, title: '',
    render: (data: string, type: string, row: Record<any, string | number>) =>{
      // console.log('selectedProduct', selectedProduct.value)
      return `<div class="flex">
                <input
                type="checkbox" class="shrink-0 w-4 h-4 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="checkbox">
            </div>`
    }
  },
  { data: null, title: 'Aggregator',
    render: (data: string, type: string, row:  Record<any, string | number>)=>{
    console.log(row)
      return `${row.first_name} ${row.last_name}`
    }
  },
  { data: 'email', title: 'Email' },
  { data: 'phone_number', title: 'Phone number'},
  {data: 'store_name', title: 'Store name'},
  {
    data: 'address', title: 'City',
    render: (data: string, type: string, row: Record<any, string | number>) => {
      try {
        let streetAddress = JSON.parse(row.address as string)
        return streetAddress.city || 'No address'
      } catch (e) {
        return 'No address'
      }
    }
  },
  {data: 'address', title: 'Street',
    render:(data: string, type: string, row:  Record<any, string | number>)=>{
  try {
    let streetAddress = JSON.parse(row.address as string)
    return streetAddress.street_1 || 'No address'
  } catch (e) {
    return 'No address'
  }

  }
  },

  { data: 'created_at', title: 'Created at',
    render: function(data: string, type:string, row:  Record<any, string | number>){
    return moment(row.created_at, 'YYYY-MM-DD').format('DD MMMM YYYY')
    },
  },
  {
    data: null, title: 'Status',
    render: (data: string, type: string, row:  Record<any, string | number>)=>{
      const isChecked = row.status === 'enabled' ? 'checked' : ''
      return `<div class="flex">
<!--<input type="checkbox"  id='status-enable' class="toggle toggle-info" ${isChecked} />-->
<input type="checkbox" id="status-enable" class="toggle border-slate-300 bg-slate-300 checked:bg-conifer-500 checked:text-main-400 checked:border-conifer-500 " ${isChecked}/>

</div>`
    }
  }
]
const exceptedColumns = Array.from({ length: columns.length-1}, (v, k) => k)

$(document).ready(function() {
  const table = $('#myTable').DataTable({
    columns: columns,
    processing: true,
    serverSide: true,
    pageLength: 10,

    // ajax: {
    //   url: `${BASE_URL}/admin/get-aggregators/${adminAuthStore.getAdminInfo()?.userId}`,
    //   dataSrc: (json) => {
    //     console.log('data', json)
    //     return json;
    //   }
    // },
    ajax: function(data, callback,  settings){
      const ajaxData = data as  DataTableAjaxData
      let searchValue = ajaxData.search.value
      let page = Math.floor(settings._iDisplayStart / settings._isDisplayLength) + 1
      $.ajax({
        url: `${BASE_URL}/admin/get-aggregators/${adminAuthStore.getAdminInfo()?.userId}`,
        data: {
          per_page: settings._isDisplayLength,
          page: page,
          search: searchValue
        },
        success: function(response, textStatus){
          console.log(response)
          callback({
            draw: ajaxData.draw,
            recordsTotal: response.total,
            recordsFiltered: response.total,
            data: response.response
          })
        },
        error: function(response, textStatus){
          callback({
            draw: ajaxData.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
            error: 'Failed to load data, kindly refresh page'

          })
        }
      },
      )

    },
    columnDefs: [
      {
        targets: '_all',
        className: 'dt-body-left dt-head-left'
      }

    ],
    dom: '<"flex items-center justify-between"<"w-1/3"l><"w-1/3 text-center"B><"w-1/3 text-right"f>><"mt-8"rt><"flex justify-between pt-4"<"w-1/2"i><"flex justify-end w-1/2"p>>',
    buttons: [
      {
        extend: 'csv',
        className: 'bg-transparent'
        // exportOptions: {
        //   columns: exceptedColumns
        // }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        // exportOptions: {
        //   columns: exceptedColumns
        // }
      },
      {
        extend: 'pdf',
        className: 'bg-transparent',
        // exportOptions: {
        //   columns: exceptedColumns
        // }
      },
      {
        extend: 'excel',
        className: 'bg-transparent',
        // exportOptions: {
        //   columns: exceptedColumns
        // }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        // exportOptions: {
        //   columns: exceptedColumns
        // }
      }
    ],

    columnDefs: [
      {
        targets: -1,
        className: 'dt-justify'
      },
      {
        searchable: true,
        targets: [0, 1, 2, 3]
      }
    ],
    initComplete: function () {
      this.api().columns().every(function () {
        var column = this;
        var input = document.createElement("input");
        $(input).appendTo($(column.footer()).empty())
          .on('keyup', function () {
            column.search($(this).val(), false, false, true).draw();
          });
      });
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
    select: true,
    responsive: true
  })

  table.on('click', '#status-enable', function(){
    isLoading.value= true
    const aggregator = table.row($(this).closest('tr')).data();
  if($(this).is(':checked')) {
    console.log('enabled')
    const payload = {
      status: true,
      aggregatorId: aggregator.id,
    }
    aggregatorAuthStore.changeDokanVendorStatus(payload)
        .then((res) =>{
          notificationStore.addNotification(res?.message, res?.result)

        })
        .catch(e=>{
          console.log('fail')
        })
        .finally(()=>{
          isLoading.value = false
        })

  }
  else{
    const payload = {
      status: false,
      aggregatorId: aggregator.id,
    }
    aggregatorAuthStore.changeDokanVendorStatus(payload)
        .then((res) =>{
         notificationStore.addNotification(res?.message, res?.result)

        })
        .catch(e=>{
          notificationStore.addNotification('An error occurred please try again', 'error')
        })
        .finally(()=>{
          isLoading.value = false
        })

    console.log('Disabled')
  }

  })
})
</script>

<template>

  <div>
    <div class="min-w-80  p-8 shadow-2xl rounded-2xl border border-1 ">
      <div>
        <table id="myTable" class="display stripe hover compact">
          <thead>
          <tr></tr>
          </thead>
          <tbody>
          <tr></tr>
          </tbody>
          <tfoot>
          <tr></tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="absolute flex justify-center items-center inset-0 bg-transparent backdrop-blur bg-opacity-90 z-50" v-if="isLoading">
      <span class="loading loading-spinner text-main-500 loading-xl"></span>
    </div>

  </div>
</template>

<style scoped>
.loading-spinner {
  width: 50px;
  height: 50px;
}

</style>