const axios = require('axios');
require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

const trelloURL = "https://api.trello.com/"
const trelloKey = `?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`

let lists;

axios.get(trelloURL + `1/boards/${process.env.TRELLO_BOARD}/lists` + trelloKey)
  .then(res => {
    lists = res.data;
    console.log(lists.map(l => ({name: l.name, id: l.id})))
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
        const number = res.data.filter(c => {
          // console.log(c.name.toLowerCase())
          return c.name && c.name.toLowerCase().search('issue') !== -1
        }).reduce((a, b) => {
          const aCount = a.name && parseInt(a.name.split('#')[1])
          const bCount = parseInt(b.name.split('#')[1])
          if (!bCount) return aCount
          return aCount > bCount ? aCount : bCount
        }, 0) + 1

        axios.post(trelloURL + '1/cards' + trelloKey + `&name=Issue%20%23${number}&desc=${request}&idList=${process.env.ISSUES_LIST}`)
          .then(() => message.channel.send(`Roigh', I tellz da boss an' 'e'll avva looksee. 'E won't be much happy dat yooz breakin' 'is gubbinz. Issue #${number}`))
          .catch(err => {
            message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
            console.log(err, 'post issue')
          })
      }).catch(err => {
        message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
        console.log(err, 'get board')
      })


  const createRequest = (request) =>
    axios.get(trelloURL + `1/boards/${process.env.TRELLO_BOARD}/cards` + trelloKey)
      .then(res => {
        const number = res.data.filter(c => {
          // console.log(c.name.toLowerCase())
          return c.name && c.name.toLowerCase().search('request') !== -1
        }).reduce((a, b) => {
          const aCount = a.name && parseInt(a.name.split('#')[1])
          const bCount = parseInt(b.name.split('#')[1])
          if (!bCount) return aCount
          return aCount > bCount ? aCount : bCount
        }, 0) + 1

        axios.post(trelloURL + '1/cards' + trelloKey + `&name=Request%20%23${number}&desc=${request}&idList=${process.env.REQUESTS_LIST}`)
          .then(() => message.channel.send(`Da mek boyz will 'ave a gran' ol' time wiv dis one. Request #${number}`))
          .catch(err => {
            message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
            console.log(err, 'post request')
          })
      }).catch(err => {
        message.channel.send(`Zog off, I'z taking a snooze over 'ere. Thingy'z broke anyhowz, can't do it.`)
        console.log(err, 'get board')
      })

  if (first === 'squig' || first === 'squiggy') {
    console.log(command)
    switch (command) {
      case 'issue':
        message.channel.name.search(/(bug|issue)/gi) > -1 ? createIssue(request) : message.channel.send("Oi! Don' use dat 'ere, or da boss'll come thump ya");
        break;
      case 'request':
        message.channel.name.search(/(reques)/gi) > -1 ? createRequest(request) : message.channel.send("Oi! Don' use dat 'ere, or da boss'll come thump ya");
        break;
      case 'board':
      case 'link':
        message.channel.send("https://trello.com/b/EpkD57uI/chapter-master-issues");
        break;
      default:
        message.channel.send("Wotz all dis zoggin' mess you'z sent me!?");
    }
  }
})

