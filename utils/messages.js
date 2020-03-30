const moment = require('moment');
moment.locale('ru');

function formatMessage(user, text){
  return {
    user,
    text,
    time: moment().format('h:mm a')
  }
}

module.exports = formatMessage;