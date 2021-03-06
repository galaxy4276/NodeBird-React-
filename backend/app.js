import express from 'express';
import logger from 'morgan';
import db from './models';
import postRouter from './routes/post';
import postsRouter from './routes/posts';
import userRouter from './routes/user';
import hashRouter from './routes/hashtag';
import cors from 'cors';
import passportConfig from './passport';
import cookie from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import hpp from 'hpp';
import helmet from 'helmet';
require('dotenv').config();


const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('디비 연결 성공');
  })
  .catch(console.error);
passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(logger('dev'));
}

app.use(cors({
  origin: ['http://localhost:3060', 'http://galaxyhi4276.co', 'http://www.galaxyhi4276.co', 'http://15.165.220.207'],
  credentials: true,
})); // *origin -> 허용 도메인 
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: process.env.NODE_ENV === 'production' && '.galaxyhi4276.co',
  }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/hashtag', hashRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);


app.listen(3065, () => {
  console.log('server running on 3065 PORT');
});