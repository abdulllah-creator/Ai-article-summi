import { useState } from "react";

function History() {

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );


  const deleteHistory = (index) => {

    const updatedHistory = history.filter(
      (_, i) => i !== index
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "history",
      JSON.stringify(updatedHistory)
    );

  };


  return (

    <div className="container">

      <h1>
        📜 Summary History
      </h1>


      {
        history.length === 0 ?

        <p>
          No summaries yet.
        </p>


        :

        history.map((item,index)=>(

          <div
            key={index}
            className="history-card"
            style={{
              background:"#f5f5f5",
              padding:"20px",
              margin:"20px 0",
              borderRadius:"10px"
            }}
          >

            <h3>
              {item.date}
            </h3>


            <h4>
              Article:
            </h4>

            <p>
              {item.article
              ? item.article.substring(0,200)
              : "URL Article"}
            </p>



            <h4>
              Summary:
            </h4>

            <p>
              {item.summary}
            </p>



            <button
              onClick={() => deleteHistory(index)}
            >
              🗑 Delete
            </button>


          </div>


        ))

      }


    </div>

  );

}


export default History;