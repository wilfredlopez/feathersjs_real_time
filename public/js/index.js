// Socket.io setup
const socket = io("http://localhost:3030")
// Init feathers app
const app = feathers()
// Register socket.io to talk to server
app.configure(feathers.socketio(socket))
document.getElementById("form").addEventListener("submit", sendIdea)
document.getElementById("chatText").addEventListener("keypress", verifyEnterKey)
var dateoptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

async function sendIdea(e) {
  e.preventDefault()
  const text = document.getElementById("idea-text")
  const tech = document.getElementById("idea-tech")
  const viewer = document.getElementById("idea-viewer")
  // Create new idea
  app.service("ideas").create({
    text: text.value,
    tech: tech.value,
    viewer: viewer.value,
  })
  // Clear inputs
  text.value = ""
  tech.value = ""
  viewer.value = ""
}
function renderIdea(idea) {
  document.getElementById(
    "ideas",
  ).innerHTML += `<div class="card bg-secondary my-3">
             <div class="card-body">
               <p class="lead">
                 ${idea.text} <strong>(${idea.tech})</strong>
                 <br />
                 <em>Submitted by ${idea.viewer}</em>
                 <br />
                 <small>${new Date(idea.time).toLocaleDateString(
                   "en-us",
                   dateoptions,
                 )}</small>
               </p>
             </div>
           </div>`
}
async function init() {
  // Find ideas
  const ideas = await app.service("ideas").find()
  // Add existing ideas to list
  ideas.forEach(renderIdea)

  const messages = await app.service("messages").find()
  messages.forEach(renderMessage)
  // Add idea in realtime
  app.service("ideas").on("created", renderIdea)
  app.service("messages").on("created", renderMessage)
}
init()

//ELEMENTS
const chatText = document.getElementById("chatText")
const username = document.getElementById("username")

function verifyEnterKey(e) {
  console.log(e.key)
  if (e.key === "Enter") {
    sendText()
  }
}

function sendText() {
  console.log(chatText.value)
  if (chatText.value && username.value) {
    app.service("messages").create({
      text: chatText.value,
      username: username.value,
    })
  }

  // Clear inputs
  chatText.value = ""
}

//RENDER
function renderMessage(messages) {
  document.getElementById("messages").innerHTML += `<div class="chatParagraph">
               <div class="">
                 <p class="lead ">
                 <strong>

                 ${messages.username}: 
                 </strong>
                   ${messages.text}
                 </p>
                 <div>
                 <small>
                
                 ${new Date(messages.time).toLocaleTimeString()}
                 </small>
                 </div>
               </div>
               <hr/>
             </div>`
}
