import { createClient } from '@supabase/supabase-js'

// TODO: REPLACE THESE WITH YOUR OWN KEYS FROM SUPABASE DASHBOARD
const SUPABASE_URL = 'https://your-project-url.supabase.co'
const SUPABASE_KEY = 'your-anon-key'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ACCESS_CODE = 'git push --force' // The secret code

const loginScreen = document.getElementById('login-screen')
const inviteScreen = document.getElementById('invite-screen')
const accessInput = document.getElementById('access-code')
const loginError = document.getElementById('login-error')
const rsvpForm = document.getElementById('rsvp-form')
const rsvpMessage = document.getElementById('rsvp-message')

// Login Logic
accessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const code = accessInput.value.trim()
    if (code === ACCESS_CODE) {
      // Success
      loginError.textContent = '> Access Granted. Loading modules...'
      loginError.style.color = 'var(--text-color)'
      setTimeout(() => {
        loginScreen.classList.add('hidden')
        inviteScreen.classList.remove('hidden')
      }, 1000)
    } else {
      // Fail
      loginError.textContent = '> FATAL ERROR: Invalid Access Code'
      loginError.style.color = 'var(--error-color)'
      accessInput.value = ''
      
      // Shake animation
      loginScreen.style.transform = 'translate(5px, 0)'
      setTimeout(() => loginScreen.style.transform = 'translate(-5px, 0)', 50)
      setTimeout(() => loginScreen.style.transform = 'translate(5px, 0)', 100)
      setTimeout(() => loginScreen.style.transform = 'translate(0, 0)', 150)
    }
  }
})

// RSVP Logic
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const diet = document.getElementById('diet').value

  rsvpForm.querySelector('button').disabled = true
  rsvpForm.querySelector('button').textContent = 'PUSHING TO ORIGIN...'

  try {
    const { error } = await supabase
      .from('rsvps')
      .insert({ 
        name, 
        email, 
        dietary_requirements: diet 
      })

    if (error) throw error

    rsvpForm.innerHTML = '<h2 class="glitch" data-text="SUCCESS">SUCCESS</h2><p>> Changes merged successfully.</p>'
  } catch (err) {
    console.error(err)
    rsvpMessage.textContent = `> Error: ${err.message}`
    rsvpForm.querySelector('button').disabled = false
    rsvpForm.querySelector('button').textContent = 'TRY AGAIN'
  }
})
