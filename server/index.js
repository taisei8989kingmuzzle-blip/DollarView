import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

if (!process.env.GROQ_API_KEY) {
    console.error("Error: GROQ_API_KEY not set in Environmental variables.");
    process.exit(1);
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.get('/', (req, res) => {
    res.send('<h1>Hello user</h1><p>This is the server.</p>');
});

app.post('/analyze-receipt', async (req, res) => {
    console.log("new groq API post")
    try{
        const { image, mimeType} = req.body;

        const completion = await groq.chat.completions.create({
            model: "qwen/qwen3.8-27b",
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract the merchant, date of transaction, total amount of money spent, and expense category (Either Food, Housing, Transport, or Shopping) from this test receipt. Return the information as Json in the format: {merchant: string, date_of_transaction: string, expense_category: string, total_amount_spent: double}."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${image}`
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object"}
        });

        res.json(JSON.parse(completion.choices[0].message.content));

    } catch(error) {
        console.error(error);
        res.status(500).json({error: "AI analysis failed"});
    }
});

// app.post('/generate-comment', async(req, res) => {
//     console.log('request on comment generation')
//     try {
//         const { transaction} = req.body;

//         const commentCompletion = await groq.chat.completion.create({
//             model: 'qwen/qwen3.8-27b',
//             max_tokens= 300,
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         type: text
//                     ]
//                 }
//             ]
//         })
//     } catch {

//     }
// })

app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
})