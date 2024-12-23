
const ApiTest = async(req , res) => {
    try {
        const apiResponse = await fetch('https://bigquery-secure-v1-bq38efyc.ts.gateway.dev/bigquery-v1/getbigquerytest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'AIzaSyBfyQ-ct__5fH-yNDNMI9C6MHrvblKX69A',
            },
            body: JSON.stringify(req.body),
          });
          // console.log(apiResponse);
          const data = await apiResponse.json();
          console.log("Data" , data);
          res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {ApiTest};