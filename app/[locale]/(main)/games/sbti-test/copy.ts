type DimensionLevel = 'L' | 'M' | 'H';

type QuestionCopy = {
    text: string;
    options: string[];
};

type TypeCopy = {
    name: string;
    intro: string;
    desc: string;
};

export const EN_QUESTION_COPY: Record<string, QuestionCopy> = {
    q1: {
        text: "I am not just a loser, I am a joker, a washed-up extra, a person who has never even had a relationship. Timid, insecure, spending my youth on endless fantasies about someday having someone to walk around with, shop with, and hang out with. In reality I burned my parents' money, went to a bad school, drifted into a dead-end life, and became a three-nothing citizen with no ideals, no goals, and no ability. Every time I see people making fun of losers online, I want to cry. I feel like a rat underground, peeking through the sewer gap at all the good things happening above. Please leave a little breathing room for clowns like me. I really do not want to soak my pillow in tears again.",
        options: ["I am crying...", "What even is this...", "This is not me!"],
    },
    q2: {
        text: "I am not good enough. The people around me are all better than me.",
        options: ["True", "Sometimes", "Not really"],
    },
    q3: {
        text: "I know very clearly what my real self is like.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q4: {
        text: "There is something I truly want deep down.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q5: {
        text: "I have to keep climbing upward and becoming stronger.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q6: {
        text: "Other people's opinions basically mean nothing to me.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q7: {
        text: "Your partner has not replied for over five hours and says they had diarrhea. What do you think?",
        options: [
            "No way diarrhea takes five hours. Maybe they are hiding something.",
            "I would swing between trust and suspicion.",
            "Maybe they really do feel awful today.",
        ],
    },
    q8: {
        text: "In relationships, I often worry that the other person will leave me.",
        options: ["Yes", "Sometimes", "No"],
    },
    q9: {
        text: "I swear to heaven that I treat every relationship seriously.",
        options: ["Not really", "Maybe?", "Yes, and my conscience is clear"],
    },
    q10: {
        text: "Your partner is absurdly perfect: kind, clean-cut, noble, eloquent, wise, talented, charming, and gorgeous. What happens to you?",
        options: [
            "Even if they are amazing, I would not fall too deep.",
            "Probably somewhere between A and C.",
            "I would treasure them a lot and might turn into a lovesick idiot.",
        ],
    },
    q11: {
        text: "After getting into a relationship, your partner becomes very clingy. How do you feel?",
        options: ["That sounds great", "Either way is fine", "I would rather keep some independence"],
    },
    q12: {
        text: "In any relationship, personal space matters a lot to me.",
        options: ["I prefer dependence and being depended on", "It depends", "Yes, absolutely"],
    },
    q13: {
        text: "Most people are good.",
        options: [
            "Honestly, evil hearts outnumber hemorrhoids in this world.",
            "Maybe.",
            "Yes, I want to believe there are more good people.",
        ],
    },
    q14: {
        text: "You are walking down the street when an unbelievably cute little girl walks up to you and hands you a lollipop. What is your first reaction?",
        options: [
            "Aww, she is adorable. She gave me candy!",
            "I would just stare in confusion and scratch my head.",
            "Is this some new type of scam? Better leave.",
        ],
    },
    q15: {
        text: "It is almost exam time. School says you must attend evening study hall and skipping costs points, but tonight you made plans to play PUBG Mobile with your crush. What do you do?",
        options: ["Skip it. It is only once.", "Maybe just ask for leave.", "Exams are close. Forget the game."],
    },
    q16: {
        text: "I like breaking routine and hate being restrained.",
        options: ["Agree", "Neutral", "Disagree"],
    },
    q17: {
        text: "I usually do things with a goal in mind.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q18: {
        text: "One day I suddenly realize that life has no grand meaning at all. Humans are just animals controlled by desire and hormones: hungry, eat; tired, sleep; horny, mate. We are not that different from pigs and dogs.",
        options: ["That is true.", "Maybe yes, maybe no.", "That is complete nonsense."],
    },
    q19: {
        text: "I mainly do things for results and progress, not just to avoid trouble and risk.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q20: {
        text: "You are constipated and have been sitting on the toilet for thirty minutes. Nothing is happening. Which of these are you most like?",
        options: [
            "Sit for another thirty minutes and hope something changes.",
            "Slap my own butt and yell, 'Come on, useless butt!'",
            "Use a laxative and get the job done fast.",
        ],
    },
    q21: {
        text: "I make decisions fairly quickly and do not like dragging things out.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    q22: {
        text: "This question has no prompt. Choose blindly.",
        options: ["After overthinking it, maybe A?", "Uh... maybe B?", "No clue, so maybe C?"],
    },
    q23: {
        text: "When people say you have 'strong execution,' which inner reaction feels closest?",
        options: [
            "When I am cornered by a deadline, my execution is terrifying.",
            "Eh, sometimes.",
            "Yes. Things are supposed to get done.",
        ],
    },
    q24: {
        text: "I usually make plans, ____",
        options: [
            "but plans never survive reality.",
            "and sometimes I finish them, sometimes I do not.",
            "and I hate it when plans get disrupted.",
        ],
    },
    q25: {
        text: "You meet a bunch of online friends through a game and they invite you to meet offline. What are you thinking?",
        options: [
            "Talking online is one thing. Meeting for real still feels a little scary.",
            "Meeting online friends sounds fine. If they talk to me, I will chat back.",
            "I would dress up and chat enthusiastically. You never know, right?",
        ],
    },
    q26: {
        text: "A friend brings their friend along to hang out. What are you most likely to be like?",
        options: [
            "I naturally keep some distance from 'a friend's friend' and worry it might affect our bond.",
            "Depends on them. If the vibe works, it works.",
            "A friend's friend counts as my friend too. Time to chat.",
        ],
    },
    q27: {
        text: "When I deal with people, I basically run on an electric fence. If someone gets too close, the alarm goes off.",
        options: ["Agree", "Neutral", "Disagree"],
    },
    q28: {
        text: "I crave being very close to people I trust, like we are long-lost relatives reunited.",
        options: ["Agree", "Neutral", "Disagree"],
    },
    q29: {
        text: "Sometimes you clearly have a different and negative opinion about something, but you keep quiet. In most cases, why?",
        options: [
            "That does not happen very often.",
            "Probably because of politeness or the relationship.",
            "I do not want other people to know how dark I really am.",
        ],
    },
    q30: {
        text: "I show different versions of myself in front of different people.",
        options: ["Disagree", "Neutral", "Agree"],
    },
    drink_gate_q1: {
        text: "What is one of your regular hobbies?",
        options: ["Basic survival stuff", "Arts and culture", "Drinking", "Working out"],
    },
    drink_gate_q2: {
        text: "What is your attitude toward alcohol?",
        options: [
            "A little is nice, but I cannot drink that much.",
            "I could pour baijiu into a thermos and drink it like water. Alcohol has my respect.",
        ],
    },
};

