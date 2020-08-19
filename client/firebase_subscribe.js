const pushServer = 'https://push.kubteh.ru';

setTimeout(() => {
  firebase.initializeApp({
    messagingSenderId: '1086760512407'
  });

  // браузер поддерживает уведомления
  // вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
  if ('Notification' in window) {
    var messaging = firebase.messaging();

    // пользователь уже разрешил получение уведомлений
    // подписываем на уведомления если ещё не подписали
    if (Notification.permission === 'granted') {
      subscribe();
    }

    // по клику, запрашиваем у пользователя разрешение на уведомления
    // и подписываем его
    document.getElementById('sendRegister').addEventListener('click', function() {
      subscribe();
    });

    messaging.onMessage(function(payload) {
      console.log('Message received. ', payload);

      // регистрируем пустой ServiceWorker каждый раз
      navigator.serviceWorker.register('messaging-sw.js');

      // запрашиваем права на показ уведомлений если еще не получили их
      Notification.requestPermission(function(result) {
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function(registration) {
            payload.notification.data = payload.notification; // параметры уведомления
            // теперь мы можем показать уведомление
            registration.showNotification(payload.notification.title, payload.notification);
          }).catch(function(error) {
            console.log('ServiceWorker registration failed', error);
          });
        }
      });
    });
  }

  function subscribe() {
    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
      .then(function() {
        // получаем ID устройства
        messaging.getToken()
          .then(function(currentToken) {
            console.log(currentToken);

            if (currentToken) {
              sendTokenToServer(currentToken);
            } else {
              console.warn('Не удалось получить токен.');
              setTokenSentToServer(false);
            }
          })
          .catch(function(err) {
            console.warn('При получении токена произошла ошибка.', err);
            setTokenSentToServer(false);
          });
      })
      .catch(function(err) {
        console.warn('Не удалось получить разрешение на показ уведомлений.', err);
      });
  }

  // отправка ID на сервер
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
      console.log('Отправка токена на сервер...');
      let userId = localStorage.uid;
      let userEmail = document.querySelector('#userEmail').value;

      var url = `${pushServer}/saveToken`; // адрес скрипта на сервере который сохраняет ID устройства
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken, userId: userId })
      });

      url = `${pushServer}/user/email/add`; // адрес скрипта на сервере который сохраняет email пользователя
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ userEmail: userEmail, userId: userId })
      });

      setTokenSentToServer(currentToken);
    } else {
      console.log('Токен уже отправлен на сервер.');
    }
  }

  // используем localStorage для отметки того,
  // что пользователь уже подписался на уведомления
  function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
  }

  function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
      'sentFirebaseMessagingToken',
      currentToken ? currentToken : ''
    );
  }
}, 1500)
