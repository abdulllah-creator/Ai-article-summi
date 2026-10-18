import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function App() {

  const [article, setArticle] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();


  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };


  const handleSummarize = async () => {

    if (!article.trim() && !url.trim()) {
      setSummary("Please enter an article or URL.");
      return;
    }


    try {

      setLoading(true);
      setSummary("");


      const response = await fetch(
        "http://localhost:5000/summarize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            article: article,
            url: url,
            length: length,
          }),
        }
      );


      const data = await response.json();


      if (data.summary) {

        setSummary(data.summary);


        // Save summary history

        const oldHistory =
          JSON.parse(localStorage.getItem("history")) || [];


        const newHistory = [
          {
            article: article,
            url: url,
            summary: data.summary,
            date: new Date().toLocaleString(),
          },
          ...oldHistory,
        ];


        localStorage.setItem(
          "history",
          JSON.stringify(newHistory)
        );


      } 
      else {

        setSummary("Unable to generate summary.");

      }


    } 
    catch(error) {

      console.log(error);

      setSummary(
        "Something went wrong. Check backend."
      );

    } 
    finally {

      setLoading(false);

    }

  };



  const copySummary = () => {

    navigator.clipboard.writeText(summary);

    alert("Summary copied!");

  };



  return (

    <div className={darkMode ? "app dark" : "app"}>


      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          background: "#0adddd",
          color: "white",
        }}
      >

        <h2>
          AI SUMMARIZER
        </h2>



        <div>

          <Link
            to="/"
            style={{
              color: "white",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Home
          </Link>



          <Link
            to="/history"
            style={{
              color: "white",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            History
          </Link>



          <button onClick={logout}>
            Logout
          </button>


        </div>


      </nav>





      <div className="container">


        <div className="header">


          <h1>
            ✨ AI Article Summarizer
          </h1>


          <p>
            Summarize articles instantly using Artificial Intelligence
          </p>



          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >

            {
              darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"
            }

          </button>


        </div>





        <div className="input-card">


          <input
            type="text"
            placeholder="🔗 Paste article URL here"
            value={url}
            onChange={(e)=>setUrl(e.target.value)}
          />



          <select
            value={length}
            onChange={(e)=>setLength(e.target.value)}
          >

            <option value="short">
              ⚡ Short Summary
            </option>


            <option value="medium">
              📄 Medium Summary
            </option>


            <option value="long">
              📚 Detailed Summary
            </option>


          </select>





          <textarea

            placeholder="📝 Paste article text here"

            value={article}

            onChange={(e)=>setArticle(e.target.value)}

          />





          <button

            className="summarize-btn"

            onClick={handleSummarize}

          >

            {
              loading
              ? "✨ Generating..."
              : "🚀 Summarize"
            }

          </button>


        </div>






        <div className="summary-box">


          <h2>
            🧠 AI Summary
          </h2>



          {
            loading ?

            <p>
              Generating summary...
            </p>


            :

            <>

            <p>
              {
                summary ||
                "Your summary will appear here..."
              }
            </p>



            {
              summary &&

              <button
                className="copy-btn"
                onClick={copySummary}
              >
                📋 Copy Summary
              </button>

            }


            </>

          }


        </div>



      </div>


    </div>

  );

}


export default App;