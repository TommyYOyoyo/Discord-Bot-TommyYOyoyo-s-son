// Replies

// NOTES for the INTENTS LIBRARY: 
// intents = reply dictionarries,
// tag = reply tag,
// patterns = possible messages,
// answers = bot possible answers,
// startorhas = determines if the checking method is to detect whether the message content starts with the pattern of the message has the content in it
// newpatterns = expected new user messages after the bot reply,
// newanswers = new possible answers from the bot,
// newstartorhas = basically a startorhas but for the new expected answer

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    CommandInteractionOptionResolver,
} = require('discord.js');
const db = require('../../TYS_Main/src/db.js');

var shutReplies = ["ok", "no", "no you", "umm", ".", "_ _", "*😏*"]
var hikiddoReplies = ["Hi old man.", "Hey!!!", "hi, kim jong-un", "go away i hate you", "hi, joe biden"]
var heykidReplies = ["go away", 'hi, "adult"', "Don't call me a kid :(((", "Hello I want another babysitter ouainnnnnnnn..."]
var havefunReplies = ["I want another babysitter ouainnnnnnnn...", "I dont like you go away", "YEETTTT"]
var stfuReplies = ["no you.", "ok", "nah im never going to stfu its literally impossible", "no pls", "nah sry"]
var meanReplies = ["yes!", "meaaan!", "👎", "👍", "nah", "agreed", "disagreed."]
var lmaoReplies = ["yessir", "👍", "LMFAOO", "yes, lol!", "LOLLL", "_ _", "...", "🤔", "**LMAO**", "bro", "LOL", "LMFAO"]

