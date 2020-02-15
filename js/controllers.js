/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-name"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/enter-name.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    var dialog = document.getElementById('my-dialog');

    if (dialog) {
      dialog.show();
    } else {
      ons.createElement('dialog.html', { append: true })
        .then(function(dialog) {
          dialog.show();
        });
    }

    // Change tabbar animation depending on platform.
    page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
  },

  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {
    // Set functionality for 'No Category' and 'All' default categories respectively.
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

    // Change splitter animation depending on platform.
    document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-name"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/enter-name.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

   
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#title-input').value;

        if (newTitle) {
          // If input title is not empty, create a new task.
          myApp.services.tasks.create(
            {
              title: newTitle,
              category: page.querySelector('#category-input').value,
              description: page.querySelector('#description-input').value,
              highlight: page.querySelector('#highlight-input').checked,
              urgent: page.querySelector('#urgent-input').checked
            }
          );

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#default-category-list ons-list-item').updateCategoryView();
          document.querySelector('#myNavigator').popPage();

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('You must provide a task title.');
        }
      };
    });
  },

  ////////////////////////////////
  // Details Task Page Controller //
  ///////////////////////////////
  detailsTaskPage: function(page) {
    // Get the element passed as argument to pushPage.
    var element = page.data.element;

    // Fill the view with the stored data.
    page.querySelector('#title-input').value = element.data.title;
    page.querySelector('#category-input').value = element.data.category;
    page.querySelector('#description-input').value = element.data.description;
    page.querySelector('#highlight-input').checked = element.data.highlight;
    page.querySelector('#urgent-input').checked = element.data.urgent;

    // Set button functionality to save an existing task.
    page.querySelector('[component="button/save-task"]').onclick = function() {
      var newTitle = page.querySelector('#title-input').value;

      if (newTitle) {
        // If input title is not empty, ask for confirmation before saving.
        ons.notification.confirm(
          {
            title: 'Save changes?',
            message: 'Previous data will be overwritten.',
            buttonLabels: ['Discard', 'Save']
          }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
            // If 'Save' button was pressed, overwrite the task.
            myApp.services.tasks.update(element,
              {
                title: newTitle,
                category: page.querySelector('#category-input').value,
                description: page.querySelector('#description-input').value,
                ugent: element.data.urgent,
                highlight: page.querySelector('#highlight-input').checked
              }
            );

            // Set selected category to 'All', refresh and pop page.
            document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
            document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          }
        });

      } else {
        // Show alert if the input title is empty.
        ons.notification.alert('You must provide a task title.');
      }
    };
  },

  ////////////////////////////
  // New User Page Controller //
  ////////////////////////////
  newNamePage: function(page) {
    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-name"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#name-input').value;

        if (newTitle) {
          // If input title is not empty, create a new task.
          myApp.services.user.name = newTitle
          document.querySelector('#myNavigator').pushPage('html/chatbot.html');

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert('You must provide a name.');
        }
      };
    });
  },

  ///////////////////////////
  // Chatbot Page Controller //
  ////////////////////////////
  chatbotPage: function(page) {
    // Set button functionality to save a new task.
    message = "ごきげんよう, "+myApp.services.user.name
    myApp.services.dialog.add(message,"bot");

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/activate-voice"]'), function(element) {
      element.onclick = function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if ('SpeechRecognition' in window) {
          // speech recognition API supported
         
          const recorder = new SpeechRecognition();
          
          recorder.onstart = function(){
            console.log("suara diaktifkan,bole start ckp dah");
          }
    
          recorder.onresult = function(event){
            console.log(event);    
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            document.querySelector('#text-input').value = transcript
            botVoice(transcript)
            
          }
        } else {
          // speech recognition API not supported
          ons.notification.alert("no voice recognition")
          //show input
          
        }

      
      };
    });

    Array.prototype.forEach.call(page.querySelectorAll('[component="button/send"]'), function(element) {
      element.onclick = function() {
        var question = page.querySelector('#text-input').value;
        myApp.services.dialog.add(question,"");
        page.querySelector('#text-input').value = "";
        botResponse = response(question)
        myApp.services.dialog.add(botResponse,"bot");

      };
    });
  },
};
