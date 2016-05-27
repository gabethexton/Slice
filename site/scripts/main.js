'use strict';

var Story = {};

//takes form input from index.html and saves it to local storage
function saveLocal() {
    var queryStartLocation = (window.location.href.indexOf('?'));
    var input = window.location.href.slice(queryStartLocation + 1).split('&');
    console.log(input);
    for (var i = 0; i < input.length; i++) {
        input[i] = input[i].split('=');
        localStorage.setItem(input[i][0], input[i][1]);
    }
}
saveLocal();

// manages and cleans up local storage values for use in story
//Story currently takes variables for City, Pronouns and Restaurant
var remPlus = /\+/gi;
var fixCommas = /\%27/gi;
var city = localStorage.city.replace(remPlus, " ").replace(fixCommas, "'");
var cityIds = {
    'Buenos Aires': 3435910,
    'Fort Collins': 5577147,
    'Paris': 6455259,
    'Portland': 5746545,
    'Tokyo': 1850147
};
var cityId = cityIds[city];
console.log(cityId);
var pronouns = localStorage.pronouns;
var determiner = '';
var personal = '';
var possessive = '';
var determinerU = '';
var personalU = '';
var possessiveU = '';
if (pronouns === 'm') {
    determiner = 'him';
    personal = 'he';
    possessive = 'his';
    determinerU = 'Him';
    personalU = 'He';
    possessiveU = 'His';
} else if (pronouns === 'f') {
    determiner = 'her';
    personal = 'she';
    possessive = 'hers';
    determinerU = 'Her';
    personalU = 'She';
    possessiveU = 'Hers';
} else if (pronouns === 'o') {
    determiner = 'them';
    personal = 'they';
    possessive = 'theirs';
    determinerU = 'Them';
    personalU = 'They';
    possessiveU = 'Theirs';
}
console.log(pronouns);
var restaurant = localStorage.restaurant.replace(remPlus, " ").replace(fixCommas, "'");
console.log(restaurant);

// Calls OpenWeather API and sets up vars to use in story
// Set Up Weather vars
var todayWeather = '';
var tomorrowWeather = '';
var tomorrowVerse2Weather = '';
var weatherCodes = {
    200: 'thunderstorm with light rain',
    201: 'thunderstorm with rain',
    202: 'thunderstorm with heavy rain',
    210: 'light thunderstorm',
    211: 'thunderstorm',
    212: 'heavy thunderstorm',
    221: 'ragged thunderstorm',
    230: 'thunderstorm with light drizzle',
    231: 'thunderstorm with drizzle',
    232: 'thunderstorm with heavy drizzle',
    300: 'light intensity drizzle',
    301: 'drizzle',
    302: 'heavy intensity drizzle',
    310: 'light intensity drizzle rain',
    311: 'drizzle rain',
    312: 'heavy intensity drizzle rain',
    313: 'shower rain and drizzle',
    314: 'heavy shower rain and drizzle',
    321: 'shower drizzle',
    500: 'light rain',
    501: 'moderate rain',
    502: 'heavy intensity rain',
    503: 'very heavy rain',
    504: 'extreme rain',
    511: 'freezing rain',
    520: 'light intensity shower rain',
    521: 'shower rain',
    522: 'heavy intensity shower rain',
    531: 'ragged shower rain',
    600: 'light snow',
    601: 'snow',
    602: 'heavy snow',
    611: 'sleet',
    612: 'shower sleet',
    615: 'light rain and snow',
    616: 'rain and snow',
    620: 'light shower snow',
    621: 'shower snow',
    622: 'heavy shower snow',
    701: 'mist',
    711: 'smoke',
    721: 'haze',
    731: 'sand & dust whirls',
    741: 'fog',
    751: 'sand',
    761: 'dust',
    762: 'volcanic ash',
    771: 'squalls',
    781: 'tornado',
    800: 'clear sky',
    801: 'few clouds',
    802: 'scattered clouds',
    803: 'broken clouds',
    804: 'overcast clouds',
    900: 'tornado',
    901: 'tropical storm',
    902: 'hurricane',
    903: 'cold',
    904: 'hot',
    905: 'windy',
    906: 'hail',
    951: 'calm',
    952: 'light breeze',
    953: 'gentle breeze',
    954: 'moderate breeze',
    955: 'fresh breeze',
    956: 'strong breeze',
    957: 'high wind or near gale',
    958: 'gale',
    959: 'severe gale',
    960: 'storm',
    961: 'violent storm',
    962: 'hurricane'
};
// Get Weather Info for chosen city
var method = 'GET';
var url = 'http://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&APPID=7fc9a2a76380931fd052765cffd1fb59';
ajax(method, url, setWeatherVars);