module.exports = {

    // THE INTENTS LIBRARY
    replies: {
        intents: [{
            tag: "shut",
            patterns: ["shut up", "stfu", "shut yo", "shut", "shut the fuck up"],
            answers: ["no you.", "ok", "nah im never going to stfu its literally impossible", "no pls", "nah sry", "ok", "no", "no you", "umm", ".", "_ _", "*😏*", ":skull:", 'Alrighty my bad sorry', "Let's move on another subject.", "Nah, I want to keep annoying you :)", "Um ok", ":skull: :skull: :skull:"],
            startorhas: 'has',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }, {
            tag: "lol",
            patterns: ["lol", "lmao", "lmfao", "kekw", "wheeze"],
            answers: ["yessir", "👍", "LMFAOO", "yes, lol!", "LOLLL", "_ _", "...", "🤔", "**LMAO**", "bro", "LOL", "LMFAO", "*wheeze*", "I'm wheezing to death!", "unfunny.", "haha", "Heheheh"],
            startorhas: 'has',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }, {
            tag: "mean",
            patterns: ["so mean", "mean", "too mean"],
            answers: ["yes!", "meaaan!", "👎", "👍", "nah", "agreed", "disagreed.", ":skull: :skull: :skull:"],
            startorhas: 'has',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }, {
            tag: "greeting",
            patterns: ["hi", "is anyone there?", "hello", "good day", "whats up", "yo", "hey"],
            answers: ["Hello!", "Good to see you again!", "Hi there, how can I help?", "Yo my pal!", "Sup", "Hey!", "Hello there!", "Hiiiii!", "I'm so happy to see you again!", ":wave:"],
            startorhas: 'start',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }, {
            tag: "howsday",
            patterns: ["how are you", "sup", "how r u", "how's day", "hows day", "u good"],
            answers: ["I'm fine, and you?", "I'm good! Thanks", "Good and you?", "I'm really happy!", "Sup"],
            startorhas: 'start',
            newpatterns: ["good", "good and you", "fine", "terrible", "bad", "good", "well"],
            newanswers: ["Why tho?", "Why?"],
            newstartorhas: 'has',
        }, {
            tag: "bye",
            patterns: ["bye", "cya", "see you", "bye", "goodbye", "goodnight", "gn", "have a nice", "chao", "see ya"],
            answers: ["See you!", "Byebye!", "Cyaa!", ":wave:"],
            startorhas: 'has',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }, {
            tag: "preference",
            patterns: ["do you like", "do you love", "do you appreciate", "do u like", "do u love", "do u appreciate"],
            answers: ["Absolutely!", "Totally disagreed.", "Nah", "YESS!", "Well, I'm kinda neutral.", "No idea"],
            startorhas: 'start',
            newpatterns: ["why"],
            newanswers: ["Because I am made like this", "Because I do, so I do!", "This is just my opinion, don't take it too serious", "Actually I have no idea"],
            newstartorhas: "start",
        }, {
            tag: "help",
            patterns: ["can you", "can u", "could you", "can you", "i would like", "i want", "can i", "could i"],
            answers: ["Use /help or tys help to see the list of commands, and feel free to use the ones you need!"],
            startorhas: 'start',
            newpatterns: null,
            newanswers: null,
            newstartorhas: null,
        }]
    },
    reply: async function (message, lowercasedMsg) {

        for (const intent of this.replies.intents) { // fetch intent from the intents library above
            for (const pattern of intent.patterns) { // fetching patterns of each intent

                const isPreviousReplying = await previousMsgReply(message, message.author); //is replying to the previous message?

                if (isPreviousReplying) {
                    return; //if it replied to the previous message, quit this function
                }

                const mainReply = intent.answers[Math.floor(Math.random() * intent.answers.length)]; // each loop, a new reply generates

                if (intent.startorhas == 'start') { // * if the detection type is "if the message starts with the pattern"
                    if (lowercasedMsg.startsWith(pattern)) { // found matching pattern in the message

                        message.reply(mainReply); // if the condition above is matched, MAIN REPLY

                        if (intent.newpatterns != null) { // checking if there is a new pattern expected, from the library above

                            let newStartOrHas = intent.newstartorhas;
                            const filter = m => m.author == message.author;

                            const collector = message.channel.createMessageCollector({
                                filter,
                                time: 10000
                            }); // new messages collector
                            collector.on('collect', m => {

                                let newReply = intent.newanswers[Math.floor(Math.random() * intent.newanswers.length)];

                                for (const newpattern of intent.newpatterns) { // fetching expected patterns
                                    if (newStartOrHas.toLowerCase() == 'has') {
                                        if (m.content.toLowerCase().indexOf(newpattern) > -1) {
                                            m.reply(newReply);
                                            collector.stop();
                                            db.setKey(`user.${m.author.id}.replyBot.prevBotMsg`, newReply);
                                            db.setKey(`user.${m.author.id}.replyBot.prevMsg`, m.content.toLowerCase().toString());
                                            return;
                                        }
                                    } else if (newStartOrHas.toLowerCase() == 'start') {
                                        if (m.content.toLowerCase().startsWith(newpattern)) {
                                            m.reply(newReply);
                                            collector.stop();
                                            db.setKey(`user.${m.author.id}.replyBot.prevBotMsg`, newReply);
                                            db.setKey(`user.${m.author.id}.replyBot.prevMsg`, m.content.toLowerCase().toString());
                                            return;
                                        }
                                    } else {
                                        console.log("[ERROR] ReplyBot *NEW message detection type unknown");
                                        collector.stop();
                                        return;
                                    }
                                }

                            })
                        } else {
                            db.setKey(`user.${message.author.id}.replyBot.prevBotMsg`, mainReply);
                            db.setKey(`user.${message.author.id}.replyBot.prevMsg`, message.content.toLowerCase().toString());
                            return; // if there is not a new pattern expected, quit the function
                        }
                    }

                } else if (intent.startorhas == 'has') { // * if the detection type is "if the message contains the pattern"
                    if (lowercasedMsg.indexOf(pattern) > -1) {

                        message.reply(mainReply); // if the condition above is matched, MAIN REPLY

                        if (intent.newpatterns != null) { // checking if there is a new pattern expected, from the library above

                            let newStartOrHas = intent.newstartorhas;
                            const filter = m => m.author == message.author;

                            const collector = message.channel.createMessageCollector({
                                filter,
                                time: 10000
                            }); // new messages collector
                            collector.on('collect', m => {

                                let newReply = intent.newanswers[Math.floor(Math.random() * intent.newanswers.length)];

                                for (const newpattern of intent.newpatterns) { // fetching expected patterns
                                    if (newStartOrHas == 'has') {
                                        if (m.content.toLowerCase().indexOf(newpattern) > -1) {
                                            m.reply(newReply);
                                            collector.stop();
                                            db.setKey(`user.${m.author.id}.replyBot.prevBotMsg`, newReply);
                                            db.setKey(`user.${m.author.id}.replyBot.prevMsg`, m.content.toLowerCase().toString());
                                            return;
                                        }
                                    } else if (newStartOrHas == 'start') {
                                        if (m.content.toLowerCase().startsWith(newpattern)) {
                                            m.reply(newReply);
                                            collector.stop();
                                            db.setKey(`user.${m.author.id}.replyBot.prevBotMsg`, newReply);
                                            db.setKey(`user.${m.author.id}.replyBot.prevMsg`, m.content.toLowerCase().toString());
                                            return;
                                        }
                                    } else {
                                        console.log("[ERROR] ReplyBot *NEW message detection type unknown");
                                        collector.stop();
                                        return;
                                    }
                                }

                            })
                        } else {
                            db.setKey(`user.${message.author.id}.replyBot.prevBotMsg`, mainReply);
                            db.setKey(`user.${message.author.id}.replyBot.prevMsg`, message.content.toLowerCase().toString());
                            return; // if there is not a new pattern expected, quit the function
                        }
                    }
                } else {
                    console.log("[ERROR] ReplyBot message detection type unknown");
                    return;
                }
            }
        }
        return;
    },
    /*whosmomReply: function (message) {
        message.reply("Suuuuuuuri!!! <3");
    },
    whosdadReply: function (message) {
        message.reply("Tommmmmyyyyyyy!!! <3");
    },
    shutupReply: function (message) {
        message.reply(shutReplies[Math.floor(Math.random() * shutReplies.length)]);
    },
    stfuReply: function (message) {
        message.reply(stfuReplies[Math.floor(Math.random() * stfuReplies.length)]);
    },
    meanReply: function (message) {
        message.reply(meanReplies[Math.floor(Math.random() * meanReplies.length)]);
    },
    joyReply: function (message) {
        message.reply("😂😂😂");
    },
    babeReply: function (message) {
        message.reply("hello there~~~")
    },
    hikidReply: function (message) {
        var hkreply = heykidReplies[Math.floor(Math.random() * heykidReplies.length)]
        if (hkreply == heykidReplies[3]) {
            if (message.author != process.env.BABYSIT) {
                var hkreply = heykidReplies[Math.floor(Math.random() * heykidReplies.length) - 1]
            } else {
                var hkreply = hkreply
            }
        }
        message.reply(hkreply);
    },
    hikiddoReply: function (message) {
        message.reply(hikiddoReplies[Math.floor(Math.random() * hikiddoReplies.length)]);
    },
    havefunReply: function (message) {
        message.reply(havefunReplies[Math.floor(Math.random() * havefunReplies.length)]);
    },
    lolReply: function (message, myid) {
        if (message.author != myid) {
            message.reply(lmaoReplies[Math.floor(Math.random() * lmaoReplies.length)])
        }
    }*/
}

