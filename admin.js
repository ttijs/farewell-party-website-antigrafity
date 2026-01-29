import { createClient } from '@supabase/supabase-js'

// Keys must start with VITE_ to be exposed to the client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ADMIN_PASS = 'sudo coen'

const loginScreen = document.getElementById('admin-login')
const dashboard = document.getElementById('dashboard')
const passInput = document.getElementById('admin-pass')
const errorMsg = document.getElementById('admin-error')
const rsvpList = document.getElementById('rsvp-list')
const totalCount = document.getElementById('total-count')
const refreshBtn = document.getElementById('refresh-btn')

// Admin Login
passInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    if (passInput.value === ADMIN_PASS) {
      loginScreen.classList.add('hidden')
      dashboard.classList.remove('hidden')
      loadData()
    } else {
      errorMsg.textContent = '> Access Denied.'
      passInput.value = ''
    }
  }
})

refreshBtn.addEventListener('click', loadData)

async function loadData() {
  rsvpList.innerHTML = '<tr><td colspan="5">Loading...</td></tr>'
  
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    renderTable(data)
  } catch (err) {
    console.error(err)
    rsvpList.innerHTML = `<tr><td colspan="5" style="color:red">Error: ${err.message}</td></tr>`
  }
}

function renderTable(data) {
  totalCount.textContent = data.length
  rsvpList.innerHTML = ''

  if (data.length === 0) {
    rsvpList.innerHTML = '<tr><td colspan="5">No RSVPs yet.</td></tr>'
    return
  }

  data.forEach(row => {
    const tr = document.createElement('tr')
    const date = new Date(row.created_at).toLocaleString()
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.email}</td>
      <td>${row.dietary_requirements || '-'}</td>
      <td style="font-size: 0.8rem">${date}</td>
    `
    rsvpList.appendChild(tr)
  })
}
