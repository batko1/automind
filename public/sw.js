self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'AutoMind', body: 'Напоминание о ТО' }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/favicon-32x32.png',
      tag: data.tag || 'automind',
    })
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