export const EN_TYPE_COPY: Record<string, TypeCopy> = {
    CTRL: {
        name: "Controller",
        intro: "See? I have got you handled.",
        desc: "You are a walking task manager with legs. Rules are just factory settings, plans are doodles, and chaos is something you quietly save, rename, and fix before other people even realize it broke. A CTRL friend feels like getting a hard backup for your life: right before the train leaves the tracks, they hit Ctrl+S on the disaster and drag it back with cold, irresistible logic. Other people call this 'being intense.' You call it basic maintenance.",
    },
    "ATM-er": {
        name: "Human ATM",
        intro: "Do I look rich to you?",
        desc: "ATM-er does not always pay with money. More often, you pay with time, patience, attention, and one more peaceful night you probably deserved. People insert their anxiety and inconvenience, and what comes back out is a sturdy little receipt that says, 'It is fine, I have got it.' You are reliable in that old, overworked-machine way: slightly tired, still standing, still covering the bill. Deep down, though, you sometimes stare at the emotional invoice and sigh at your own overdeveloped sense of responsibility.",
    },
    "Dior-s": {
        name: "Cynic Slacker",
        intro: "Just wait for my loser comeback arc.",
        desc: "You are not simply unambitious. You are someone who already saw through the productivity circus and decided the grand prize looked suspiciously like a nicer prison cell. Dior-s carries a weird kind of street wisdom: while everyone else is sprinting after trends and getting flattened by the zeitgeist, you are sunbathing in your own metaphorical barrel, perfectly at peace. Your philosophy is brutally practical. One, lying down is more comfortable than standing. Two, when it is time to eat, you eat.",
    },
    BOSS: {
        name: "Boss",
        intro: "Give me the wheel. I will drive.",
        desc: "Even with the fuel light blinking and the navigation app lying through its teeth, you are the one who says, 'I will drive,' and somehow gets everyone there anyway. BOSS runs on an upward law of nature: efficiency is a religion, order is oxygen, and self-improvement is treated like a normal Tuesday. Other people think you have 'leadership presence.' In truth, you are the source of the atmosphere itself. Within five meters of you, the air gets more serious and the to-do list starts trembling.",
    },
    "THAN-K": {
        name: "Thanker",
        intro: "I thank the heavens. I thank the earth.",
        desc: "You have weaponized gratitude into a full governing philosophy. Traffic jam? Wonderful, more time to listen to music and observe the twisted faces of the stressed masses. Mold on the wall? Maybe a secret Van Gogh. THAN-K moves through life like a portable positive-energy reactor, determined to squeeze a blessing out of every inconvenience. Some people find that absurd. Others find it deeply soothing.",
    },
    "OH-NO": {
        name: "Oh-No Person",
        intro: "Oh no. How did I get this type?",
        desc: "Where normal people see a cup near the edge of a table, you see an epic timeline: spill, short circuit, fire, evacuation, financial loss, butterfly effect, apocalypse. Then, with one soul-deep 'oh no,' you calmly move the cup to the center and maybe add a coaster for good measure. Your caution is not simple fear. It is catastrophic intelligence applied in real time. You are the patron saint of prevented disasters.",
    },
    GOGO: {
        name: "Go-Goer",
        intro: "Go go go. We are leaving.",
        desc: "You live in the purest form of 'what you see is what you get.' If you close your eyes, it is dark. If you spend all your money, you have no money left. If you stand on the crosswalk, you are now a pedestrian. The logic loop is stupidly elegant and somehow impossible to argue with. While everybody else debates problems, you clear tasks. In your world there are only two states: done, and about to be done by me.",
    },
    SEXY: {
        name: "Bombshell",
        intro: "You were born to be the main event.",
        desc: "When you walk into a room, the lighting seems to dim itself out of professional respect. A smile from you has enough force to reorganize the humidity in the air. People notice you whether they mean to or not. You do not always have to speak loudly or perform dramatically. Sometimes simply existing in frame is already a full production.",
    },
    "LOVE-R": {
        name: "Lover",
        intro: "My love is too full and reality feels understocked.",
        desc: "You are a doomed romantic bard who somehow survived into the age of group chats and dead battery notifications. Your emotional processor is not binary. It is rainbow-powered. A falling leaf is never just 'autumn'; it is a thirteen-act epic about sacrifice, longing, and the unbearable beauty of being alive. Your inner world is an amusement park that never closes, and you keep waiting for someone who can read the map and ride the carousel with you to the end of the universe.",
    },
    MUM: {
        name: "Mom Friend",
        intro: "Could I... maybe call you mom?",
        desc: "The emotional base layer here is softness. You sense moods quickly, know when to stop, and often know exactly what someone needs to hear to feel steadier. You heal other people the way a good doctor stabilizes a patient. The problem is that when you are the one hurting, the medicine you give yourself is always a size smaller. Your care for others is abundant; your care for yourself gets discounted too often.",
    },
    FAKE: {
        name: "Fake Human",
        intro: "There are no real humans left.",
        desc: "In social settings you can switch masks faster than most people switch keyboards. One second you are intimate and heartfelt, the next second the boss walks in and suddenly you are composed, capable, and professionally lit. People may think they met the real you. Maybe they just met the best-performing version for that room. Late at night, when all the masks come off, you sometimes wonder whether the masks were the self all along.",
    },
    OJBK: {
        name: "Whatever Person",
        intro: "When I say 'anything is fine,' I mean it.",
        desc: "This is not indecision. This is imperial detachment. While ordinary mortals burn calories deciding between rice and noodles, you wave a hand and say, 'Either works.' You are not empty. You are simply unconvinced that many everyday choices deserve a full constitutional debate. Some people call that passive. You call it refusing to waste divine energy on dust-level matters.",
    },
    MALO: {
        name: "Monkey",
        intro: "Life is a dungeon run and I am just a little monkey in it.",
        desc: "You are not 'still childlike.' Evolution just never fully got its paperwork approved. Your soul still wants to swing from branches, light up at bananas, and treat civilization like a suspicious pay-to-win game with terrible mechanics. Rules are flexible, ceilings look climbable, and conference rooms feel underused if nobody attempts a backflip. MALO is basically a giant open door between reality and chaos.",
    },
    "JOKE-R": {
        name: "Clown",
        intro: "Turns out we are all clowns.",
        desc: "You are less a person than a stack of jokes wearing a trench coat. Peel away one layer and there is a punchline. Peel away another and there is a bit. Keep going and eventually all that remains is a faint echo saying, 'Haha, got you.' You are the designated atmosphere warmer in every room. People laugh hardest when you are there, and often the loudest laugh in the room is yours, carefully covering a crack in the floor beneath it.",
    },
    "WOC!": {
        name: "Holy-Crap Person",
        intro: "Holy crap, how did I get this type?",
        desc: "You operate with two systems running at once. The front-end system shouts 'what the hell,' 'no way,' and 'are you serious?' The background system coolly logs, 'Yes, this checks out.' You are not especially eager to interfere in other people's nonsense, because explaining reason to idiots feels like trying to plaster a wall with mud: exhausting and deeply unsanitary. So instead you hold your sacred handful of grass and offer the world one dignified, emotionally loaded 'WOC.'",
    },
    "THIN-K": {
        name: "Thinker",
        intro: "Thinking deeply for 100 seconds and counting.",
        desc: "Your brain does not idle. It audits. Claims, evidence, hidden assumptions, logical gaps, bias, context, and the family history of the author if necessary. In an era of information sludge, you do not submit easily to a loud opinion. You weigh tradeoffs, defend your space, and sort reality into labeled folders while everyone else thinks you are just staring blankly into the void. That is not zoning out. That is the archive running.",
    },
    SHIT: {
        name: "World-Hater",
        intro: "This world is one giant pile of garbage.",
        desc: "The funny thing about SHIT is that the complaining is real, but so is the competence. Mouth: 'This project is trash.' Hands: already opening the spreadsheet and building the model. Mouth: 'These coworkers are useless.' Hands: quietly staying up late to fix what everyone else wrecked. You curse the world like a prophet of collapse while behaving like the unpaid emergency response team keeping it alive. That is not hypocrisy. That is your sacred ritual.",
    },
    ZZZZ: {
        name: "Possum Mode",
        intro: "I am not dead. I am just sleeping.",
        desc: "You can ignore ninety-nine unread messages with almost religious calm, yet the moment someone says, 'Everyone, there are thirty minutes left,' you reanimate like an ancient creature rising from a tomb. Deadline is the one supreme command your nervous system still obeys. Before that, you conserve energy through strategic nonexistence. After that, you become frighteningly efficient. You are proof that doing nothing is, in fact, a skill tree.",
    },
    POOR: {
        name: "Laser Focus",
        intro: "I am broke, but my concentration is rich.",
        desc: "This kind of poverty is not about your bank balance. It is about ruthless resource allocation. Other people scatter their attention like QR codes in every direction; you compress yours into a laser beam that burns holes through whatever matters most. Noise gets downgraded. Vanity gets muted. Social performance gets denied funding. What looks like scarcity from the outside is actually a mining operation on one chosen target.",
    },
    MONK: {
        name: "Monk",
        intro: "I have no such worldly desires.",
        desc: "While others go to karaoke to tangle themselves in love and hate, you would rather stay home and contemplate something larger. Your personal space is not just space. It is a sacred barrier, a mountain, an entire protected realm. People who intrude can feel the spiritual suffocation immediately. It is not that you hate connection. You just think planets stay beautiful by not crashing into each other.",
    },
    IMSB: {
        name: "Chaos Dummy",
        intro: "Seriously? Am I really that stupid?",
        desc: "Inside your skull live two immortal warriors locked in endless battle. One screams, 'Go for it, idiot, ask for the number, confess, jump!' The other hisses, 'And why would they ever like you back, clown?' The result is usually a cinematic amount of inner drama followed by absolutely no movement. IMSB is not truly dumb. The problem is that your internal multiverse has a runtime longer than the entire Marvel franchise.",
    },
    SOLO: {
        name: "Hedgehog",
        intro: "I am crying. How did I become this lonely?",
        desc: "Your sense of self-worth can run fragile, so distance often becomes your emergency architecture. Around the soul you have built a wall labeled 'do not touch me,' brick by brick, each one made from an older wound. Like a hedgehog, you hide the soft parts and point the spikes outward. The spikes are not pure attack. They are unsent messages that say, 'Do not come closer, I am scared you will get hurt too,' and 'Please do not leave.'",
    },
    FUCK: {
        name: "Wild Weed",
        intro: "What the hell is this type?",
        desc: "Civilized society has accidentally produced a human-shaped weed that cannot be killed by any herbicide, and that is you. Rules look flimsy, emotions flip like a physical switch between 'FUCK YEAH' and 'FUCK OFF,' and your craving is not just for pleasure but for raw vitality. When everyone else has been trained into polite domestic birds, you are the last wolf howl at the edge of the city. Messy, loud, alive.",
    },
    DEAD: {
        name: "Dead One",
        intro: "Am I... still alive?",
        desc: "The official expansion of this type may as well be 'Don't Expect Any Drives.' You have already stared at enough fake philosophy and motivational theater to lose interest in most of the game entirely. The way you look at the world resembles a player who finished every main quest, every side quest, every hidden quest, then reset the file nine hundred times and concluded the gameplay was never that good. Desire is low. Ambition is low. Quiet protest is high.",
    },
    IMFW: {
        name: "Soft Trash",
        intro: "Am I really... useless?",
        desc: "This is not ordinary incompetence. This is a very rare and highly sensitive life-form with shaky self-esteem and a suspiciously strong internal Wi-Fi detector for the most dependable person in the room. Living as IMFW is like being a greenhouse orchid: temperature, humidity, and scheduled verbal photosynthesis all matter. Give this type a little candy and they may hand you their whole shining trust in return. Maybe you are not trash. Maybe you are just too undefended and too sincere.",
    },
    HHHH: {
        name: "Laughing Fool",
        intro: "Hahahahahahaha.",
        desc: "Your brain wiring was so eccentric that the standard type library simply gave up and crashed. This fallback only appears when your best match is under sixty percent, which is the system's way of saying, 'We genuinely do not know what creature you are.' What are the traits of HHHH? Hahahahahaha. Sorry, that is the entire trait list. Check the fifteen dimensions and let common sense do the rest.",
    },
    DRUNK: {
        name: "Drunkard",
        intro: "Liquor burns the throat, but I must be drunk.",
        desc: "Why are you wobbling? Why are your emotions on fire? Why does everything have a double image? Because what runs through your body is apparently premium baijiu instead of blood. Alcohol turns you into a dinner-table philosopher, a bathroom confessional poet, and the flaming center of the late-night universe. Then the next morning arrives like a cracked walnut to the face and you realize last night's prophet has evolved into a certified drunkard.",
    },
};

