const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');

const path = 'storage/';

// Setup and Parse Json
app.use(express.json({
    check: (req, res, buf) => 
	{
        try 
		{
            JSON.parse(buf);
        } 
		catch (e) 
		{
            res.status(500).send(e);
        }
    }
}));
app.use(bodyParser.json());

// POST
app.post('/api/jsonBlob', (req, res) => 
{
    let name = uuid.v4();
    fs.writeFile(path + name + '.json', JSON.stringify(req.body), (e) =>
	{
        if (e)
            res.status(404).send(e);
        else
        {
            res.location('http://localhost:' + port + '/api/jsonBlob/' + name);
            res.status(201).send();
        }        
    });
});

// GET
app.get('/api/jsonBlob/:id', (req, res) => 
{
    let file = path + req.params.id + '.json';
    fs.access(file, fs.constants.F_OK, (e) => 
    {
        if(e) 
        {
            res.status(404).send(e);
            return;
        } 
        else 
            res.status(200).send(fs.readFileSync(file));
    });
});

// PUT
app.put('/api/jsonBlob/:id', (req, res) => 
{
    let file = path + req.params.id + '.json';
    fs.access(file, fs.constants.F_OK, (e) => 
    {
        if(e)
            res.status(404).send(e);
        else 
        {
            fs.writeFile(file, JSON.stringify(req.body), (e) => 
            {
                if (e)
                    resp.status(500).send(e);
                else 
                {
                    fs.access(file, fs.constants.F_OK, (e) => 
                    {
                        if(e) 
                        {
                            res.status(406).send(e);
                            return;
                        } 
                        else 
                            res.status(200).send(fs.readFileSync(file));
                    });          
                }
            });
        }
    });
});

// DELETE
app.delete('/api/jsonBlob/:id', (req, res) => 
{
    let file = path + req.params.id + '.json';
    fs.access(file, fs.constants.F_OK, (e) => 
    {
        if(e) 
        {
            res.status(404).send(e);
            return;
        } 
        else 
            res.status(200).send(fs.unlinkSync(file));
    });
});

// Listen to port
app.listen(port, () => 
{
    console.log('Listening on port: ${port}');
});
