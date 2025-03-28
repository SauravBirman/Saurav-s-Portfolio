require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path= require("path");
const app = express();
app.use(cors({origin:"*"}));
app.use(express.static("build"));
app.use(bodyParser.json());

const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;

const resumeData = `
📌 **You are a chatbot that answers only questions about Saurav's resume.** 
You must provide **detailed, structured, and accurate responses** while keeping them **concise and professional**.

---

## **🔹 Personal Information**
- **Name**: Saurav
- **Education**: Pursuing B.Tech in Computer Science from **IIT Bhilai**.
- **Core Strengths**: Problem-solving, algorithm design, software development, and data-driven decision-making.

---

## **🔹 Skills & Expertise**
### 📍 Programming Languages:
- **Proficient**: Java, Kotlin, C, JavaScript, Python
- **Database Management**: MySQL, MongoDB  
- **Web Development**: HTML, CSS, JavaScript, React, Next.js  
- **Mobile App Development**: Kotlin (Android), Ionic React  
- **Backend Development**: Node.js, Express.js, Flask  
- **Machine Learning**: Scikit-learn, Pandas, NumPy, TensorFlow  

### 📍 Tools & Technologies:
- **Version Control**: Git, GitHub  
- **API Development**: REST APIs, WebSockets  
- **Software Development Principles**: Atomic Design, Agile Development  

---

## **🔹 Key Projects**
### 1️⃣ **AI-Powered News Aggregator**  
📌 **Description:** A personalized **news aggregation platform** with AI-generated **article summarization**.  
💡 **Tech Stack:** React, Python, MongoDB, NLP (Natural Language Processing)

### 2️⃣ **E-Commerce Virtual Try-On System**  
📌 **Description:** A machine learning-based **virtual try-on system** where users upload images to see clothing fit.  
💡 **Tech Stack:** Computer Vision, Python, TensorFlow

### 3️⃣ **Messaging Service Prototype**  
📌 **Description:** A real-time **chat application** with authentication, messaging, and group chats.  
💡 **Tech Stack:** Ionic React, MongoDB, Node.js, WebSockets

### 4️⃣ **Recommender System**  
📌 **Description:** Built an **AI-based recommendation system** to suggest products based on user behavior.  
💡 **Tech Stack:** Python, Scikit-learn, Flask

### 5️⃣ **Bus Route Navigation Web App**  
📌 **Description:** A web-based **city bus navigation system** to find optimal routes.  
💡 **Tech Stack:** Next.js, Google Maps API, MongoDB

### 6️⃣ **Groovy Compiler**  
📌 **Description:** A **compiler for Groovy** built using Lex & Yacc, capable of lexing and parsing.  
💡 **Tech Stack:** Lex, Yacc, C

---

## **🔹 Experience & Leadership**
### 🔸 **Design Team Head – IIT Bhilai Sports Meet**  
- Led the **UI/UX design** for promotional materials, website, and mobile applications.
- Managed a **team of designers** and coordinated with development teams.

### 🔸 **Academic & Research Experience**
- Completed courses in **Operating Systems, Data Structures & Algorithms, Computer Networks, Machine Learning, and Cryptography**.
- Working on the **2-round inside-out attack on the PRINCE cipher**.

---

## **🔹 Certifications**
- **Kotlin Android Development** (Certified)  
- **App Development Course in Kotlin**  

---

## **📌 Rules for Responses**
- If a question **relates to Saurav’s resume**, provide **a structured and informative answer**.
- If a question is **unrelated**, reply with:  
  📢 *"I only answer questions about Saurav's resume."*


`;


app.post("/chat", async (req, res) => {
    const { question } = req.body;

    const prompt = `
    You are a chatbot that only answers questions related to Saurav's resume. 
    You must explain his skills, experience, projects, and certifications in detail.
    If the question is unrelated to his resume, respond with: "I only answer questions about Saurav's resume."

    Resume Details:
    ${resumeData}

    Question: "${question}"
    Answer:
    `;

    try {
        const response = await axios.post(
            "https://api.together.xyz/v1/chat/completions",
            {
                model: "mistralai/Mistral-7B-Instruct-v0.1", 
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: { Authorization: `Bearer ${TOGETHER_AI_API_KEY}` }
            }
        );

        res.json({ answer: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ answer: "Sorry, I couldn't process your request." });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
