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
  full_name: string,
  email: string,
  phone_number: number,
  location: number,
  created_at: string,
}

// const  BASE_URL = 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL
const material_table_el = ref<JQuery<HTMLElement> | null>(null)
const portfolioData = ref<Portfolio | null>(null)
const columns = [
  { data: 'full_name', title: 'Full name' },
  { data: 'email', title: 'Email' },
  { data: 'phone_number', title: 'Phone number'},
  { data: 'location', title: 'Location'},
  { data: 'created_at', title: 'Created at',
    render: function(data: string, type:string, row: Portfolio){
    return moment(row.created_at, 'YYYY-MM-DD').format('DD MMMM YYYY')
    }
  }
]

const exceptedColumns = Array.from({ length: columns.length-1}, (v, k) => k)

$(document).ready(function() {
  material_table_el.value = $('#myTable');

  material_table_el.value?.DataTable({
    columns: columns,
    ajax: {
      url: `${BASE_URL}/admin/get-aggregators/${adminAuthStore.getAdminInfo()?.userId}`,
      dataSrc: (json) => {
        console.log('data', json)
        return json;
      }
    },
    columnDefs: [
      {
        targets: '_all', className: 'dt-body-left dt-head-left'
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
  </div>
</template>

<style scoped>

</style>