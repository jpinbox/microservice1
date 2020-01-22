const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./config/DB');
    const passport = require('passport');
    const helmet = require('helmet');
    const userroutes = require('./routes/UserRoute');  

    const app = express();
    app.use(passport.initialize());
    app.use(helmet());
    require('./passport')(passport);

    mongoose.Promise = global.Promise;
    mongoose.connect(config.DB, { useNewUrlParser: true }).then(
      () => {console.log('Database is connected') },
      err => { console.log('Can not connect to the database'+ err)}
    );
    app.use(bodyParser.json());
    app.use(cors());
    const port = process.env.PORT || 4000;
    app.use('/auth', userroutes);   
    
    const server = app.listen(port, function(){
     console.log('Listening on port ' + port);
    });