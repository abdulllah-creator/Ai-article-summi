const express = require("express");
const cors = require("cors");
require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const { HfInference } = require("@huggingface/inference");
const { franc } = require("franc");


const app = express();


app.use(cors());
app.use(express.json());


const hf = new HfInference(process.env.HF_TOKEN);



app.post("/summarize", async (req, res) => {

  console.log("SUMMARIZE REQUEST RECEIVED");


  try {


    const { article, url, length } = req.body;



    if (!article && !url) {

      return res.status(400).json({

        error:
        "Please provide article or URL"

      });

    }



    let text = article;



    // Get article from URL

    if (url) {


      console.log("Fetching URL...");


      const webpage = await axios.get(url, {

        headers: {

          "User-Agent":
          "Mozilla/5.0"

        }

      });



      const $ = cheerio.load(webpage.data);



      $("script,style,nav,footer,header,aside").remove();



      text = $("article p")
        .map((i,el)=>$(el).text())
        .get()
        .join(" ");



      if(text.length < 300){

        text = $("p")
          .map((i,el)=>$(el).text())
          .get()
          .filter(p=>p.length > 50)
          .join(" ");

      }


    }





    if(!text || text.length < 100){

      return res.status(400).json({

        error:
        "Not enough article content"

      });

    }



    console.log(
      "Detected language:",
      franc(text)
    );



    // Give model enough context

    text = text.substring(0,4000);



    let instruction = "short";



    if(length==="long"){

      instruction =
      "detailed";

    }

    else if(length==="medium"){

      instruction =
      "medium";

    }





    console.log(
      "Sending article to AI..."
    );



    const result = await hf.textGeneration({

      model:
      "google/flan-t5-large",


      inputs:

`You are an expert news summarizer.

Summarize the following article in ${instruction} length.

Rules:
- Keep only important facts.
- Keep names, dates and locations correct.
- Do not add information.
- Write the summary in the same language as the article.

Article:

${text}

Summary:`,



      parameters: {

        max_new_tokens: 200,

        temperature: 0.1,

        return_full_text:false

      }


    });




    console.log(
      "AI RESULT:"
    );

    console.log(result);



    res.json({

      summary:
      result.generated_text

    });



  }


  catch(error){


    console.log("ERROR:");

    console.log(
      error.response?.data ||
      error.message ||
      error
    );


    res.status(500).json({

      error:
      "Unable to summarize"

    });


  }


});





app.listen(5000,()=>{

  console.log(
    "Server running on port 5000"
  );

});