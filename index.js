const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
var https = require('https');
const voiceit2 = require('voiceit2-nodejs');
const Util = require('util.js');


function voiceItVerify()
{
    let myVoiceIt = new voiceit2("key_10af1cb6e4fa4eb9935c34b2a50ae835", "tok_6e8b69410fa845b08493c2f7eaecea79");
    const voiceUrl = Util.getS3PreSignedUrl("Media/VerifyVoice4.wav");
   
    console.log("Verifying..");
    //console.log(voiceUrl);
    var response = '';
    myVoiceIt.voiceVerificationByUrl({
      userId : "usr_ac4d2f3c77734351b0b3f099c7ffaaa0",
      contentLanguage : "en-US",
      phrase : "Today is a nice day to go for a walk",
      audioFileURL : voiceUrl
    },(jsonResponse)=>{
      //handle response
      console.log(jsonResponse);
      //response = jsonResponse;
    });
    
    //return response;
}

const AuthenticateIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AuthenticateIntent';
    },
    handle(handlerInput) {
        var speechText = 'Done!';
        var response = voiceItVerify();
        //var responseObj = JSON.parse(response);
        //console.log('Response code:' + responseObj.responseCode);
        //console.log(response.responseCode);
        // if(responseObj.responseCode === 'SUCC'){
        //     speechText = 'User is verified!';
        // }
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        AuthenticateIntentHandler,
        LaunchRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();