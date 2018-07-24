'use strict';

const alexa = require('ask-sdk-core');
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: 'certs/your private key',
  certPath: 'certs/your certificate',
  caPath: 'certs/your CA certificate',
  clientId: 'Foo',
  host: 'your IOT ARN'
});

device.on('connect', () => {
  console.log('connected')
  device.subscribe('PlayingWithBalls')
});

let skill;

exports.handler = async function (event, context) {
  if (!skill) {
    skill = alexa.SkillBuilders.custom()
      .addRequestHandlers(
        launchRequestHandler,
        listBallsIntentHandler,
        runAwayIntentHandler,
        comeHomeIntentHandler,
        helpIntentHandler,
        cancelAndStopIntentHandler,
        sessionEndedRequestHandler
      )
      .addErrorHandlers(errorHandler)
      .create();
  }

  return skill.invoke(event, context);
}

function publishResponse(response) {
  device.publish('PlayingWithBalls', JSON.stringify(response))
}

var connectedBalls = [];

device.on('message', (topic, payload) => {
  var message = JSON.parse(payload.toString())
  handleMessage(message)
})

function handleMessage(message){
  switch (message.action) {
    case 'register_ball':
      if (!connectedBalls.includes(message.orb)) {
        connectedBalls.push(message.orb)
      }
      break
  }
}

exports.getBalls = function () {
  publishResponse({action: 'register'})
  return connectedBalls
}

const launchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Thank you for letting me play with your balls!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Playing With Balls', speechText)
            .getResponse();
    }
};

// Note:  This function hasn't been properly tested
const listBallsIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'list_balls';
    },
    handle(handlerInput) {
        let noun
        let last_ball
        let balls_sentence
        let speechText
        getBalls()
        setTimeout(() => {
          noun = connectedBalls.size > 1 ? ' balls' : ' ball'
          last_ball = connectedBalls.pop
          balls_sentence = connectedBalls.join(", ") + ` and ${last_ball}`
          speechText = 'You are playing with the ' + balls_sentence + noun;
          connectedBalls.push(last_ball)
        }, 5000)

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Playing with Balls', speechText)
            .getResponse();
    }
};

const runAwayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'run_away';
    },
    handle(handlerInput) {
        var ball = handlerInput.requestEnvelope.request.intent.slots.ball_name.value
        const speechText = `${ball} is running away`;
        publishResponse({
          action: "run_away",
          orb: ball
        })

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Playing With Balls', speechText)
            .getResponse();
    }
};

const comeHomeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'come_home';
    },
    handle(handlerInput) {
        const speechText = 'Telling the balls to go home';
        publishResponse({action: 'come_home'})

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Playing With Balls', speechText)
            .getResponse();
    }
};

const helpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can ask for a list of balls, tell a ball to run away, or tell the balls to go home';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Playing With Balls', speechText)
            .getResponse();
    }
};

const cancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Playing With Balls', speechText)
            .getResponse();
    }
};

const sessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

const errorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      console.log(error)
      process.exit(1)

      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};
