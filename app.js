const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const cors          = require('cors');
const shortUrl      = require('./models/shortUrl');

app.set('view engine', 'ejs');


mongoose.connect(process.env.DATABASEURL);
//mongoose.connect('mongodb://ivilinchuk:igorito@ds153400.mlab.com:53400/url_shortener_microservice');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));


//INDEX Route
app.get('/', (req, res)=>{
    
    res.render('index');
});

//NEW Route
app.get('/new', (req, res)=>{
   res.render('index'); 
});
//CREATE Route
app.post('/new', function(req,res){
    
    res.redirect('/new/'+req.body.originalUrl);
});

app.get('/new/:urlToShorten(*)', (req, res)=>{
    
   
    var urlToShorten = req.params.urlToShorten;
    //console.log(urlToShorten);
    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if(regex.test(urlToShorten)===true){
       var short = Math.floor(Math.random()*100000).toString();
       
       var data = new shortUrl(
            {
                originalUrl: urlToShorten,
                shorterUrl: short
            }   
        );
        data.save(err=>{
            if(err){
                console.log('Can not save data');
            }
        });
       return res.json(data);
       
    }
    else{
            data = new shortUrl({
            originalUrl: urlToShorten,
            shorterUrl: 'Invalid origial URL'
        });
       return res.json(data);
    }
});

//Query DB and forward to original url
app.get('/:urlToForward', (req, res)=>{
    var shorterUrl = req.params.urlToForward;
    shortUrl.findOne({'shorterUrl': shorterUrl}, function(err, data){
        
        if(err){
            return res.send('ERROR reading DB');
        }
        else if(data === null){
            res.send('DB entry has not been found...');
        }
        else
        {
            var re = new RegExp("^(http|https)://", "i");
            var strToCheck = data.originalUrl;
            if(re.test(strToCheck)){
                res.redirect(301, strToCheck);
            }
            else{
                res.redirect(301, 'http://' + strToCheck);
            }
        }
    });
});


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Listening to PORT: ' + process.env.PORT);
});