var Botkit = require('botkit')
var request = require('request')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
var port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('PORT is required but missing')

var controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function () {
    console.log('Ready Player 1')
  })
})

controller.hears(['Hola', 'Buenos días', 'Buen día', 'Buenas tardes', 'Buena tarde', 'Buenas noches', 'Buena noche'], 'message_received', function (bot, message) {

  bot.reply(message, '¡Hola!')
  bot.reply(message, 'Desde este chat podrás conocer muchos peluditos que están en busca de un hogar amoroso y responsable.')
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: '¿Qué buscas?',
        buttons: [
          {
            type: 'postback',
            title: 'Gatos',
            payload: 'show_cats'
          },
          {
            type: 'postback',
            title: 'Perros',
            payload: 'show_dogs'
          },
          {
            type: 'postback',
            title: '¡Ambos!',
            payload: 'lista_todos'
          }
        ]
      }
    }
  })
})

controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_cats':
      request('http://cuidomimascota.com/botgato', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body);
          for (var i = 0; i < jsonData.mascotas.length; i++) {
            var counter = jsonData.mascotas[i];
            bot.reply(message, {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: [{
                            title: counter.mta_name,
                            subtitle: 'Cuido Mi Mascota',
                            image_url: 'http://www.cuidomimascota.com/pictures/'+counter.path,
                            buttons: [{
                              type: 'web_url',
                              url: 'http://www.cuidomimascota.com/perfil/'+counter.id,
                              title: '¡Quiero conocerla/o!'
                            }],
                  }],
                }
              }
            })
          }
        }
      })
      break
    case 'show_dogs':
      request('http://cuidomimascota.com/botperro', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body);
          for (var i = 0; i < jsonData.mascotas.length; i++) {
            var counter = jsonData.mascotas[i];
            bot.reply(message, {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: [{
                            title: counter.mta_name,
                            subtitle: 'Cuido Mi Mascota',
                            image_url: 'http://www.cuidomimascota.com/pictures/'+counter.path,
                            buttons: [{
                              type: 'web_url',
                              url: 'http://www.cuidomimascota.com/perfil/'+counter.id,
                              title: '¡Quiero conocerla/o!'
                            }],
                  }],
                }
              }
            })
          }
        }
      })
      break
    case 'lista_todos':
      request('http://cuidomimascota.com/botmsn', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body);
          for (var i = 0; i < jsonData.mascotas.length; i++) {
            var counter = jsonData.mascotas[i];
            bot.reply(message, {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: [{
                            title: counter.mta_name,
                            subtitle: 'Cuido Mi Mascota',
                            image_url: 'http://www.cuidomimascota.com/pictures/'+counter.path,
                            buttons: [{
                              type: 'web_url',
                              url: 'http://www.cuidomimascota.com/perfil/'+counter.id,
                              title: '¡Quiero conocerla/o!'
                            }],
                  }],
                }
              }
            })
          }
        }
      })
      break
  }
})
