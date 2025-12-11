const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Telegram Bot
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
let bot = null;

if (telegramToken) {
  bot = new TelegramBot(telegramToken, { polling: false });
}

// Store user data (in production, use a database)
const users = new Map();

// Store exercise submissions
const exerciseSubmissions = [];

// API Routes

// Login endpoint
app.post('/api/login', (req, res) => {
  const { name, surname, group } = req.body;
  const loginTime = new Date().toLocaleString();
  
  const user = {
    id: Date.now().toString(),
    name,
    surname,
    group,
    loginTime,
    lastActive: new Date()
  };
  
  users.set(user.id, user);
  
  // Send login notification to Telegram
  if (bot && telegramChatId) {
    const message = `🎓 New Login\n👤 Student: ${name} ${surname}\n🏫 Group: ${group}\n⏰ Time: ${loginTime}`;
    bot.sendMessage(telegramChatId, message);
  }
  
  res.json({ success: true, userId: user.id, user });
});

// Get book data
app.get('/api/books', (req, res) => {
  const books = [
    {
      id: 'thoughts-notions',
      title: 'Thoughts and Notions',
      description: 'Improve your reading skills with interesting articles',
      available: true,
      units: [
        { id: '1.1', title: 'The Zipper', unlocked: true },
        { id: '1.2', title: 'Coming Soon', unlocked: false },
        { id: '1.3', title: 'Coming Soon', unlocked: false },
        { id: '1.4', title: 'Coming Soon', unlocked: false }
      ]
    },
    {
      id: 'book2',
      title: 'Reading Explorer 1',
      description: 'Coming Soon',
      available: false
    },
    {
      id: 'book3',
      title: 'Grammar in Use',
      description: 'Coming Soon',
      available: false
    }
  ];
  res.json(books);
});

// Get unit content
app.get('/api/books/:bookId/units/:unitId', (req, res) => {
  const { bookId, unitId } = req.params;
  
  if (bookId === 'thoughts-notions' && unitId === '1.1') {
    const unitData = {
      id: '1.1',
      title: 'The Zipper',
      text: `The zipper is a wonderful invention. How did people ever live without zippers? They are very common, so we forget that they are wonderful. They are very strong, but they open and close very easily. They come in many colors and sizes.

In the 1890s, people in the United States wore high shoes with a long row of buttons. Clothes often had long rows of buttons, too. People wished that clothes were easier to put on and take off.

Whitcomb L. Judson, an engineer from the United States, invented the zipper in 1893. However, his zippers didn't stay closed very well. This was embarrassing, and people didn't buy many of them.

Then Dr. Gideon Sundback from Sweden solved this problem. His zipper stayed closed.

A zipper has three parts:
1. There are dozens of metal or plastic hooks (called teeth) in two rows.
2. These hooks are fastened to two strips of cloth. The cloth strips are flexible. They bend easily.
3. A fastener slides along and joins the hooks together. When it slides the other way, it takes the hooks apart.

Dr. Sundback put the hooks on strips of cloth. The cloth holds all the hooks in place. They don't come apart very easily. This solved the problem of the first zippers.`,
      
      vocabulary: [
        {
          word: "dozen",
          definition: "a group of twelve",
          translation: "o'n ikki",
          example: "I bought a dozen eggs."
        },
        {
          word: "fastened",
          definition: "joined or attached",
          translation: "biriktirilgan",
          example: "He fastened his seatbelt."
        },
        {
          word: "flexible",
          definition: "able to bend easily without breaking",
          translation: "egiluvchan",
          example: "The material is very flexible."
        },
        {
          word: "invention",
          definition: "something that has been made or designed for the first time",
          translation: "ixtiro",
          example: "The telephone was an important invention."
        },
        {
          word: "embarrassing",
          definition: "making you feel shy or ashamed",
          translation: "uyalishli",
          example: "It was an embarrassing mistake."
        }
      ],
      
      grammar: {
        theme: "Past Simple Tense",
        description: "We use the Past Simple tense to talk about completed actions in the past. Regular verbs add -ed, irregular verbs have different forms.",
        examples: [
          "Whitcomb L. Judson invented the zipper in 1893.",
          "People in the 1890s wore high shoes with buttons.",
          "They didn't buy many of them.",
          "Dr. Sundback solved this problem."
        ]
      },
      
      exercises: {
        definition: [
          {
            question: "What does 'dozen' mean?",
            options: ["12 items", "6 items", "24 items", "10 items"],
            correct: 0
          },
          {
            question: "What is the meaning of 'flexible'?",
            options: ["Very strong", "Easy to bend", "Very small", "Easy to break"],
            correct: 1
          }
        ],
        gapFilling: [
          {
            sentence: "Whitcomb L. Judson _____ the zipper in 1893.",
            options: ["invented", "invents", "inventing", "invent"],
            correct: 0
          },
          {
            sentence: "People _____ that clothes were easier to put on.",
            options: ["wished", "wish", "wishing", "wishes"],
            correct: 0
          }
        ],
        englishUzbek: [
          {
            word: "fastened",
            options: ["egiluvchan", "biriktirilgan", "ixtiro", "uyalishli"],
            correct: 1
          },
          {
            word: "embarrassing",
            options: ["ixtiro", "o'n ikki", "biriktirilgan", "uyalishli"],
            correct: 3
          }
        ],
        uzbekEnglish: [
          {
            word: "egiluvchan",
            options: ["fastened", "flexible", "invention", "dozen"],
            correct: 1
          },
          {
            word: "ixtiro",
            options: ["embarrassing", "invention", "fastened", "dozen"],
            correct: 1
          }
        ],
        grammar: [
          {
            question: "Which sentence is in Past Simple tense?",
            options: [
              "He is inventing something new.",
              "He invented the zipper.",
              "He will invent something.",
              "He invents things every day."
            ],
            correct: 1
          },
          {
            question: "Complete the sentence: They _____ many buttons on their clothes.",
            options: ["have", "had", "has", "having"],
            correct: 1
          }
        ]
      }
    };
    res.json(unitData);
  } else {
    res.status(404).json({ error: 'Unit not found' });
  }
});

// Submit exercise results
app.post('/api/submit-exercise', async (req, res) => {
  const { userId, unitId, exerciseType, score, total, answers } = req.body;
  
  const submission = {
    userId,
    unitId,
    exerciseType,
    score,
    total,
    answers,
    timestamp: new Date()
  };
  
  exerciseSubmissions.push(submission);
  
  // Send to Telegram
  if (bot && telegramChatId) {
    const user = users.get(userId);
    const percentage = ((score / total) * 100).toFixed(1);
    
    const message = `📚 Exercise Submitted
👤 Student: ${user?.name || 'Unknown'} ${user?.surname || ''}
📖 Unit: ${unitId}
🔤 Exercise: ${exerciseType}
📊 Score: ${score}/${total} (${percentage}%)
⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
      await bot.sendMessage(telegramChatId, message);
    } catch (error) {
      console.error('Telegram error:', error);
    }
  }
  
  res.json({ success: true, message: 'Exercise submitted successfully' });
});

// Get user progress
app.get('/api/user/:userId/progress', (req, res) => {
  const { userId } = req.params;
  const userExercises = exerciseSubmissions.filter(sub => sub.userId === userId);
  res.json({ submissions: userExercises });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
