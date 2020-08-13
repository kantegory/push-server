// Регистрируем функцию на событие 'push'
self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : 'Alohomora';

  event.waitUntil(
    // Показываем уведомление с заголовком и телом сообщения.
    self.registration.showNotification('My first spell', {
      body: payload,
    })
  );
});