function ajax(method, url, handler) {
    var parsedResponseText = {};
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
        if (XHR.readyState === 4) {
            if (XHR.status === 200) {
                handler(null, JSON.parse(this.responseText));
                parsedResponseText = JSON.parse(this.responseText);
            } else {
                handler(XHR.status, null);
            }
        }
    };
    XHR.open(method, url);
    XHR.send();
}

// Apply Weather info to story via variables
function setWeatherVars(err, data) {
    console.log(data);
    if (!err) {
        todayWeather = data.list[0].weather[0].description;
        console.log(todayWeather);
        tomorrowWeather = data.list[8].weather[0].description;
        console.log(tomorrowWeather);
        if (todayWeather === tomorrowWeather) {
            console.log('Weather forecasts were identical, generated random values for tomorrowWeather.');
            var count = 0;
            for (var code in weatherCodes) {
                if (Math.random() < 1 / ++count) {
                    tomorrowWeather = weatherCodes[code];
                }
            }
        }
        console.log(tomorrowWeather);
    } else {
        todayWeather = 'clear sky';
        tomorrowWeather = 'light rain';
        tomorrowVerse2Weather = 'fog';
        console.log('Default weather types used.');
    }
    var countA = 0;
    for (var codeA in weatherCodes) {
        if (Math.random() < 1 / ++countA) {
            tomorrowVerse2Weather = weatherCodes[codeA];
        }
    }
    storyStart();
}