export const EN_DIMENSION_NAMES: Record<string, string> = {
    S1: "S1 Self-esteem",
    S2: "S2 Self-clarity",
    S3: "S3 Core values",
    E1: "E1 Attachment security",
    E2: "E2 Emotional investment",
    E3: "E3 Boundaries and dependence",
    A1: "A1 Worldview tendency",
    A2: "A2 Rules and flexibility",
    A3: "A3 Sense of meaning",
    Ac1: "Ac1 Motivation direction",
    Ac2: "Ac2 Decision style",
    Ac3: "Ac3 Execution mode",
    So1: "So1 Social initiative",
    So2: "So2 Interpersonal boundaries",
    So3: "So3 Expression and authenticity",
};

export const EN_DIMENSION_EXPLANATIONS: Record<string, Record<DimensionLevel, string>> = {
    S1: {
        L: "You judge yourself harder than other people do, and even compliments need to pass inspection first.",
        M: "Your confidence changes with the weather. Tailwind and you fly. Headwind and you shrink.",
        H: "You mostly know your own worth and do not get scattered by one random comment.",
    },
    S2: {
        L: "Your inner channel has a lot of static. 'Who am I?' keeps buffering.",
        M: "You can usually recognize yourself, though strong emotions sometimes hijack the account.",
        H: "You are fairly clear on your temperament, desires, and bottom lines.",
    },
    S3: {
        L: "Comfort and safety tend to matter more. Life does not need to run in sprint mode every day.",
        M: "You want to improve, but you also want a nap. Your values hold frequent internal meetings.",
        H: "Goals, growth, or a strong belief can push you forward pretty easily.",
    },
    E1: {
        L: "Your relationship alarm system is sensitive enough to build an entire finale from one unread message.",
        M: "Half trust, half testing. Emotional tug-of-war is common.",
        H: "You are more willing to trust the bond itself and less likely to panic over every gust of wind.",
    },
    E2: {
        L: "You invest carefully. The heart is not closed, but the security gate is strict.",
        M: "You can commit, but you still keep a backup exit in mind.",
        H: "Once you decide someone matters, you tend to go in seriously with full emotion and energy.",
    },
    E3: {
        L: "You can be clingy and easy to cling to. Warmth matters a lot.",
        M: "You want some intimacy and some independence. Adjustable dependence mode.",
        H: "Space matters. Even in love, you still need a piece of land that is entirely yours.",
    },
    A1: {
        L: "You view the world through a defensive filter. Suspicion comes first, closeness later.",
        M: "Not naive, not fully conspiratorial either. Watching first is your instinct.",
        H: "You are more willing to believe in human decency and less eager to sentence the world to death.",
    },
    A2: {
        L: "If rules can be bent, you would rather bend them. Comfort and freedom rank high.",
        M: "You can follow the rules when needed and improvise when needed.",
        H: "You have a stronger sense of order and generally prefer not to improvise explosions into the schedule.",
    },
    A3: {
        L: "Meaning feels thin. A lot of life can seem like going through the motions.",
        M: "Sometimes you have a goal, sometimes you want to rot. Your worldview is half-booted.",
        H: "You act with more direction and usually know which way you want to move.",
    },
    Ac1: {
        L: "Your anti-disaster system boots faster than your ambition.",
        M: "Sometimes you want to win, sometimes you just want less trouble. Mixed motives.",
        H: "Results, growth, and forward motion light you up more easily.",
    },
    Ac2: {
        L: "You tend to circle decisions a few extra times. Internal meetings often overrun.",
        M: "You think, but not to the point of system failure. Normal hesitation.",
        H: "You decide quickly and do not enjoy circling back to fuss over it.",
    },
    Ac3: {
        L: "Your execution has a deep emotional bond with deadlines. The later it gets, the more awakened you become.",
        M: "You can do the thing, but your state depends on timing. Sometimes stable, sometimes floppy.",
        H: "You strongly want things to land. Unfinished tasks feel like a thorn in the brain.",
    },
    So1: {
        L: "Your social engine warms up slowly. Starting first usually takes a while.",
        M: "If someone comes to you, you respond. If nobody comes, you do not force it.",
        H: "You are more willing to open the room yourself and less afraid of showing up in a crowd.",
    },
    So2: {
        L: "You often want more closeness and fusion in relationships. Once someone is in, they are really in.",
        M: "You want closeness and breathing room at the same time. Boundaries shift by person.",
        H: "Your boundary system is stronger. If someone gets too close, you instinctively step back first.",
    },
    So3: {
        L: "You are more direct. If something is on your mind, you usually do not twist around it much.",
        M: "You read the room. Authenticity and tact both get a share of the budget.",
        H: "You are better at switching selves for different settings. Authenticity gets distributed in layers.",
    },
};