async function previousMsgReply(message, user) { // replying to the previously stored message

    let previousBotMsg = await db.getKey(`user.${user.id}.replyBot.prevBotMsg`); // fetching previous bot message
    let previousMsg = await db.getKey(`user.${user.id}.replyBot.prevMsg`); // fetching previous message

    intentsLoop: for (const intent of module.exports.replies.intents) { // fetching thru the intents library
        patternsLoop: for (const pattern of intent.patterns) { // fetching thru the possible patterns matching
            answersLoop: for (const answer of intent.answers) { // fetching thru the possible answers matching

                if (intent.newpatterns == null) { // if there is no new patterns

                    if (previousBotMsg == pattern) { // stores the matching message

                        // TO WORK ON;

                        return false;

                    }

                } else { // if there are new patterns
                    newPatternsLoop: for (const newpattern of intent.newpatterns) { // fetching thru the possible new patterns matching
                        newAnswersLoop: for (const newAnswer of intent.newanswers) { // fetching thru the possible new answers matching

                            if (previousBotMsg == newAnswer) { //if the previous bot message sent matches the answer

                                if (previousBotMsg == "Why tho?" || previousBotMsg == "Why?") {    //when the bots previous message is this
                                    if (message.content.toLowerCase().startsWith("cuz") || message.content.toLowerCase().startsWith("because") || message.content.toLowerCase().startsWith("coz")) {
                                        if (message.content.toLowerCase().indexOf("great") > -1 || message.content.toLowerCase().indexOf("fantastic") > -1 || message.content.toLowerCase().indexOf("good") > -1 || message.content.toLowerCase().indexOf("nice") > -1 || message.content.toLowerCase().indexOf("happy") > -1 || message.content.toLowerCase().indexOf("proud") > -1) {
                                            message.reply("That's nice!");
                                            db.setKey(`user.${message.author.id}.replyBot.prevBotMsg`, `That's nice!`);
                                        } else if (message.content.toLowerCase().indexOf("bad") > -1 || message.content.toLowerCase().indexOf("terrible") > -1 || message.content.toLowerCase().indexOf("sad") > -1 || message.content.toLowerCase().indexOf("depressed") > -1 || message.content.toLowerCase().indexOf("anxiety") > -1 || message.content.toLowerCase().indexOf("worried") > -1 || message.content.toLowerCase().indexOf("regret") > -1 || message.content.toLowerCase().indexOf("worse") > -1 || message.content.toLowerCase().indexOf("worst") > -1) {
                                            message.reply("I'm sorry to hear that... But everything will be alright, don't worry!")
                                            db.setKey(`user.${message.author.id}.replyBot.prevBotMsg`, `I'm sorry to hear that... But everything will be alright, don't worry!`);
                                        } else {
                                            message.reply("Oh-");
                                            db.setKey(`user.${message.author.id}.replyBot.prevBotMsg`, `Oh-`);
                                        }
                                        db.setKey(`user.${message.author.id}.replyBot.prevMsg`, message.content.toString());
                                        return true;
                                    }
                                }

                                return false;  // return false to not let the bot proceed on normal replybot

                            } else if (previousMsg == newpattern) {

                                // TO WORK ON

                            }
                        }
                    }
                }
            }
        }
    }

    return false;

}