// adds starting point of story to page once weather is loaded
function storyStart() {
    console.log('Started StoryStart');
    // STORY OBJECT
    Story = {
        Chapter1: {
            Ch1: '<div>&nbsp; &nbsp; &nbsp;It\'s the end of a long day and you\'re so ready to go home that you almost forget your keys. You look out the window, the forecast called for ' + todayWeather + ' today in the beautiful city of ' + city + ' and it wasn\'t too far off.<br>You head out the door, turn onto the sidewalk, and run smack into...<br><br>Yourself.<br><br>&nbsp; &nbsp; &nbsp;"What the?!.."<br><br>&nbsp; &nbsp; &nbsp;Before the expletive can leave your lips, the other you has turned 180 degrees and is running full speed in the other direction. You\'re not sure why, but you take off full-tilt after ' + determiner + ' and really can\'t gain any ground because the other you is, well... you. This is so weird, what\'s going on? You don\'t have time to wonder as other-you rounds the corner into an alley about half a block ahead. When you finally get to the corner and turn in after ' + determiner + ', you barely get two steps into the dead-end alley before you trip on something and land flat on your face.<br><br>&nbsp; &nbsp; &nbsp;"UNGH!"<br><br>&nbsp; &nbsp; &nbsp;"Sorry." says your doppleganger as you roll over and grasp your shoulder in pain. "What\'s tomorrows forecast look like?!"<br><br>&nbsp; &nbsp; &nbsp;You stare in disbelief. "Uhhhh..."<br><br>&nbsp; &nbsp; &nbsp;"C\'mon! Hurry Up, what\'s tomorrow\'s forecast?!!"<br><br>&nbsp; &nbsp; &nbsp;"Uhhhh..." you reach for your phone, not really knowing why. Stunned is probably the right word for how you\'re feeling right now.<br><br>&nbsp; &nbsp; &nbsp;"SERIOUSLY!!! I don\'t have time for this!" &nbsp;' + personal + ' reaches out to grab the phone from your hands but you manage to get your weather app open and announce with a sense of Deja-vu...<br><br>&nbsp; &nbsp; &nbsp;"It says ' + tomorrowWeather + ' for tomorrow! WHY ARE YOU ME?!?!"<br><br>' + personalU + ' laughs nervously and starts to back away.<br><br>&nbsp; &nbsp; &nbsp;"I\'m not really you, we\'re just really similar and if that forecast is right, I\'m in the wrong verse for s..."<br><br>&nbsp; &nbsp; &nbsp;Other you trails off and goes ghost white in the face. "We need to go. NOW!"<br><br>&nbsp; &nbsp; &nbsp;' + personalU + ' is motioning toward the brick wall at the back of the alley. You jump to your feet and look back to see a man who looks like something out of Mad Max entering the alley.</div><br><br><button type="button" class="btn btn-primary " id="ch1ToCh1A">You say "OK" and take off running with yourself.</button><button type="button" class="btn btn-primary " id="ch1ToCh1B">You don\'t say anything, but turn and run back towards the street.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1A: '<div>&nbsp; &nbsp; &nbsp;You\'re running and yelling at the same time, you can barely get words out but you manage to scream..<br><br>&nbsp; &nbsp; &nbsp;\'DEAD END!!!\'<br><br>&nbsp; &nbsp; &nbsp;Your reflection looks at you and laughs.<br><br>&nbsp; &nbsp; &nbsp;"Welcome to the multiverse!" ' + personal + ' says as ' + personal + ' takes what looks like a knife out of ' + determiner + ' pocket and swings it through the air diagonally.<br><br>&nbsp; &nbsp; &nbsp;"Are you ready?!"<br><br>&nbsp; &nbsp; &nbsp;You look at yourself. "Ready for what?!"<br><br>&nbsp; &nbsp; &nbsp;Your doppleganger turns toward the madman and yells at him.<br><br>&nbsp; &nbsp; &nbsp;"CATCH ME IF YOU CAN, IBO DUET!!!" then grabs you by the arm and thrusts you forward.<br><br>&nbsp; &nbsp; &nbsp;It\'s then that you see what looks sort of like a cut sheer-curtain waving in the air where the knife had been swung. The only thing is that there\'s nothing there, just a... cut in the air?<br><br>&nbsp; &nbsp; &nbsp;Everything feels like it\'s going in slow motion.<br><br>&nbsp; &nbsp; &nbsp;You look back and see the madman charging towards you both.<br><br>&nbsp; &nbsp; &nbsp; You and yourself tumble through the cut and land on the ground. You stand up and look back. The madman isn\'t there and you look to other you for an answer.<br><br>&nbsp; &nbsp; &nbsp;"Where\'d he go?!"<br><br>&nbsp; &nbsp; &nbsp;"He didn\'t go anywhere. We\'re the ones that left."<br><br>&nbsp; &nbsp; &nbsp;"What the heck does that mean?!"<br><br>&nbsp; &nbsp; &nbsp;' + personalU + ' holds up the knife and says, with all confidence,<br><br>&nbsp; &nbsp; &nbsp;"We\'re in a different universe now. Well, I mean, it\'s not a universe, it\'s just a verse, one of infinite in the multiverse, but either way, we\'ve got to figure out which one it is before we do anything else."<br><br>&nbsp; &nbsp; &nbsp;You stutter...<br><br>&nbsp; &nbsp; &nbsp;"Uni-multi-what?! This isn\'t Star Trek, what the heck are you talking about!?"<br><br>&nbsp; &nbsp; &nbsp;"I\'ll explain later, does your phone work?"<br><br>&nbsp; &nbsp; &nbsp;You stare at yourself for a second. You don\'t look half bad. I mean for being...<br><br>&nbsp; &nbsp; &nbsp;"HELLO!? Does your phone work?! Do you have service?"<br><br>&nbsp; &nbsp; &nbsp;You snap out of it and pull your phone out of your pocket.<br><br>&nbsp; &nbsp; &nbsp;"Yeah, I\'ve got the same service I usually have downtown."<br><br>&nbsp; &nbsp; &nbsp;"This isn\'t your... nevermind. What\'s tomorrow\'s forecast?"<br><br>&nbsp; &nbsp; &nbsp;"I just told you like two minutes ago, it says ' + tomorrowWeather + '."<br><br>&nbsp; &nbsp; &nbsp;"Check it again and do it quick."<br><br>&nbsp; &nbsp; &nbsp;You check your phone and to your astonishment the forecast is dramatically different.<br><br>&nbsp; &nbsp; &nbsp;"It... it... it says to expect ' + tomorrowVerse2Weather + '... how can that be?"<br><br>&nbsp; &nbsp; &nbsp;"Like I said, we\'re in another verse. Things change from verse to verse. One of the most common differences are the weather patterns, and in this neighborhood of verses that\'s a pretty accurate way of knowing if we\'re safe or not. This one should be safe enough, let\'s head to my place, c\'mon."<br><br>&nbsp; &nbsp; &nbsp;You follow yourself to the end of the alley cautiously. Other you turns left and beckons.</div><br><br><button type="button" class="btn btn-primary " id="ch1AToCh1C">You\'re confused but need to know more so you follow left.</button><button type="button" class="btn btn-primary " id="ch1AToCh1D">You\'ve had enough. You take off running to the right.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1B: '<div>&nbsp; &nbsp; &nbsp;The strange looking figure at the entrance of the alley watches as you approach.<br><br>&nbsp; &nbsp; &nbsp;You hear yourself scream at you from behind.<br><br>&nbsp; &nbsp; &nbsp;The last thing you see is a giant sword.<br><br>&nbsp; &nbsp; &nbsp;It was a good life while it lasted.</div><br><br><button type="button" class="btn btn-primary " id="restart">Decide you believe in re-incarnation and try again.</button><button type="button" class="btn btn-primary " id="end">Accept your Death.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1C: '<div>&nbsp; &nbsp; &nbsp;You\'re a few paces behind so you shout at yourself to slow down. Other you does and you jog to catch up.<br><br>&nbsp; &nbsp; &nbsp;"I\'m going to need some explanation here, starting with who you are and how we got here."<br><br>&nbsp; &nbsp; &nbsp;"Now you\'re coming around to it. I\'m not you, but in a way I am. You see, the multiverse is essentially about possibility. What I mean is, in your verse maybe you woke up at 7:02 and seven seconds this morning, but in another verse a version of you woke up one second later, and everything, AND I MEAN EVERYTHING else is EXACTLY PRECISELY WITHOUT A DOUBT the same. Past present and future."<br><br>&nbsp; &nbsp; &nbsp;It\'s a lot to take in, but you nod. ' + personalU + ' continues.<br><br>&nbsp; &nbsp; &nbsp;"In other verses however, the dinosaurs never went extinct and live along-side humans, and in some, the humans never made it and it\'s all dinos, all the time. and..."<br><br>&nbsp; &nbsp; &nbsp;"But how did we get here?" you interrupt.<br><br>&nbsp; &nbsp; &nbsp;"You\'re tracking? Wow. Ok. I always thought I was a quick learner..." your other self says. "You know, we\'re pretty smart you and me."<br><br>&nbsp; &nbsp; &nbsp;"You and I" you correct yourself.<br><br>&nbsp; &nbsp; &nbsp;"Really?" ' + personal + ' says, "You guys say it that way? Sounds so weird."<br><br>&nbsp; &nbsp; &nbsp;"HOW DID WE GET HERE!" you demand.<br><br>&nbsp; &nbsp; &nbsp;"Right, sorry... this." your other self says pulling out the knife. You now realize that it\'s not really a knife, but more of a shard of something, it looks glass-like but silvery and takes on the color of things around it in a life-like way. It almost looks magical. You\'ve never seen anything like it.<br><br>&nbsp; &nbsp; &nbsp;"What the heck is that?!" you ask.<br><br>&nbsp; &nbsp; &nbsp;"This, my friend, is a Unicorn Horn. Naw, just kidding. This is my blade. Long story short, they\'re super-rare, can get you killed in a variety of ways, and are good for one thing only. Cutting through the fabric of the multiverse. THIS, is how we got here."<br><br>&nbsp; &nbsp; &nbsp;"Wha...?"<br><br>&nbsp; &nbsp; &nbsp;Your reflection starts laughing.<br><br>&nbsp; &nbsp; &nbsp;"I knew I\'d lose you somewhere. We\'ll work on it later. We\'re home."<br><br>&nbsp; &nbsp; &nbsp;You look up to see your apartment building, but you\'re at the back entrance that nobody ever uses. You grab the door to open it but your doppleganger sticks ' + determiner + ' foot against the base of the door and stops you.<br><br>&nbsp; &nbsp; &nbsp;"We need to make sure it\'s clear."<br><br>&nbsp; &nbsp; &nbsp;"Am I some sort of crook in this universe?!" you exclaim as you realize how different things are.<br><br>&nbsp; &nbsp; &nbsp;"I\'m not you and it\'s a verse not a universe, but crook isn\'t the word I\'d use. Let\'s just say that not everything I do is appreciated around here."</div><br><br><button type="button" class="btn btn-primary " id="ch1CToCh1E">This is too much uncertainty. You demand to be taken home.</button><button type="button" class="btn btn-primary " id="ch1CToCh1F">You laugh and fling the door open.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1D: '<div>&nbsp; &nbsp; &nbsp;You get about 10 blocks before you slow down and take stock of the situation. You sit down on a bench at a park and look around. You can\'t believe what just happened and the more you look around, the less you believe that it did happen. This is no \'other universe\', everything\'s the same. You\'ve been to this park before. You walk down that street every day. ' + restaurant + ' is right over there, you\'ve been to there at least a dozen times. Suddenly you realize that you\'re very hungry.<br><br>&nbsp; &nbsp; &nbsp;You get up and go over to ' + restaurant + '. You\'re still a little sketched out so you order your meal to go. You pull out your card to pay but when you swipe it nothing happens on the tiny screen. You try again but still nothing on the tiny screen. You look at the employee and she\'s doing a bit of a thing with her face.<br><br>&nbsp; &nbsp; &nbsp;"I\'ll umm.. I\'ll be right back yeah, right back." she says and nervously dance-walks her way to the back of the restaurant.<br><br>&nbsp; &nbsp; &nbsp;You\'re still wondering where she went when you hear a screeching of tires and a crazy-loud speaker blasts to life.<br><br>&nbsp; &nbsp; &nbsp;"COME OUT WITH YOUR HANDS UP!"<br><br>&nbsp; &nbsp; &nbsp;With your to-go silverware in hand, you turn and look out the window. There are probably ten cops outside with guns drawn and you realize they\'re pointing at you. You go to raise your hands in surrender but the silverware looks oddly like a particular knife these cops are quite familiar with. They waste no time responding and the last thing you hear is the sound of 8 standard-issue handguns firing.<br><br>&nbsp; &nbsp; &nbsp;Your final thought is confident and crystal clear. "This isn\'t my universe."</div><br><br><button type="button" class="btn btn-primary " id="restart">Decide you believe in re-incarnation and try again.</button><button type="button" class="btn btn-primary " id="end">Accept your death.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1E: '<div>&nbsp; &nbsp; &nbsp;Your doppleganger looks disappointed, but reaches for ' + determiner + ' blade.<br><br>&nbsp; &nbsp; &nbsp;"It was good while it lasted I guess." ' + personal + ' says, slicing a rift open. "It was nice knowing you."<br><br>&nbsp; &nbsp; &nbsp;You stare at yourself for a moment. Then at the rift. Then back at this strange other version of you. It feels weird to be leaving but you have to get home.<br><br>&nbsp; &nbsp; &nbsp;"I guess I\'ll see you around." you say.<br><br>&nbsp; &nbsp; &nbsp;"Not likely."<br><br>&nbsp; &nbsp; &nbsp;"We\'ll that\'s pessimistic of you." you say as you step toward the rift.<br><br>&nbsp; &nbsp; &nbsp;"Nah, just realistic." you hear yourself say as you step out of one verse into another.<br><br>&nbsp; &nbsp; &nbsp;The rift closes immediately behind you and as you turn to look back, you have a moment of relief. It wasn\'t that long, but it\'s finally over. You open the door to your building and step in. Heading down the familiar hall feels good in an epic way. You unlock your door, head in to your apartment, and the world falls apart again.<br><br>&nbsp; &nbsp; &nbsp;You\'re staring at yourself again.<br><br>&nbsp; &nbsp; &nbsp;You\'re pissed.<br><br>&nbsp; &nbsp; &nbsp;"DIDN\'T I JUST LEAVE YOU!? YOU WERE SUPPOSED TO SEND ME HOME!!"<br><br>&nbsp; &nbsp; &nbsp;Your doppleganger screams and begins to throw things at you. Your phone, a couch pillow, a picture frame.<br><br>&nbsp; &nbsp; &nbsp;"OUCH!" It\'s then that you realize that this you isn\'t the you that you just left. This is a 3rd you.<br><br>&nbsp; &nbsp; &nbsp;You\'re not in your own verse.<br><br>&nbsp; &nbsp; &nbsp;"HEY HEY HEY, It\'s OK!!! I\'m just you from another verse!"<br><br>&nbsp; &nbsp; &nbsp;"WHAT THE...?!" 3rd you is freaking out, ' + personal + ' charges at you. You try to dodge, but slip and end up getting tackled backwards into the door.<br><br>&nbsp; &nbsp; &nbsp;Everything goes black.<br><br>&nbsp; &nbsp; &nbsp;You\'re out for a long time.<br><br>&nbsp; &nbsp; &nbsp;When you come to, you\'re in a hospital, handcuffed to the bed. You sit up slowly and realize that this is no ordinary hospital. You\'re surrounded by military personnel and scientists. You spend the rest of your life being examined and trying over and over to explain that you\'re not crazy, or an alien, or anything like that...<br><br>&nbsp; &nbsp; &nbsp;You\'re just someone from another verse trying to get home.</div><br><br><button type="button" class="btn btn-primary " id="restart">Decide you believe in re-incarnation and try again.</button><button type="button" class="btn btn-primary " id="end">Accept your death.</button><button type="button" class="btn btn-primary " id="quit">Quit Reading</button>',
            Ch1F: '<div>&nbsp; &nbsp; &nbsp;The door bangs against the wall and you feel bad, you\'re not usually that bold or hard on things.<br>Your reflection cringes and looks down the hallway in front of you. You take off towards your appartment with ' + determiner + ' following behind. You get to your apartment door and your other swats your hand away from the knob.<br><br>&nbsp; &nbsp; &nbsp;' + personalU + ' hiss-whispers at you<br><br>&nbsp; &nbsp; &nbsp;"WE DON\'T KNOW IF WE\'RE INSIDE!"<br><br>&nbsp; &nbsp; &nbsp;You pause.<br><br>&nbsp; &nbsp; &nbsp;"Knock then?"<br><br>&nbsp; &nbsp; &nbsp;"Yes. and get out of the way of the peep hole."<br><br>&nbsp; &nbsp; &nbsp;You take ' + determiner + ' advice and when there\'s no response you go inside together. The apartment feels like home, but off, there are little things different everywhere, picture frames are different, the TV looks exactly like your Samsung, but the logo says \'Kor-Tel\'. You sit down on the couch in your usual spot to collect your thoughts.<br><br>&nbsp; &nbsp; &nbsp;Other you is rummaging through the fridge and exclaims excitedly<br><br>&nbsp; &nbsp; &nbsp;"There\'s a whole meal in here from ' + restaurant + '! Let\'s eat!"<br><br>&nbsp; &nbsp; &nbsp;You\'re both busy eating when the apartment door opens and another you walks in. You glance at each-other and then back at the 3rd you.<br><br>&nbsp; &nbsp; &nbsp;"You guys are idiots, that food is like three weeks old and from a pretty sketchy verse at that." ' + personal + ' says.<br><br>&nbsp; &nbsp; &nbsp;You all break out in laughter and you realize how truly strange your day has been and how tired you really are. It\'s agreed that you\'ll take the couch, your 2nd copy will take the spare room futon, and 3rd you will take the master bed, as this is actually ' + determiner + ' verse.<br><br>&nbsp; &nbsp; &nbsp;You don\'t bother to set your alarm and are out in seconds.<br><br>&nbsp; &nbsp; &nbsp;</div><br><br><button type="button" class="btn btn-primary " id="end">To be continued...</button>'
        }
    };

    var mainParagraphText = document.querySelector('#mainParagraphText');
    mainParagraphText.innerHTML = mainParagraphText.innerHTML + Story.Chapter1.Ch1;
    //vars to work with buttons in this segment
    var ch1ToCh1A = document.querySelector('#ch1ToCh1A');
    var ch1ToCh1B = document.querySelector('#ch1ToCh1B');
    var quit = document.querySelector('#quit');
    //adds event listeners to initial buttons
    ch1ToCh1A.addEventListener('click', storySwitcher);
    ch1ToCh1B.addEventListener('click', storySwitcher);
    quit.addEventListener('click', storySwitcher);
}



// story switcher
function storySwitcher(event) {
    if (event.target.id === 'end' || event.target.id === 'quit') {
        console.log('User clicked end or quit.');
        // take user to thankyou.html
        window.location.assign('/slice/thankyou.html');
    } else if (event.target.id === 'restart') {
        console.log('User clicked restart');
        // take user to ch1 & scroll to the top
        mainParagraphText.innerHTML = Story.Chapter1.Ch1;
        mainParagraphText.scrollTop = 0;
        //adds event listeners to buttons
        ch1ToCh1A.addEventListener('click', storySwitcher);
        ch1ToCh1B.addEventListener('click', storySwitcher);
        quit.addEventListener('click', storySwitcher);
    } else {
        console.log('User clicked: ' + event.target.id);
        // parse ID for destination
        var destination = event.target.id.slice(-4);
        // take user to destination & scroll to the top
        mainParagraphText.innerHTML = Story.Chapter1[destination];
        console.log(mainParagraphText.scrollTop);
        mainParagraphText.scrollTop = 0;
        //add new story segment and listeners
        var buttons = document.querySelectorAll('.btn');
        console.log(buttons);
        console.log(buttons.constructor);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', storySwitcher);
        }
    }
}
