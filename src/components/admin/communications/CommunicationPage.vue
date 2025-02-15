<script setup lang="ts">
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import DialogModal from "@/components/commonComponent/DialogModal.vue";
import {ref, reactive} from "vue";
import {useAdminAuthStore, useAdminStore} from "@/stores";
import moment from 'moment'
import {showAlert} from "@/modules/sweetAlert.ts";

const adminAuthStore = useAdminAuthStore()
const adminStore = useAdminStore()

interface Communication {
  id: string,
  head: string,
  body: string,
  status: string,
  created_at: string,
  full_name: string,
  email:string
}

const communicationData = ref<Communication | null>(null)
const material_table_el = ref<JQuery<HTMLElement> | null>(null)
// const  BASE_URL = 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL
const openDialog = ref({
  isOpen: false
})

const closeDeleteDialog = ()=>{
  openDialog.value.isOpen = false
}

const isLoading = ref(false)
const handleResend = ()=>{
  isLoading.value = true
  if(communicationData.value){
    adminStore.resendEmail({
      head: communicationData.value.head,
      body: communicationData?.value.body,
      aggregatorEmail: communicationData?.value.email
    })
      .then((resp)=>{
        if(resp?.result === 'success'){
          setTimeout(()=>{
            isLoading.value = false
            openDialog.value.isOpen = false
            showAlert({
              type: 'success',
              message: 'Email has been resent successfully'
            })
          }, 2000)
        }
        else{
          setTimeout(()=>{
            isLoading.value = false
            openDialog.value.isOpen = false
            showAlert({
              type: 'error',
              message: resp?.message
            })
          }, 2000)

        }
      })
      .catch((error)=>{
        setTimeout(() => {
          isLoading.value = false
          showAlert({
            type: 'error',
            message: 'Failed to resend email, please try again'
          })
        }, 2000)
      })
  }else{
    console.log('No communication data', communicationData.value)
  }


}


const columns = [
  { data: 'full_name', title: 'Aggregator name' },
  {data: 'email', title: 'Email'},
  { data: 'head', title: 'Email head' },
  { data: 'body', title: 'Email body',
    render: (data: string, type: string, row: Communication)=> {
      return `${row.body.substring(0, 300)}...`
    }
  },
  { data: 'created_at', title: 'Created at',
    render: (data: string, type: string, row:Communication)=>{
      return moment(row.created_at).format('DD MMMM YYYY-hh:mm a')

    }
  },
  { data: 'status', title: 'Status',
    render: (data: string, type: string, row: Communication)=> {
      if (row.status === 'sent') {
        return `<span class="bg-conifer-500 text-white rounded-full px-4 py-1">${row.status}</span>`
      } else if (row.status === 'pending') {
        return `<span class="bg-main-500 text-white rounded-full px-4 py-1">${row.status}</span>`
      } else {
        return `<span class="bg-rose-500 text-white rounded-full px-4 py-1">${row.status}</span>`

      }
    }
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    render: (data: string, type:string, row: Communication) =>{
      return `
        <div class="flex gap-4">
          <button id='view-btn' class=" btn btn-sm bg-main-500 text-white px-4 py-1 rounded-lg hover:bg-main-600">View</button>
          <button id="resend-btn" class=" btn btn-sm  bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600">Resend</button>
        </div>
      `
    }
  }
]

const exceptedColumns = Array.from({ length: columns.length-1}, (v, k) => k)

$(document).ready(function() {
  // material_table_el.value = $('#myTable');

  const table = $('#myTable').DataTable({
    columns: columns,
    ajax: {
      url: `${BASE_URL}/admin/get-aggregators/email-communication/${adminAuthStore.getAdminInfo()?.userId}`,
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
          columns: acceptedColumns
        }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        exportOptions: {
          columns: acceptedColumns
        }
      },
      {
        extend: 'pdf',
        className: 'bg-transparent',
        exportOptions: {
          columns: acceptedColumns
        }
      },
      {
        extend: 'excel',
        className: 'bg-transparent',
        exportOptions: {
          columns: acceptedColumns
        }
      },
      {
        extend: 'print',
        className: 'bg-transparent',
        exportOptions: {
          columns: acceptedColumns
        }
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
    <teleport to="body">
      <DialogModal :is-open="openDialog.isOpen"
                   @close-modal="openDialog.isOpen=false">
        <template #title>
          <div class="flex justify-center items-center">
            <div class=" btn btn-sm btn-ghost " :class="[!isLoading? 'bg-main-300 btn-circle': '']">
              <span v-if="!isLoading" class="material-icons-outlined text-main-500">error_outline</span>
              <span v-else class="loading loading-bars loading-lg text-main-500"></span>
            </div>

          </div>

        </template>
        <template #body>
          <div class="space-y-2">
            <p class="text-center text-normal font-semibold">Resending aggregator <span class="text-main-500">{{communicationData?.full_name}}</span> an email</p>
            <div class="">
              <p>Are you sure you want to resend email?</p>
<!--              <p>Once deleted cannot be recovered</p>-->
            </div>

          </div>
        </template>
        <template #footer>
          <div class="flex justify-center gap-10">
            <button class="btn btn-sm btn-ghost bg-slate-200 px-8" @click="openDialog.isOpen=false">Cancel
            </button>
            <button class="btn btn-sm btn-ghost text-white bg-main-500 hover:bg-main-600 px-8" @click="handleResend">
              <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
              <span v-else>Resend</span>
            </button>

          </div>
        </template>

      </DialogModal>
    </teleport>
  </div>

</template>

<style scoped>

</style>