/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const app = (() => {
  'use strict';

  let isSubscribed = false;
  let swRegistration = null;

  const notifyButton = document.querySelector('.js-notify-btn');
  const pushButton = document.querySelector('.js-push-btn');
  const body = document.querySelector('body');

  // TODO 2.1 - check for notification support

  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
    return;
  }

  // TODO 2.2 - request permission to show notifications
  Notification.requestPermission(status => {
    console.log('Notification permission status:', status);
  });


  function displayNotification() {

    // TODO 2.3 - display a Notification
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {

        // TODO 2.4 - Add 'options' object to configure the notification
        const options = {
          body: 'Check Out Our Best Selling Egg Tarts',
          icon: 'images/products/pro14.jpg',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },

          // TODO 2.5 - add actions to the notification
          actions: [
            {
              action: 'explore', title: 'Go to the site',
              icon: 'images/checkmark.png'
            }
          ]

          // TODO 5.1 - add a tag to the notification

        };

        reg.showNotification('JumpMasters Welcome You!', options);
      });
    }

  }

  function initializeUI() {

    // TODO 3.3b - add a click event listener to the "Enable Push" button
    // and get the subscription object

  }

  // TODO 4.2a - add VAPID public key

  function subscribeUser() {

    // TODO 3.4 - subscribe to the push service
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true
    })
      .then(subscription => {
        console.log('User is subscribed:', subscription);
        updateSubscriptionOnServer(subscription);
        isSubscribed = true;
        updateBtn();
      })
      .catch(err => {
        if (Notification.permission === 'denied') {
          console.warn('Permission for notifications was denied');
        } else {
          console.error('Failed to subscribe the user: ', err);
        }
        updateBtn();
      });


  }

  function unsubscribeUser() {

    // TODO 3.5 - unsubscribe from the push service
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(err => {
        console.log('Error unsubscribing', err);
      })
      .then(() => {
        updateSubscriptionOnServer(null);
        console.log('User is unsubscribed');
        isSubscribed = false;
        updateBtn();
      });


  }

  function updateSubscriptionOnServer(subscription) {
    // Here's where you would send the subscription to the application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const endpointURL = document.querySelector('.js-endpoint-url');
    const subAndEndpoint = document.querySelector('.js-sub-endpoint');

    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      endpointURL.textContent = subscription.endpoint;
      subAndEndpoint.style.display = 'block';
    } else {
      subAndEndpoint.style.display = 'none';
    }
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


  $(window).ready(function () {
    var flag = false;
    window.onscroll = function () {
      myFunction();
      if (flag == false) {
        myFunction1();
      }

    };


    var header = document.getElementById("myheader");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");


      } else {
        header.classList.remove("sticky");



      }
    }

    function myFunction1() {
  
      if (window.pageYOffset > (document.body.scrollHeight * (6 / 10.0))) {
        displayNotification();
        flag = true;


      } else {




      }
    }








  });

  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     console.log('Service Worker and Push is supported');

  //     navigator.serviceWorker.register('sw.js')
  //     .then(swReg => {
  //       console.log('Service Worker is registered', swReg);

  //       swRegistration = swReg;

  //       // TODO 3.3a - call the initializeUI() function
  //     })
  //     .catch(err => {
  //       console.error('Service Worker Error', err);
  //     });
  //   });
  // } else {
  //   console.warn('Push messaging is not supported');
  //   pushButton.textContent = 'Push Not Supported';
  // }

})();
