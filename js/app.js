// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage')
      && !document.querySelector('#pendingTasksPage ons-list-item')
    ) {

      myApp.services.fixtures.forEach(function(data) {
        myApp.services.tasks.create(data);
      });
    }
  }

  
});



function botVoice(message){
  
  const speech = new SpeechSynthesisUtterance();
  
    speech.text = response(message);
  
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech)
  document.querySelector('#answer-input').value = speech.text
}


var dialogConfirm = function(){
        document.querySelector('#myNavigator').pushPage('html/chatbot.html');
        hideDialog('my-dialog')
}
var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};

function response(message){
  var reply = "すみません、わかりません...「お元気ですか」と書いてみてください"; 
  if(message.includes("お元気ですか")){
    reply =  "私は元気です";
  }
  return reply;
}