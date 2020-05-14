const axios = require('axios');
require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

const trelloURL = "https://api.trello.com/"
const trelloKey = `?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`

let lists;

axios.get(trelloURL + `1/boards/${process.env.TRELLO_BOARD}/lists` + trelloKey)
  .then(res => {
    console.log(res.data)
    lists = res.data;
  })
  .catch(err => console.log(err.data))

client.once('ready', () => {
  console.log('Ready!')
})

client.login(process.env.BOT_TOKEN)

client.on('message', message => {
  const content = message.content.split(' ');
  const first = content.shift();
  const command = content.shift();
  const request = content.join(' ')

  const createIssue = async (request) =>
  axios.get(trelloURL + `1/boards/${process.env.TRELLO_BOARD}/cards` + trelloKey)
    .then(res => {
      console.log(res.data)
      const cards = res.data.length > 0 ? res.data.filter(c => c.name && c.name.toLowerCase().contains('request')).sort((a,b) => {
        const aCount = parseInt(a.name.split('#')[1])
        const bCount = parseInt(b.name.split('#')[1])
        return (aCount - bCount)
      }) : []
      const number = cards.length > 0 && parseInt(cards[cards.length - 1].name.split('#')) + 1 || 1
      axios.post(trelloURL + '1/cards' + trelloKey + `&name=Issue%20%23${number}&desc=${request}&idList=${process.env.ISSUES_LIST}`)
        .then(() => message.channel.send(`Roigh', I tellz da boss an' 'e'll avva looksee. 'E won't be much happy dat yooz breakin' 'is gubbinz. Issue#${number}`))
        .catch(err => {
          message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
          console.log(err, 'post issue')
        })
    }).catch(err => {
      message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
      console.log(err, 'get board')
    })


const createRequest = (message) =>
  axios.get(trelloURL + `1/boards/${process.env.REQUESTS_LIST}/cards` + trelloKey)
    .then(res => {
      console.log(res.data)
      const cards = res.data.length > 0 ? res.data.filter(c => c.name && c.name.toLowerCase().contains('request')).sort((a,b) => {
        const aCount = parseInt(a.name.split('#')[1])
        const bCount = parseInt(b.name.split('#')[1])
        return (aCount || 0 - bCount || 0)
      }) : []
      const number = cards.length > 0 && parseInt(cards[cards.length - 1].name.split('#')) + 1 || 1
      axios.post(trelloURL + '1/cards' + trelloKey + `&name=Request%20%23${number}&desc=${request}&idList=${process.env.REQUEST_LIST}`)
        .then(() => message.channel.send(`Da mek boyz will 'ave a gran' ol' time wiv dis one. Request#${number}`))
        .catch(err => {
          message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
          console.log(err, 'post request')
        })
    }).catch(err => {
      message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
      console.log(err, 'get board')
    })


  console.log(first)

  if (first === 'squig' || first === 'squiggy') {
    console.log(command)
    switch (command) {
      case 'issue':
        createIssue(request);
        break;
      case 'request':
        createRequest(request);
        break;
      default:
        message.channel.send("Wotz all dis zoggin' mess you'z sent me!?")
    }
  }
})

