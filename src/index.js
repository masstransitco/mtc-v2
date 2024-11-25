<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SumSub Backend</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
        }
        code {
            background: #f4f4f4;
            padding: 4px 8px;
            border-radius: 4px;
            color: #d63384;
        }
    </style>
</head>
<body>
    <h1>Welcome to the SumSub Backend</h1>
    <p>This is a backend service to generate SumSub access tokens.</p>
    <p>
        To use the API, send a <strong>POST</strong> request to:
        <br>
        <code>/api/generate-sumsub-token</code>
    </p>
    <p>Ensure your request includes a valid <code>userId</code> in the JSON body.</p>
    <p>Example:</p>
    <pre><code>{
  "userId": "123"
}</code></pre>
    <p>Happy coding!</p>
</body>
</html>
